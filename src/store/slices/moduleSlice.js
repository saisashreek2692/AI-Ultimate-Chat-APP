import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { callClaude } from "../../lib/api";

/* ── OFFICE ── */
export const runOfficeTool = createAsyncThunk(
  "office/run",
  async ({ tool, input, input2, question, lang }, { rejectWithValue }) => {
    const pm = {
      summarize: `Summarize in 3-5 paragraphs:\n\n${input}`,
      translate: `Translate to ${lang || "Spanish"}:\n\n${input}`,
      extract: `Extract key points and action items:\n\n${input}`,
      format: `Clean and format professionally:\n\n${input}`,
      qa: `Answer: "${question}"\n\nDocument:\n${input}`,
      compare: `Compare these two docs:\n\nDoc 1:\n${input}\n\nDoc 2:\n${input2}`,
    };
    try {
      return await callClaude(
        [{ role: "user", content: pm[tool] }],
        "You are an expert document analyst.",
        1200,
      );
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const officeSlice = createSlice({
  name: "office",
  initialState: { tool: "summarize", input: "", result: "", loading: false },
  reducers: {
    setOfficeTool(state, { payload }) {
      state.tool = payload;
      state.result = "";
    },
    setOfficeInput(state, { payload }) {
      state.input = payload;
    },
    clearOffice(state) {
      state.input = "";
      state.result = "";
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
        s.result = `Error: ${payload}`;
      });
  },
});
export const { setOfficeTool, setOfficeInput, clearOffice } =
  officeSlice.actions;
export const officeReducer = officeSlice.reducer;

/* ── MEETINGS ── */
export const analyzeMeeting = createAsyncThunk(
  "meetings/analyze",
  async (transcript, { rejectWithValue }) => {
    try {
      const r = await callClaude(
        [
          {
            role: "user",
            content: `Analyze meeting:\n1. 3-4 sentence summary\n2. Key decisions\n3. Action items (format: "OWNER: Task - Due: timeframe")\n\n${transcript}`,
          },
        ],
        "You are an expert meeting analyst. Extract action items clearly.",
        1200,
      );
      const summary = r.split(/action items?:/i)[0].trim();
      const sec = r.split(/action items?:/i)[1] || "";
      let items = (sec.match(/[-•*]\s*.+|\d+\.\s*.+/gm) || []).map((a) => ({
        text: a.replace(/^[-•*\d.]\s*/, "").trim(),
        done: false,
      }));
      if (!items.length) {
        items = r
          .split("\n")
          .filter((l) => / by | will |Action:/i.test(l))
          .slice(0, 5)
          .map((l) => ({
            text: l.replace(/^[-•*\d.]\s*/, "").trim(),
            done: false,
          }));
      }
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
    setRecording(state, { payload }) {
      state.recording = payload;
    },
    appendTranscript(state, { payload }) {
      state.transcript += (state.transcript ? "\n" : "") + payload;
    },
    clearMeeting(state) {
      state.transcript = "";
      state.summary = "";
      state.actionItems = [];
      state.recording = false;
    },
    toggleActionItem(state, { payload: idx }) {
      state.actionItems[idx].done = !state.actionItems[idx].done;
    },
    loadSampleTranscript(state, { payload }) {
      state.transcript = payload;
      state.recording = false;
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
        s.summary = `Error: ${payload}`;
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
  async ({ name, nodes }, { rejectWithValue }) => {
    try {
      return await callClaude(
        [
          {
            role: "user",
            content: `Suggest 2-3 improvements for: "${name}"\nNodes: ${nodes.join(" → ")}`,
          },
        ],
        "You are a workflow automation expert. Be concise.",
        600,
      );
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const workflowSlice = createSlice({
  name: "workflow",
  initialState: { active: null, loading: false },
  reducers: {
    setActiveWorkflow(state, { payload }) {
      state.active = payload;
    },
    clearWorkflow(state) {
      state.active = null;
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
