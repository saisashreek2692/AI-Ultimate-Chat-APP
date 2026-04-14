import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { callClaude } from "../../lib/api";

const TYPE_MAP = {
  blog: "a blog post",
  email: "an email",
  resume: "a resume section",
  social: "a social media post",
  report: "a professional report",
  creative: "creative writing",
};
const IMPROVE_MAP = {
  grammar: "Fix all grammar errors, preserving style.",
  tone: "Improve tone to be more professional and engaging.",
  expand: "Expand with more detail, aim to double length.",
  shorten: "Shorten to key points at half the length.",
};

export const generateContent = createAsyncThunk(
  "writing/generate",
  async ({ prompt, type }, { rejectWithValue }) => {
    try {
      return await callClaude(
        [
          {
            role: "user",
            content: `Write ${TYPE_MAP[type] || "content"} about: "${prompt}". Make it professional and engaging.`,
          },
        ],
        "You are an expert content writer. Produce high-quality content with proper markdown.",
        1200,
      );
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const improveContent = createAsyncThunk(
  "writing/improve",
  async ({ action, text }, { rejectWithValue }) => {
    try {
      return await callClaude(
        [{ role: "user", content: `${IMPROVE_MAP[action]}\n\nText:\n${text}` }],
        "You are a professional editor. Return only the improved text.",
        1200,
      );
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const writingSlice = createSlice({
  name: "writing",
  initialState: { content: "", type: "blog", prompt: "", loading: false },
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateContent.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.content = payload;
      })
      .addCase(generateContent.rejected, (state) => {
        state.loading = false;
      })
      .addCase(improveContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(improveContent.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.content = payload;
      })
      .addCase(improveContent.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setContent, setType, setPrompt, clearContent } =
  writingSlice.actions;
export default writingSlice.reducer;
