import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  setActiveWorkflow,
  clearWorkflow,
  enhanceWorkflow,
} from "../store/slices/moduleSlice";
import { addUserMessage } from "../store/slices/brainSlice";
import { showToast } from "../store/slices/uiSlice";
import { Spinner, EmptyState } from "../components/ui";

const TEMPLATES = [
  {
    icon: "📅",
    name: "Meeting → Tasks",
    desc: "Auto-create tasks from notes",
    nodes: [
      "Meeting ends",
      "AI extracts items",
      "Tasks in Notion",
      "Slack notify",
    ],
  },
  {
    icon: "📧",
    name: "Email → CRM",
    desc: "Auto-log emails to CRM contacts",
    nodes: ["Email received", "AI categorizes", "CRM updated", "Follow-up set"],
  },
  {
    icon: "🐛",
    name: "Alert → Ticket",
    desc: "Auto-create incident tickets",
    nodes: ["Alert triggered", "AI analyzes log", "Jira ticket", "Team paged"],
  },
  {
    icon: "📝",
    name: "Content Pipeline",
    desc: "Generate & publish content",
    nodes: ["Topic selected", "AI generates", "Review", "Auto-publish"],
  },
  {
    icon: "🔄",
    name: "Data Sync",
    desc: "Sync data across platforms",
    nodes: ["Change detected", "Validate", "Transform", "Sync"],
  },
  {
    icon: "📊",
    name: "Weekly Report",
    desc: "Auto weekly status reports",
    nodes: [
      "Monday 9AM",
      "Gather metrics",
      "AI writes report",
      "Email stakeholders",
    ],
  },
];

const NODE_STYLES = [
  {
    bg: "rgba(79,127,250,0.12)",
    border: "rgba(79,127,250,0.35)",
    text: "#7FA8FF",
    label: "TRIGGER",
  },
  {
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.35)",
    text: "#FCD34D",
    label: "AI NODE",
  },
  {
    bg: "rgba(34,212,200,0.12)",
    border: "rgba(34,212,200,0.35)",
    text: "#5EEAD4",
    label: "ACTION",
  },
  {
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.35)",
    text: "#C4B5FD",
    label: "OUTPUT",
  },
];
const NODE_ICONS = ["🔵", "⚡", "✅", "📤"];

export default function Workflow() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { active, loading } = useSelector((s) => s.workflow);

  const handleEnhance = () => {
    if (!active) return;
    dispatch(showToast("AI analyzing workflow…", "🤖"));
    dispatch(enhanceWorkflow({ name: active.name, nodes: active.nodes }))
      .unwrap()
      .then((suggestion) => {
        dispatch(
          addUserMessage(
            `Workflow Enhancement Suggestions for "${active.name}":\n\n${suggestion}`,
          ),
        );
        dispatch(showToast("Suggestions sent to AI Brain", "💡"));
        navigate("/brain");
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
              background: "rgba(124,92,252,0.1)",
              borderColor: "rgba(124,92,252,0.2)",
            }}
          >
            🔄
          </div>
          <div>
            <div className="module-title">Workflow Engine</div>
            <div className="module-sub">
              Drag-and-drop automation with AI decision nodes
            </div>
          </div>
        </div>
        {active && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              dispatch(
                showToast("Workflow deployed! Running in background.", "🚀"),
              )
            }
          >
            🚀 Deploy
          </button>
        )}
      </div>

      <div className="wf-root">
        <div
          style={{
            marginBottom: 10,
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text2)",
          }}
        >
          Canvas{active ? ` — ${active.name}` : ""}
        </div>

        {/* CANVAS */}
        <div className="wf-canvas">
          <div className="wf-gridbg" />

          {active ? (
            <>
              <div className="wf-nodes">
                {active.nodes.map((node, i) => {
                  const s = NODE_STYLES[i % 4];
                  return (
                    <div key={i} style={{ display: "contents" }}>
                      <div
                        className="wf-node"
                        style={{ background: s.bg, borderColor: s.border }}
                      >
                        <span className="wf-nicon">{NODE_ICONS[i % 4]}</span>
                        <div className="wf-ninfo">
                          <div className="wf-ntype" style={{ color: s.text }}>
                            {s.label}
                          </div>
                          <div className="wf-nlabel">{node}</div>
                        </div>
                      </div>
                      {i < active.nodes.length - 1 && (
                        <div className="wf-conn">→</div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => dispatch(clearWorkflow())}
                >
                  ← Back
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleEnhance}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner /> Enhancing…
                    </>
                  ) : (
                    "✨ AI Enhance"
                  )}
                </button>
              </div>
            </>
          ) : (
            <EmptyState
              icon="🔄"
              title="Select a template below"
              sub="Or build a custom workflow from scratch"
            />
          )}
        </div>

        {/* TEMPLATES */}
        <div
          style={{
            marginBottom: 10,
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text2)",
          }}
        >
          Templates
        </div>
        <div className="wf-tgrid">
          {TEMPLATES.map((t) => (
            <div
              key={t.name}
              className="wf-tcard"
              onClick={() => {
                dispatch(setActiveWorkflow(t));
                dispatch(showToast("Workflow loaded", "🔄"));
              }}
            >
              <div className="wf-ticon">{t.icon}</div>
              <div className="wf-tname">{t.name}</div>
              <div className="wf-tdesc">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
