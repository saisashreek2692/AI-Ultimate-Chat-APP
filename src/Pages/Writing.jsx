import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setContent,
  setType,
  setPrompt,
  clearContent,
  generateContent,
  improveContent,
} from "../store/slices/writingSlice";
import { toggleDrawer, closeDrawer, showToast } from "../store/slices/uiSlice";
import { Spinner } from "../components/ui";
import { wordCount } from "../lib/api";

const TYPES = [
  { id: "blog", icon: "📰", label: "Blog" },
  { id: "email", icon: "📧", label: "Email" },
  { id: "resume", icon: "📋", label: "Resume" },
  { id: "social", icon: "📱", label: "Social" },
  { id: "report", icon: "📊", label: "Report" },
  { id: "creative", icon: "✨", label: "Creative" },
];

const IMPROVE_ACTIONS = [
  { id: "grammar", label: "✓ Grammar" },
  { id: "tone", label: "🎯 Tone" },
  { id: "expand", label: "↔ Expand" },
  { id: "shorten", label: "↕ Shorten" },
];

function WritingSidebar({
  dispatch,
  content,
  type,
  prompt,
  loading,
  onGenerate,
  onImprove,
}) {
  return (
    <>
      <div className="card-sm">
        <div className="ctitle">Content Type</div>
        <div className="tgrid">
          {TYPES.map((t) => (
            <div
              key={t.id}
              className={`tbtn ${type === t.id ? "sel" : ""}`}
              onClick={() => dispatch(setType(t.id))}
            >
              <span className="ticon">{t.icon}</span>
              <span className="tlabel">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-sm">
        <div className="ctitle">AI Generate</div>
        <input
          className="assist-in"
          placeholder="Topic or prompt…"
          value={prompt}
          onChange={(e) => dispatch(setPrompt(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") onGenerate();
          }}
        />
        <button
          className="btn btn-primary btn-sm"
          style={{ width: "100%", marginTop: 8, justifyContent: "center" }}
          onClick={onGenerate}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner /> Generating…
            </>
          ) : (
            "✨ Generate"
          )}
        </button>
      </div>

      <div className="card-sm">
        <div className="ctitle">Improve</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {IMPROVE_ACTIONS.map(({ id, label }) => (
            <button
              key={id}
              className="btn btn-secondary btn-sm"
              onClick={() => onImprove(id)}
              disabled={loading}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-sm">
        <div className="ctitle">Stats</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            fontSize: 12,
          }}
        >
          {[
            ["Words", wordCount(content)],
            ["Characters", content.length],
            [
              "Read time",
              `~${Math.max(1, Math.ceil(wordCount(content) / 200))} min`,
            ],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span style={{ color: "var(--text3)" }}>{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Writing() {
  const dispatch = useDispatch();
  const { content, type, prompt, loading } = useSelector((s) => s.writing);
  const { drawerOpen } = useSelector((s) => s.ui);
  const editorRef = useRef(null);
  const wc = wordCount(content);

  const fmt = (pre, post) => {
    const el = editorRef.current;
    if (!el) return;
    const s = el.selectionStart,
      e = el.selectionEnd;
    const next =
      el.value.slice(0, s) +
      pre +
      el.value.slice(s, e) +
      post +
      el.value.slice(e);
    dispatch(setContent(next));
    setTimeout(() => {
      el.selectionStart = s + pre.length;
      el.selectionEnd = e + pre.length;
    }, 0);
  };

  const onGenerate = () => {
    if (!prompt.trim()) {
      dispatch(showToast("Enter a topic first", "💡"));
      return;
    }
    dispatch(generateContent({ prompt, type }))
      .unwrap()
      .then(() => dispatch(closeDrawer()))
      .catch((e) => dispatch(showToast(`Error: ${e}`, "⚠️")));
  };

  const onImprove = (action) => {
    if (!content.trim()) {
      dispatch(showToast("Write something first", "💡"));
      return;
    }
    dispatch(improveContent({ action, text: content }))
      .unwrap()
      .then(() => dispatch(closeDrawer()))
      .catch((e) => dispatch(showToast(`Error: ${e}`, "⚠️")));
  };

  return (
    <>
      <div className="module-header" style={{ paddingBottom: 8 }}>
        <div className="module-title-row">
          <div
            className="module-icon"
            style={{
              background: "rgba(245,158,11,0.1)",
              borderColor: "rgba(245,158,11,0.2)",
            }}
          >
            📝
          </div>
          <div>
            <div className="module-title">Writing Studio</div>
            <div className="module-sub">
              AI-powered content creation &amp; editing
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              navigator.clipboard.writeText(content);
              dispatch(showToast("Copied to clipboard", "⎘"));
            }}
          >
            ⎘ Copy
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => dispatch(clearContent())}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="studio-root">
        <div className="studio-body">
          {/* ── EDITOR ── */}
          <div className="editor-panel">
            <div className="editor-tb">
              <button className="tb-btn" onClick={() => fmt("**", "**")}>
                <b>B</b>
              </button>
              <button className="tb-btn" onClick={() => fmt("*", "*")}>
                <i>I</i>
              </button>
              <button className="tb-btn" onClick={() => fmt("\n# ", "")}>
                H1
              </button>
              <button className="tb-btn" onClick={() => fmt("\n## ", "")}>
                H2
              </button>
              <span className="tb-sep" />
              <button className="tb-btn" onClick={() => fmt("\n- ", "")}>
                • List
              </button>
              <button className="tb-btn" onClick={() => fmt("\n> ", "")}>
                ❝
              </button>
              <span className="tb-sep" />
              {IMPROVE_ACTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  className="tb-btn"
                  onClick={() => onImprove(id)}
                  disabled={loading}
                >
                  {label}
                </button>
              ))}
            </div>

            <textarea
              ref={editorRef}
              className="editor-area"
              placeholder="Start writing or use AI to generate…"
              value={content}
              onChange={(e) => dispatch(setContent(e.target.value))}
            />
            <div className="wc">{wc} words</div>
          </div>

          {/* ── DESKTOP SIDEBAR ── */}
          <div className="write-side">
            <WritingSidebar
              dispatch={dispatch}
              content={content}
              type={type}
              prompt={prompt}
              loading={loading}
              onGenerate={onGenerate}
              onImprove={onImprove}
            />
          </div>
        </div>
      </div>

      {/* ── MOBILE FAB + DRAWER ── */}
      <button className="write-fab" onClick={() => dispatch(toggleDrawer())}>
        ✨
      </button>
      <div className={`write-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="dhandle" />
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
          AI Writing Assistant
        </div>
        <WritingSidebar
          dispatch={dispatch}
          content={content}
          type={type}
          prompt={prompt}
          loading={loading}
          onGenerate={onGenerate}
          onImprove={onImprove}
        />
      </div>
    </>
  );
}
