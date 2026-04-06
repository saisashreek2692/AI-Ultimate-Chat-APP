import React, { useState } from "react";
import "../../styles/Modules.css";
import { modules } from "../../data/modules";
import DetailPanel from "./DetailPanel";

export default function Modules() {
  const [activeIdx, setActiveIdx] = useState(null);

  const handleToggle = (i) => {
    if (activeIdx === i) {
      setActiveIdx(null); // close
    } else {
      setActiveIdx(i); // open
    }
  };

  return (
    <>
      {/* Modules Component */}
      <section className="section" id="sec-modules">
        <div className="section-eyebrow">Platform Modules</div>
        <div className="section-title">Everything in One Place</div>
        <p className="section-sub">
          10 production-grade modules, all controlled by your AI brain. Click
          any module to explore its features.
        </p>

        <div className="module-grid">
          {modules.map((m, i) => (
            <div
              key={i}
              id={`mc-${i}`}
              className={`module-card ${activeIdx === i ? "active" : ""}`}
              onClick={() => handleToggle(i)}
              style={{
                "--card-accent": m.color,
                "--card-glow": `radial-gradient(ellipse at top left, ${m.color}10 0%, transparent 60%)`,
                "--card-icon-bg": `${m.color}18`,
                "--card-icon-border": `${m.color}30`,
              }}
            >
              <div
                className="card-phase"
                style={{ background: m.phaseColor, color: m.phaseText }}
              >
                {m.phase}
              </div>

              <div className="card-icon">{m.icon}</div>
              <div className="card-title">{m.title}</div>
              <div className="card-desc">{m.desc}</div>

              <div className="card-tags">
                {m.tags.map((t, idx) => (
                  <span key={idx} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
      {activeIdx !== null && (
        <DetailPanel module={modules[activeIdx]} onClose={() => setActiveIdx(null)} />
      )}

        {/* <div className="module-grid" id="module-grid"></div>
        <div className="detail-panel" id="detail-panel">
          <div className="detail-header">
            <div>
              <div className="detail-icon" id="d-icon"></div>
              <div className="detail-title" id="d-title"></div>
              <div className="detail-sub" id="d-sub"></div>
            </div>
            <button className="detail-close" onclick="closeDetail()">
              ✕ Close
            </button>
          </div>
          <div className="features-grid" id="d-features"></div>
        </div> */}
      </section>
    </>
  );
}
