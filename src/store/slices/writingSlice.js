import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { callClaude } from "../../lib/api";
import { deductCredits, selectAgent, canUseAI } from "./billingSlice";

const TYPE_SYSTEM = {
  blog: "Expert blog writer. Write engaging, well-structured blog posts with markdown headings.",
  email: "Expert business email writer. Write clear, professional emails.",
  resume:
    "Professional resume writer. ATS-friendly, strong action verbs, quantifiable achievements.",
  social:
    "Social media expert. Engaging, platform-optimized posts. Include hashtag suggestions.",
  report:
    "Business analyst. Clear, structured reports with executive summary and recommendations.",
  creative:
    "Creative writing expert. Vivid, imaginative content with compelling narrative.",
};
const TYPE_LABEL = {
  blog: "blog post",
  email: "email",
  resume: "resume section",
  social: "social media post",
  report: "professional report",
  creative: "creative piece",
};
const IMPROVE = {
  grammar:
    "Fix all grammar, spelling, punctuation. Preserve style. Return only corrected text.",
  tone: "Improve to be more professional, engaging, persuasive. Same content. Return only improved text.",
  expand:
    "Expand significantly — more detail, examples, depth. Double the length. Return only expanded text.",
  shorten:
    "Condense to essential points. Remove redundancy. Half the length. Return only shortened text.",
};

const creditGuard = (state) => {
  if (!canUseAI(state))
    return state.billing.cooldownUntil ? "COOLDOWN" : "NO_CREDITS";
  return null;
};

export const generateContent = createAsyncThunk(
  "writing/generate",
  async ({ prompt, type }, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const err = creditGuard(state);
    if (err) return rejectWithValue(err);
    const agent = selectAgent(state);
    const user = state.auth.user;
    try {
      const r = await callClaude(
        [
          {
            role: "user",
            content: `Write a ${TYPE_LABEL[type] || "piece"} about: "${prompt}". Make it engaging and well-structured.`,
          },
        ],
        TYPE_SYSTEM[type] || TYPE_SYSTEM.blog,
        1500,
        agent.id,
      );
      dispatch(
        deductCredits({
          email: user.email,
          amount: agent.creditCost,
          agent: agent.id,
          module: "writing",
        }),
      );
      return r;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const improveContent = createAsyncThunk(
  "writing/improve",
  async ({ action, text }, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const err = creditGuard(state);
    if (err) return rejectWithValue(err);
    const agent = selectAgent(state);
    const user = state.auth.user;
    try {
      const r = await callClaude(
        [{ role: "user", content: `${IMPROVE[action]}\n\n---\n${text}\n---` }],
        "World-class editor. Follow instruction exactly, return only resulting text.",
        1500,
        agent.id,
      );
      dispatch(
        deductCredits({
          email: user.email,
          amount: agent.creditCost,
          agent: agent.id,
          module: "writing",
        }),
      );
      return r;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const writingSlice = createSlice({
  name: "writing",
  initialState: {
    content: "",
    type: "blog",
    prompt: "",
    loading: false,
    error: null,
  },
  reducers: {
    setContent(state, { payload }) {
      state.content = payload;
    },
    setType(state, { payload }) {
      state.type = payload;
    },
    setPrompt(state, { payload }) {
      state.prompt = payload;
    },
    clearContent(state) {
      state.content = "";
      state.prompt = "";
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(generateContent.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(generateContent.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.content = payload;
      })
      .addCase(generateContent.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      })
      .addCase(improveContent.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(improveContent.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.content = payload;
      })
      .addCase(improveContent.rejected, (s, { payload }) => {
        s.loading = false;
        s.error = payload;
      });
  },
});
export const { setContent, setType, setPrompt, clearContent } =
  writingSlice.actions;
export default writingSlice.reducer;
