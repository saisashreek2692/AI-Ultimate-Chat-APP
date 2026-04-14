import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setRecording,
  appendTranscript,
  clearMeeting,
  toggleActionItem,
  loadSampleTranscript,
  analyzeMeeting,
} from "../store/slices/moduleSlice";
import { showToast } from "../store/slices/uiSlice";
import { Spinner, EmptyState } from "../components/ui";

const SAMPLE = `[00:00] Sarah: Let's kick off the Q3 planning session for AIPP platform.
[00:45] John: We should prioritize workflow automation — enterprise clients are waiting.
[02:10] Sarah: Agreed. Target July 15 for the automation engine launch.
[03:22] Maria: Core builder by July 15. AI decision nodes need an extra week.
[04:05] Sarah: Deadline moves to July 22. Action item for Maria's team.
[05:18] John: On meetings hub — I'll reach out to Zoom and Google Meet developer teams.
[06:44] Sarah: Any blockers?
[07:01] Maria: Need AWS infrastructure expanded. I'll submit a DevOps ticket by Friday.`;

const UPCOMING = [
  {
    time: "Today 2:00 PM",
    name: "Q3 Planning Sync",
    attendees: "Sarah, John, Maria",
    color: "var(--blue)",
  },
  {
    time: "Tomorrow 10:00 AM",
    name: "Investor Demo Prep",
    attendees: "Alex, Dev Team",
    color: "var(--violet)",
  },
  {
    time: "Fri 3:00 PM",
    name: "Sprint Retrospective",
    attendees: "Full Team",
    color: "var(--cyan)",
  },
];

export default function Meetings() {
  const dispatch = useDispatch();
  const { recording, transcript, summary, actionItems, loading } = useSelector(
    (s) => s.meetings,
  );
  const intervalRef = useRef(null);

  const toggleRecording = () => {
    if (!recording) {
      dispatch(setRecording(true));
      dispatch(clearMeeting());
      const lines = SAMPLE.split("\n").filter(Boolean);
      let i = 0;
      intervalRef.current = setInterval(() => {
        if (i >= lines.length) {
          clearInterval(intervalRef.current);
          return;
        }
        dispatch(appendTranscript(lines[i++]));
      }, 800);
    } else {
      clearInterval(intervalRef.current);
      dispatch(setRecording(false));
      dispatch(showToast("Recording saved", "🎙"));
    }
  };

  const handleAnalyze = () => {
    if (!transcript) return;
    dispatch(analyzeMeeting(transcript))
      .unwrap()
      .catch((e) => dispatch(showToast(`Error: ${e}`, "⚠️")));
  };

  return (
    <>
      <div className="module-header">
        <div className="module-title-row">
          <div
            className="module-icon"
            style={{
              background: "rgba(56,189,248,0.1)",
              borderColor: "rgba(56,189,248,0.2)",
            }}
          >
            📅
          </div>
          <div>
            <div className="module-title">Meetings Hub</div>
            <div className="module-sub">
              Record, transcribe &amp; extract action items
            </div>
          </div>
        </div>
      </div>

      <div className="mtg-root">
        <div className="mtg-grid">
          {/* RECORD CARD */}
          <div className="mrec-card">
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <button
                className={`rec-btn ${recording ? "recording" : "idle"}`}
                onClick={toggleRecording}
              >
                {recording ? "⏹" : "🎙"}
              </button>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>
                {recording ? "Recording…" : "Ready to Record"}
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>
                {recording ? "Click to stop" : "Click mic to start"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  clearInterval(intervalRef.current);
                  dispatch(loadSampleTranscript(SAMPLE));
                }}
              >
                📂 Load Sample
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  clearInterval(intervalRef.current);
                  dispatch(clearMeeting());
                }}
              >
                🗑 Clear
              </button>
            </div>

            <div className="ctitle">Transcript</div>
            <div className="ta-box">
              {transcript || (
                <span style={{ color: "var(--text3)" }}>
                  Transcript appears here…
                </span>
              )}
            </div>
          </div>

          {/* ANALYSIS CARD */}
          <div className="mrec-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                AI Meeting Intelligence
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAnalyze}
                disabled={loading || !transcript}
              >
                {loading ? (
                  <>
                    <Spinner /> Analyzing…
                  </>
                ) : (
                  "✨ Analyze"
                )}
              </button>
            </div>

            {summary ? (
              <>
                <div className="ctitle">Summary</div>
                <div
                  className="ta-box"
                  style={{ marginBottom: 14, color: "var(--text)" }}
                >
                  {summary}
                </div>
              </>
            ) : (
              <EmptyState
                icon="🤖"
                title="Load a transcript then click Analyze"
              />
            )}

            {actionItems.length > 0 && (
              <>
                <div className="ctitle">
                  Action Items ({actionItems.length})
                </div>
                <div className="ai-list">
                  {actionItems.map((item, i) => (
                    <div key={i} className="ai-item">
                      <div
                        className={`ai-check ${item.done ? "done" : ""}`}
                        onClick={() => dispatch(toggleActionItem(i))}
                      >
                        {item.done && (
                          <svg width="10" height="8" viewBox="0 0 10 8">
                            <path
                              d="M1 4L3.5 6.5L9 1"
                              stroke="white"
                              strokeWidth="1.5"
                              fill="none"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </div>
                      <div
                        className="ai-text"
                        style={
                          item.done
                            ? {
                                textDecoration: "line-through",
                                color: "var(--text3)",
                              }
                            : {}
                        }
                      >
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* UPCOMING MEETINGS */}
        <div className="card-sm">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              📆 Upcoming Meetings
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() =>
                dispatch(showToast("Calendar sync coming in Phase 2!", "📅"))
              }
            >
              Sync Calendar
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {UPCOMING.map((m) => (
              <div
                key={m.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "9px 12px",
                  background: "var(--surface2)",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    width: 3,
                    height: 32,
                    borderRadius: 2,
                    background: m.color,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>
                    {m.time} · {m.attendees}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
