import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setOfficeTool,
  setOfficeInput,
  clearOffice,
  runOfficeTool,
} from "../store/slices/moduleSlice";
import { showToast } from "../store/slices/uiSlice";
import { Spinner } from "../components/ui";
import { formatMessage } from "../lib/api";

const TOOLS = [
  {
    id: "summarize",
    icon: "📋",
    name: "Summarize",
    desc: "Condense documents",
  },
  { id: "translate", icon: "🌐", name: "Translate", desc: "Any language" },
  { id: "extract", icon: "🔍", name: "Key Points", desc: "Extract insights" },
  { id: "format", icon: "✨", name: "Format", desc: "Clean & structure" },
  { id: "qa", icon: "❓", name: "Q&A", desc: "Ask questions" },
  { id: "compare", icon: "⚖️", name: "Compare", desc: "Compare two docs" },
];

export default function Office() {
  const dispatch = useDispatch();
  const { tool, input, result, loading } = useSelector((s) => s.office);
  const [question, setQuestion] = useState("");
  const [input2, setInput2] = useState("");
  const [lang, setLang] = useState("");
  const current = TOOLS.find((t) => t.id === tool);

  const run = () => {
    if (!input.trim()) {
      dispatch(showToast("Enter some text first", "💡"));
      return;
    }
    dispatch(runOfficeTool({ tool, input, input2, question, lang }))
      .unwrap()
      .catch((e) => dispatch(showToast(`Error: ${e}`, "⚠️")));
  };

  return (
    <>
      <div className="module-header" style={{ paddingBottom: 0 }}>
        <div className="module-title-row">
          <div
            className="module-icon"
            style={{
              background: "rgba(124,92,252,0.1)",
              borderColor: "rgba(124,92,252,0.2)",
            }}
          >
            📊
          </div>
          <div>
            <div className="module-title">Smart Office</div>
            <div className="module-sub">AI-powered document intelligence</div>
          </div>
        </div>
      </div>

      <div className="office-root">
        {/* TOOL PICKER */}
        <div className="office-grid">
          {TOOLS.map((t) => (
            <div
              key={t.id}
              className={`otool ${tool === t.id ? "active" : ""}`}
              onClick={() => {
                dispatch(setOfficeTool(t.id));
                dispatch(clearOffice());
              }}
            >
              <div className="otool-icon">{t.icon}</div>
              <div className="otool-name">{t.name}</div>
              <div className="otool-desc">{t.desc}</div>
            </div>
          ))}
        </div>

        {/* ACTIVE PANEL */}
        <div className="opanel">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 20 }}>{current?.icon}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                {current?.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--text2)" }}>
                {current?.desc}
              </div>
            </div>
          </div>

          <textarea
            className="office-ta"
            placeholder="Paste your text or document here…"
            value={input}
            onChange={(e) => dispatch(setOfficeInput(e.target.value))}
          />

          {tool === "qa" && (
            <input
              className="office-extra-in"
              placeholder="What would you like to know about this document?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          )}
          {tool === "compare" && (
            <textarea
              className="office-ta"
              style={{ marginTop: 10 }}
              placeholder="Paste second document here…"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
            />
          )}
          {tool === "translate" && (
            <input
              className="office-extra-in"
              placeholder="Target language (e.g. Spanish, French, Japanese)"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            />
          )}

          <div
            style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}
          >
            <button
              className="btn btn-primary"
              onClick={run}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner /> Processing…
                </>
              ) : (
                "✨ Run AI"
              )}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                dispatch(clearOffice());
                setQuestion("");
                setInput2("");
                setLang("");
              }}
            >
              Clear
            </button>
          </div>

          {result && (
            <div
              className="office-result"
              dangerouslySetInnerHTML={{ __html: formatMessage(result) }}
            />
          )}
        </div>
      </div>
    </>
  );
}
