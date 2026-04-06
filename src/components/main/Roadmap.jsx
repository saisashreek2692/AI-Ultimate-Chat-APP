import "../../styles/Roadmap.css";

export default function Roadmap() {
  return (
    <>
      <section className="section" id="sec-roadmap">
        <div className="section-eyebrow">MVP Strategy</div>
        <div className="section-title">Ship Smart, Scale Fast</div>
        <p className="section-sub">
          Don't build everything at once. Four phases from MVP to enterprise
          dominance.
        </p>

        <div className="roadmap">
          <div className="phase-card phase-1">
            <div className="phase-dot">1</div>
            <div className="phase-name" style={{ color: "#5b6ef5" }}>
              Foundation
            </div>
            <div className="phase-items">
              AI Chat Brain
              <br />
              Docs + Writing
              <br />
              Code Assistant
              <br />
              Memory System
            </div>
          </div>
          <div className="phase-card phase-2">
            <div className="phase-dot">2</div>
            <div className="phase-name" style={{ color: "#a78bfa" }}>
              Automation
            </div>
            <div className="phase-items">
              Workflow Engine
              <br />
              Meetings Hub
              <br />
              Calendar Sync
              <br />
              Email Follow-ups
            </div>
          </div>
          <div className="phase-card phase-3">
            <div className="phase-dot">3</div>
            <div className="phase-name" style={{ color: "#38bdf8" }}>
              Creative
            </div>
            <div className="phase-items">
              Media Studio
              <br />
              UI Builder
              <br />
              Design Tools
              <br />
              CRM Dashboard
            </div>
          </div>
          <div className="phase-card phase-4">
            <div className="phase-dot">4</div>
            <div className="phase-name" style={{ color: "#22d3a5" }}>
              Enterprise
            </div>
            <div className="phase-items">
              DevOps Center
              <br />
              Incident AI
              <br />
              Plugin Market
              <br />
              SSO + Audit
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
