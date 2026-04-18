import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { callClaude } from "../../lib/api";
import { deductCredits, selectAgent, canUseAI } from "./billingSlice";

const guard = (state) =>
  !canUseAI(state)
    ? state.billing.cooldownUntil
      ? "COOLDOWN"
      : "NO_CREDITS"
    : null;

/* ── OFFICE ── */
export const runOfficeTool = createAsyncThunk(
  "office/run",
  async (
    { tool, input, input2, question, lang },
    { getState, dispatch, rejectWithValue },
  ) => {
    const state = getState();
    const err = guard(state);
    if (err) return rejectWithValue(err);
    const agent = selectAgent(state);
    const user = state.auth.user;
    const pm = {
      summarize: `Summarize:\n1. 2-3 sentence executive summary\n2. Key points\n3. Conclusions\n\n${input}`,
      translate: `Translate to ${lang}. Maintain tone and formatting.\n\n${input}`,
      extract: `Extract:\n1. Main topics\n2. Key facts\n3. Action items\n4. Decisions\n\n${input}`,
      format: `Clean, format, and professionally structure this text. Return well-formatted markdown.\n\n${input}`,
      qa: `Answer based only on this document.\n\nQuestion: ${question}\n\nDocument:\n${input}`,
      compare: `Compare:\n1. Similarities\n2. Differences\n3. Which is stronger and why\n4. Recommendations\n\nDoc 1:\n${input}\n\nDoc 2:\n${input2}`,
    };
    try {
      const r = await callClaude(
        [{ role: "user", content: pm[tool] }],
        "Expert document analyst. Clear, well-structured, professional responses.",
        1500,
        agent.id,
      );
      dispatch(
        deductCredits({
          email: user.email,
          amount: agent.creditCost,
          agent: agent.id,
          module: "office",
        }),
      );
      return r;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const officeSlice = createSlice({
  name: "office",
  initialState: { tool: "summarize", input: "", result: "", loading: false },
  reducers: {
    setOfficeTool(s, { payload }) {
      s.tool = payload;
      s.result = "";
    },
    setOfficeInput(s, { payload }) {
      s.input = payload;
    },
    clearOffice(s) {
      s.input = "";
      s.result = "";
    },
  },
  extraReducers: (b) => {
    b.addCase(runOfficeTool.pending, (s) => {
      s.loading = true;
    })
      .addCase(runOfficeTool.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.result = payload;
      })
      .addCase(runOfficeTool.rejected, (s, { payload }) => {
        s.loading = false;
        s.result =
          payload === "COOLDOWN"
            ? "⏳ Cooldown active."
            : payload === "NO_CREDITS"
              ? "💳 No credits remaining."
              : `⚠️ Error: ${payload}`;
      });
  },
});
export const { setOfficeTool, setOfficeInput, clearOffice } =
  officeSlice.actions;
export const officeReducer = officeSlice.reducer;

/* ── MEETINGS ── */
export const analyzeMeeting = createAsyncThunk(
  "meetings/analyze",
  async (transcript, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const err = guard(state);
    if (err) return rejectWithValue(err);
    const agent = selectAgent(state);
    const user = state.auth.user;
    const prompt = `Analyze this meeting transcript.\n\nTRANSCRIPT:\n${transcript}\n\nProvide:\n\nSUMMARY:\n[3-4 sentence summary]\n\nKEY DECISIONS:\n[bullet list]\n\nACTION ITEMS:\n[• OWNER: Task — Due: timeframe]\n\nNEXT STEPS:\n[2-3 recommended next steps]`;
    try {
      const raw = await callClaude(
        [{ role: "user", content: prompt }],
        "Expert meeting facilitator. Extract information accurately.",
        1500,
        agent.id,
      );
      dispatch(
        deductCredits({
          email: user.email,
          amount: agent.creditCost,
          agent: agent.id,
          module: "meetings",
        }),
      );
      const summaryM = raw.match(/SUMMARY:\s*([\s\S]*?)(?=KEY DECISIONS:|$)/i);
      const actionsM = raw.match(
        /ACTION ITEMS:\s*([\s\S]*?)(?=NEXT STEPS:|$)/i,
      );
      const summary = summaryM?.[1]?.trim() || raw.slice(0, 300);
      const items = (actionsM?.[1] || "")
        .split("\n")
        .map((l) => l.replace(/^[•\-*]\s*/, "").trim())
        .filter((l) => l.length > 5)
        .map((text) => ({ text, done: false }));
      return { summary, items };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const meetingsSlice = createSlice({
  name: "meetings",
  initialState: {
    recording: false,
    transcript: "",
    summary: "",
    actionItems: [],
    loading: false,
  },
  reducers: {
    setRecording(s, { payload }) {
      s.recording = payload;
    },
    appendTranscript(s, { payload }) {
      s.transcript += (s.transcript ? "\n" : "") + payload;
    },
    clearMeeting(s) {
      s.transcript = "";
      s.summary = "";
      s.actionItems = [];
      s.recording = false;
    },
    toggleActionItem(s, { payload: i }) {
      if (s.actionItems[i]) s.actionItems[i].done = !s.actionItems[i].done;
    },
    loadSampleTranscript(s, { payload }) {
      s.transcript = payload;
      s.recording = false;
    },
  },
  extraReducers: (b) => {
    b.addCase(analyzeMeeting.pending, (s) => {
      s.loading = true;
    })
      .addCase(
        analyzeMeeting.fulfilled,
        (s, { payload: { summary, items } }) => {
          s.loading = false;
          s.summary = summary;
          s.actionItems = items;
        },
      )
      .addCase(analyzeMeeting.rejected, (s, { payload }) => {
        s.loading = false;
        s.summary =
          payload === "COOLDOWN"
            ? "⏳ Cooldown active."
            : payload === "NO_CREDITS"
              ? "💳 No credits."
              : `⚠️ ${payload}`;
      });
  },
});
export const {
  setRecording,
  appendTranscript,
  clearMeeting,
  toggleActionItem,
  loadSampleTranscript,
} = meetingsSlice.actions;
export const meetingsReducer = meetingsSlice.reducer;

/* ── WORKFLOW ── */
export const enhanceWorkflow = createAsyncThunk(
  "workflow/enhance",
  async ({ name, nodes }, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const err = guard(state);
    if (err) return rejectWithValue(err);
    const agent = selectAgent(state);
    const user = state.auth.user;
    try {
      const r = await callClaude(
        [
          {
            role: "user",
            content: `Suggest 3 specific improvements for this workflow:\n"${name}"\nSteps: ${nodes.join(" → ")}\n\nFor each: what to change and why.`,
          },
        ],
        "Expert in workflow automation and business process optimization. Be specific and practical.",
        800,
        agent.id,
      );
      dispatch(
        deductCredits({
          email: user.email,
          amount: agent.creditCost,
          agent: agent.id,
          module: "workflow",
        }),
      );
      return r;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const workflowSlice = createSlice({
  name: "workflow",
  initialState: { active: null, loading: false },
  reducers: {
    setActiveWorkflow(s, { payload }) {
      s.active = payload;
    },
    clearWorkflow(s) {
      s.active = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(enhanceWorkflow.pending, (s) => {
      s.loading = true;
    })
      .addCase(enhanceWorkflow.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(enhanceWorkflow.rejected, (s) => {
        s.loading = false;
      });
  },
});
export const { setActiveWorkflow, clearWorkflow } = workflowSlice.actions;
export const workflowReducer = workflowSlice.reducer;
