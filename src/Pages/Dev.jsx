import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCode, setLang, runDevAction } from "../store/slices/devSlice";
import { showToast } from "../store/slices/uiSlice";
import { Spinner } from "../components/ui";

const LANGS = [
  "javascript",
  "python",
  "typescript",
  "java",
  "go",
  "rust",
  "sql",
  "bash",
];
const EXT = {
  javascript: "js",
  python: "py",
  typescript: "ts",
  java: "java",
  go: "go",
  rust: "rs",
  sql: "sql",
  bash: "sh",
};
const ACTIONS = [
  { id: "generate", label: "✨ Generate", primary: true },
  { id: "debug", label: "🐛 Debug" },
  { id: "document", label: "📄 Docs" },
  { id: "explain", label: "🔍 Explain" },
  { id: "optimize", label: "⚡ Optimize" },
];

export default function Dev() {
  const dispatch = useDispatch();
  const { code, lang, log, loading } = useSelector((s) => s.dev);
  const [prompt, setPrompt] = useState("");
  const editorRef = useRef(null);

  const handleTab = (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = editorRef.current;
    const s = el.selectionStart;
    const newVal =
      el.value.slice(0, s) + "  " + el.value.slice(el.selectionEnd);
    dispatch(setCode(newVal));
    setTimeout(() => {
      el.selectionStart = el.selectionEnd = s + 2;
    }, 0);
  };

  const run = (action) => {
    dispatch(
      runDevAction({
        action,
        code: editorRef.current?.value ?? code,
        lang,
        prompt,
      }),
    )
      .unwrap()
      .then(({ action: a }) => {
        if (["generate", "debug", "optimize", "document"].includes(a)) {
          dispatch(showToast("Code updated in editor", "✨"));
        }
      })
      .catch((e) => dispatch(showToast(`Error: ${e}`, "⚠️")));
  };

  return (
    <>
      <div className="module-header">
        <div className="module-title-row">
          <div
            className="module-icon"
            style={{
              background: "rgba(34,212,200,0.1)",
              borderColor: "rgba(34,212,200,0.2)",
            }}
          >
            💻
          </div>
          <div>
            <div className="module-title">Developer Hub</div>
            <div className="module-sub">
              Code generation, debugging &amp; documentation
            </div>
          </div>
        </div>
      </div>

      <div className="dev-root">
        <div className="dev-body">
          {/* ── EDITOR ── */}
          <div className="code-panel">
            <div className="code-wrap">
              <div className="code-hdr">
                <div className="ftab active">main.{EXT[lang] ?? "js"}</div>
                <div
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    color: "var(--text3)",
                  }}
                >
                  {lang}
                </div>
              </div>
              <textarea
                ref={editorRef}
                className="code-ta"
                spellCheck={false}
                placeholder="// Start coding or ask AI to generate…"
                value={code}
                onChange={(e) => dispatch(setCode(e.target.value))}
                onKeyDown={handleTab}
              />
            </div>

            <div className="code-acts">
              {ACTIONS.map(({ id, label, primary }) => (
                <button
                  key={id}
                  className={`btn ${primary ? "btn-primary" : "btn-secondary"} btn-sm`}
                  onClick={() => run(id)}
                  disabled={loading}
                >
                  {loading && id === "generate" ? (
                    <>
                      <Spinner /> Working…
                    </>
                  ) : (
                    label
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="dev-side">
            <div className="card-sm">
              <div className="ctitle">Language</div>
              <select
                className="lang-sel"
                value={lang}
                onChange={(e) => dispatch(setLang(e.target.value))}
              >
                {LANGS.map((l) => (
                  <option key={l} value={l}>
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="card-sm">
              <div className="ctitle">AI Prompt</div>
              <textarea
                style={{
                  width: "100%",
                  height: 72,
                  padding: "8px 10px",
                  background: "var(--bg2)",
                  border: "1px solid var(--border2)",
                  borderRadius: 8,
                  color: "var(--text)",
                  fontSize: 12,
                  outline: "none",
                  resize: "none",
                  fontFamily: "inherit",
                }}
                placeholder="Describe what to generate or fix…"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    run("custom");
                  }
                }}
              />
              <button
                className="btn btn-primary btn-sm"
                style={{
                  marginTop: 8,
                  width: "100%",
                  justifyContent: "center",
                }}
                onClick={() => run("custom")}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner /> Running…
                  </>
                ) : (
                  "Run AI"
                )}
              </button>
            </div>

            <div
              className="card-sm"
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <div className="ctitle">Output Log</div>
              <div
                className="log-out"
                dangerouslySetInnerHTML={{
                  __html:
                    log ||
                    '<span style="color:var(--text3)">// AI output appears here</span>',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
