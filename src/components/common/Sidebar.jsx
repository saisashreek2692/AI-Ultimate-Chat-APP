import React from "react";
import "../../styles/Auth.css"

export default function Sidebar() {
  return (
    <>
      <div className="sidebar-overlay"></div>
      <div className="sidebar sidebaropen">
        <div className="sidebar-section-label">Phase 1 - Foundation</div>
        <div className="nav-item active">
          <span className="nav-icon">🧠</span>{" "}
          <span className="nav-label">AI Brain</span>
          <span class="nav-badge p1b">P1</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">💻</span>{" "}
          <span className="nav-label">Dev Hub</span>
          <span class="nav-badge p1b">P1</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📝</span>{" "}
          <span className="nav-label">Writing</span>
          <span class="nav-badge p1b">P1</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">📊</span>{" "}
          <span className="nav-label">Smart Office</span>
          <span class="nav-badge p1b">P1</span>
        </div>
        <div className="sidebar-section-label">Phase 2 - Automation</div>
        <div className="nav-item">
          <span className="nav-icon">📅</span>{" "}
          <span className="nav-label">Meetings</span>
          <span class="nav-badge p2b">P2</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">🔄</span>{" "}
          <span className="nav-label">Workflows</span>
          <span class="nav-badge p2b">P2</span>
        </div>
      </div>
    </>
  );
}
