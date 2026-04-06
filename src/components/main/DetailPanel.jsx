import { useEffect, useRef } from "react";
import "../../styles/DetailPanel.css";
import "../../styles/Modules.css";

export default function DetailPanel({ module, onClose }) {
  const panelRef = useRef();

  useEffect(() => {
    panelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [module]);

  return (
    <div ref={panelRef} className="detail-panel open">
      <div className="detail-header">
        <div>
          <div className="detail-icon">{module.icon}</div>
          <div className="detail-title">{module.title}</div>
          <div className="detail-sub">{module.desc}</div>
        </div>

        <button className="detail-close" onClick={onClose}>
          ✕ Close
        </button>
      </div>

      <div className="features-grid">
        {module.features.map((f, i) => (
          <div key={i} className="feature-item">
            <div
              className="feature-dot"
              style={{ background: module.color }}
            ></div>
            <div className="feature-text">{f}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
