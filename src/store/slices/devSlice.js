import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { callClaude } from "../../lib/api";
import { deductCredits, selectAgent, canUseAI } from "./billingSlice";

const CODE_ACTIONS = new Set(["generate", "debug", "optimize", "document"]);

const SYSTEM = {
  generate: (lang) =>
    `Expert ${lang} developer. Generate clean, production-ready code inside a fenced \`\`\`${lang} block, then explain briefly.`,
  debug: (lang) =>
    `Debugging expert. Find all bugs in this ${lang} code. Return fixed code in a fenced block, then explain each fix.`,
  document: (lang) =>
    `Technical writer. Add comprehensive JSDoc/docstring comments to this ${lang} code. Return the documented code in a fenced block.`,
  explain: (lang) =>
    `${lang} expert teacher. Explain this code clearly in plain English. What it does, how it works, patterns used.`,
  optimize: (lang) =>
    `Performance expert. Rewrite this ${lang} code for maximum clarity and efficiency. Return optimized code in a fenced block, then explain changes.`,
  custom: (lang) =>
    `Expert ${lang} developer. Follow the user's instruction precisely and completely.`,
};

export const runDevAction = createAsyncThunk(
  "dev/runAction",
  async (
    { action, code, lang, prompt },
    { getState, dispatch, rejectWithValue },
  ) => {
    const state = getState();
    if (!canUseAI(state))
      return rejectWithValue(
        state.billing.cooldownUntil ? "COOLDOWN" : "NO_CREDITS",
      );

    const agent = selectAgent(state);
    const user = state.auth.user;

    const userMsg =
      action === "custom"
        ? `${prompt}\n\nCode:\n\`\`\`${lang}\n${code}\n\`\`\``
        : action === "generate"
          ? `Generate ${lang} code for: ${prompt || "a useful utility"}\n\nContext:\n\`\`\`${lang}\n${code}\n\`\`\``
          : `Please ${action} this ${lang} code:\n\`\`\`${lang}\n${code}\n\`\`\``;
    try {
      const reply = await callClaude(
        [{ role: "user", content: userMsg }],
        SYSTEM[action]?.(lang) ?? SYSTEM.custom(lang),
        2000,
        agent.id,
      );
      dispatch(
        deductCredits({
          email: user.email,
          amount: agent.creditCost,
          agent: agent.id,
          module: "dev",
        }),
      );
      return { reply, action };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const devSlice = createSlice({
  name: "dev",
  initialState: {
    code: `// Welcome to AIPP Dev Hub\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to AIPP.\`;\n}\nconsole.log(greet('Developer'));`,
    lang: "javascript",
    log: "",
    loading: false,
  },
  reducers: {
    setCode(state, { payload }) {
      state.code = payload;
    },
    setLang(state, { payload }) {
      state.lang = payload;
      state.log = "";
    },
    clearLog(state) {
      state.log = "";
    },
  },
  extraReducers: (b) => {
    b.addCase(runDevAction.pending, (s) => {
      s.loading = true;
      s.log = "";
    })
      .addCase(runDevAction.fulfilled, (s, { payload: { reply, action } }) => {
        s.loading = false;
        s.log = reply;
        if (CODE_ACTIONS.has(action)) {
          const m = reply.match(/```(?:\w+)?\n([\s\S]*?)```/);
          if (m) s.code = m[1].trimEnd();
        }
      })
      .addCase(runDevAction.rejected, (s, { payload }) => {
        s.loading = false;
        s.log =
          payload === "COOLDOWN"
            ? "⏳ Cooldown active — upgrade your plan or wait."
            : payload === "NO_CREDITS"
              ? "💳 No credits — upgrade plan or wait for cooldown."
              : `⚠️ Error: ${payload}`;
      });
  },
});

export const { setCode, setLang, clearLog } = devSlice.actions;
export default devSlice.reducer;
