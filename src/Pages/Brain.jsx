import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  sendMessage,
  clearHistory,
  addUserMessage,
} from "../store/slices/brainSlice";
import { Spinner, EmptyState } from "../components/ui";
import { formatMessage } from "../lib/api";

const QUICK_PROMPTS = [
  "✍️ Draft a project proposal",
  "🐛 Debug my code",
  "📋 Summarize a document",
  "📧 Write a follow-up email",
  "🎯 Plan my sprint",
  "🔄 Create a workflow",
];

function MessageBubble({ msg, userName }) {
  const isUser = msg.role === "user";
  return (
    <div className={`msg msg-${isUser ? "user" : "ai"}`}>
      <div className="mavatar">{isUser ? userName : "AI"}</div>
      <div className="mbody">
        <div className="mname">{isUser ? "You" : "AIPP Brain"}</div>
        <div
          className="mtext"
          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
        />
      </div>
    </div>
  );
}

export default function Brain() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { history, loading } = useSelector((s) => s.brain);
  const user = useSelector((s) => s.auth.user);
  const [draft, setDraft] = useState("");
  const msgsRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current)
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [history, loading]);

  const submit = () => {
    const text = draft.trim();
    if (!text || loading) return;
    setDraft("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    dispatch(addUserMessage(text));
    dispatch(sendMessage({ content: text, user, history }));
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleInput = (e) => {
    setDraft(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  const sendQuick = (prompt) => {
    const text = prompt.replace(/^[\p{Emoji}\s]+/u, "").trim();
    setDraft("");
    dispatch(addUserMessage(text));
    dispatch(sendMessage({ content: text, user, history }));
  };

  return (
    <>
      <div className="module-header" style={{ paddingBottom: 8 }}>
        <div className="module-title-row">
          <div
            className="module-icon"
            style={{
              background: "rgba(79,127,250,0.1)",
              borderColor: "rgba(79,127,250,0.2)",
            }}
          >
            🧠
          </div>
          <div>
            <div className="module-title">AI Brain</div>
            <div className="module-sub">Central intelligence engine</div>
          </div>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => dispatch(clearHistory())}
        >
          Clear
        </button>
      </div>

      <div className="quick-row">
        {QUICK_PROMPTS.map((q) => (
          <div key={q} className="qchip" onClick={() => sendQuick(q)}>
            {q}
          </div>
        ))}
      </div>

      <div className="chat-root">
        <div className="chat-body">
          <div className="chat-main">
            <div className="chat-msgs" ref={msgsRef}>
              {history.length === 0 && !loading ? (
                <EmptyState
                  icon="🧠"
                  title="Welcome to AIPP Brain"
                  sub="Your context-aware AI assistant. Ask anything or tap a quick prompt."
                />
              ) : (
                history.map((msg, i) => (
                  <MessageBubble key={i} msg={msg} userName={user?.initials} />
                ))
              )}
              {loading && (
                <div className="msg msg-ai">
                  <div className="mavatar">AI</div>
                  <div className="mbody">
                    <div className="mname">AIPP Brain</div>
                    <div className="mtext">
                      <Spinner />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-in-row">
              <textarea
                ref={textareaRef}
                className="chat-ta"
                placeholder="Ask anything — I control all modules…"
                rows={1}
                value={draft}
                onChange={handleInput}
                onKeyDown={handleKey}
              />
              <button
                className="send-btn"
                onClick={submit}
                disabled={loading || !draft.trim()}
              >
                {loading ? <Spinner /> : "➤"}
              </button>
            </div>
          </div>

          <div className="chat-side">
            <div className="card-sm">
              <div className="ctitle">Active Context</div>
              <div className="citem">
                <div className="cdot" style={{ background: "var(--green)" }} />
                <div className="ctext">Project: AIPP</div>
              </div>
              <div className="citem">
                <div className="cdot" style={{ background: "var(--blue)" }} />
                <div className="ctext">{history.length} messages</div>
              </div>
              <div className="citem">
                <div className="cdot" style={{ background: "var(--amber)" }} />
                <div className="ctext">Model: Claude</div>
              </div>
            </div>
            <div className="card-sm">
              <div className="ctitle">Quick Nav</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  marginTop: 4,
                }}
              >
                {[
                  ["writing", "📝 Writing Studio"],
                  ["dev", "💻 Dev Hub"],
                  ["workflow", "🔄 Workflows"],
                ].map(([path, label]) => (
                  <button
                    key={path}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: "flex-start" }}
                    onClick={() => navigate(`/main/${path}`)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
