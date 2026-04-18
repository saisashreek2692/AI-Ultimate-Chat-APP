import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { callClaude } from "../../lib/api";
import { deductCredits, selectAgent, canUseAI, AGENTS } from "./billingSlice";

export const sendMessage = createAsyncThunk(
  "brain/sendMessage",
  async (
    { content, user, historySnapshot },
    { getState, dispatch, rejectWithValue },
  ) => {
    const state = getState();

    // ── Credit / role guard ──
    if (!canUseAI(state)) {
      const cd = state.billing.cooldownUntil;
      if (cd) return rejectWithValue("COOLDOWN");
      if (state.billing.credits <= 0) return rejectWithValue("NO_CREDITS");
      return rejectWithValue("NO_PERMISSION");
    }

    const agent = selectAgent(state);
    try {
      const messages = [...historySnapshot, { role: "user", content }];
      const reply = await callClaude(
        messages,
        `You are AIPP Brain, the central AI of the AI Unified Productivity Platform. ` +
          `You help with coding, writing, meetings, workflows, and all productivity tasks. ` +
          `Be helpful, concise, and professional. User: ${user?.name || "User"}. ` +
          `You are running as ${agent.name} (${agent.provider}).`,
        Math.min(1500, AGENTS[agent.id]?.creditCost >= 8 ? 4000 : 1500),
        agent.id,
      );
      // Deduct credits
      dispatch(
        deductCredits({
          email: user.email,
          amount: agent.creditCost,
          agent: agent.id,
          module: "brain",
        }),
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
      .addCase(sendMessage.pending, (s) => {
        s.loading = true;
      })
      .addCase(sendMessage.fulfilled, (s, { payload }) => {
        s.loading = false;
        s.history.push({ role: "assistant", content: payload });
      })
      .addCase(sendMessage.rejected, (s, { payload }) => {
        s.loading = false;
        const msg =
          payload === "COOLDOWN"
            ? "⏳ Credit cooldown active. Upgrade your plan or wait for the timer to reset."
            : payload === "NO_CREDITS"
              ? "💳 No credits remaining. Upgrade your plan or wait for cooldown to reset."
              : payload === "NO_PERMISSION"
                ? "🔒 Your role does not have permission to use AI features."
                : `⚠️ **Error:** ${payload}`;
        s.history.push({ role: "assistant", content: msg });
      });
  },
});

export const { clearHistory, addUserMessage } = brainSlice.actions;
export default brainSlice.reducer;
