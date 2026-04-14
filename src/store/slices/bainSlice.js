import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { callClaude } from "../../lib/api";

export const sendMessage = createAsyncThunk(
  "brain/sendMessage",
  async ({ content, user, history }, { rejectWithValue }) => {
    try {
      const messages = [...history, { role: "user", content }];
      const reply = await callClaude(
        messages,
        `You are AIPP Brain, the central AI of the AI Unified Productivity Platform. Help with coding, writing, meetings, workflows and productivity. User: ${user.name}.`,
        1200,
      );
      return reply;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const brainSlice = createSlice({
  name: "brain",
  initialState: { history: [], loading: false },
  reducers: {
    clearHistory(state) {
      state.history = [];
    },
    addUserMessage(state, { payload }) {
      state.history.push({ role: "user", content: payload });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.history.push({ role: "assistant", content: payload });
      })
      .addCase(sendMessage.rejected, (state, { payload }) => {
        state.loading = false;
        state.history.push({
          role: "assistant",
          content: `⚠️ Error: ${payload}`,
        });
      });
  },
});

export const { clearHistory, addUserMessage } = brainSlice.actions;
export default brainSlice.reducer;
