import "../../styles/Features.css";

export default function Features() {
  return (
    <>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-eyebrow">Why AIPP Wins</div>
        <div className="section-title">Killer Features</div>
        <div className="features-strip">
          <div className="kf-card">
            <div className="kf-icon">🔁</div>
            <div className="kf-title">Cross-module AI</div>
            <div className="kf-desc">
              Chat controls every module. One prompt triggers actions across the
              entire platform.
            </div>
          </div>
          <div className="kf-card">
            <div className="kf-icon">🧠</div>
            <div className="kf-title">Persistent Memory</div>
            <div className="kf-desc">
              Context-aware suggestions based on your projects, past chats, and
              files.
            </div>
          </div>
          <div className="kf-card">
            <div className="kf-icon">⚡</div>
            <div className="kf-title">Real-time Collaboration</div>
            <div className="kf-desc">
              Multiple users. Live cursors. Shared AI context. Built for teams.
            </div>
          </div>
          <div className="kf-card">
            <div className="kf-icon">🧩</div>
            <div className="kf-title">Plugin Marketplace</div>
            <div className="kf-desc">
              Extend any module with community or enterprise plugins. Open API.
            </div>
          </div>
          <div className="kf-card">
            <div className="kf-icon">🔐</div>
            <div className="kf-title">Enterprise Security</div>
            <div className="kf-desc">
              SSO, audit logs, role-based access, data residency options.
            </div>
          </div>
          <div className="kf-card">
            <div className="kf-icon">🌐</div>
            <div className="kf-title">Multi-model Support</div>
            <div className="kf-desc">
              Plug in GPT-4, Claude, Gemini, or your own fine-tuned models.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
