import "../../styles/Stats.css";

export default function Stats() {
  return (
    <>
      {/* Stats Block */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-val">10</div>
          <div className="stat-lbl">Core Modules</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">50+</div>
          <div className="stat-lbl">Features</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">4</div>
          <div className="stat-lbl">MVP Phases</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">∞</div>
          <div className="stat-lbl">Integrations</div>
        </div>
      </div>
    </>
  );
}
