import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { callClaude } from "../../lib/api";

const SYS = {
  generate: (lang) =>
    `Expert ${lang} developer. Generate clean production-ready code. Return ONLY code with brief comments.`,
  debug: () =>
    `Debugging expert. Find bugs and provide fixed code with explanation.`,
  document: (lang) =>
    `Add comprehensive comments/docstrings to this ${lang} code.`,
  explain: (lang) => `Explain this ${lang} code clearly.`,
  optimize: (lang) => `Optimize this ${lang} code for speed and readability.`,
  custom: (lang) =>
    `Expert ${lang} developer. Follow the user's instruction precisely.`,
};

export const runDevAction = createAsyncThunk(
  "dev/runAction",
  async ({ action, code, lang, prompt }, { rejectWithValue }) => {
    try {
      const msg =
        action === "custom"
          ? `${prompt}\n\nCode:\n\`\`\`${lang}\n${code}\n\`\`\``
          : action === "generate"
            ? `Generate ${lang} code: ${prompt || "as described"}\n\nContext:\n\`\`\`${lang}\n${code}\n\`\`\``
            : `${action} this ${lang} code:\n\`\`\`${lang}\n${code}\n\`\`\``;
      const reply = await callClaude(
        [{ role: "user", content: msg }],
        SYS[action]?.(lang),
        1500,
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
    code: `// AIPP Dev Hub\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\nconsole.log(greet("AIPP"));`,
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runDevAction.pending, (state) => {
        state.loading = true;
        state.log = "";
      })
      .addCase(
        runDevAction.fulfilled,
        (state, { payload: { reply, action } }) => {
          state.loading = false;
          state.log = reply;
          if (["generate", "debug", "optimize", "document"].includes(action)) {
            const m = reply.match(/```(?:\w+)?\n([\s\S]*?)```/);
            if (m) state.code = m[1];
          }
        },
      )
      .addCase(runDevAction.rejected, (state, { payload }) => {
        state.loading = false;
        state.log = `Error: ${payload}`;
      });
  },
});

export const { setCode, setLang } = devSlice.actions;
export default devSlice.reducer;
