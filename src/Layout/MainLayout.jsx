import React from "react";
import "../styles/Auth.css";
import Sidebar from "../components/common/Sidebar";

export default function MainLayout() {
  return (
    <>
      <div className="app">
        <div className="topbar">
          <button className="hamburger">Menu</button>
          <div className="topbar-logo">AIPP</div>
          <div className="topbar-mod">🧠 AI Brain</div>
          <div className="topbar-spacer"></div>
          <div className="user-pill">
            <div className="user-avatar">DU</div>
            <span className="user-name">John Doe</span>
          </div>
          <button className="btn-logout">Logout</button>
        </div>
        <div className="main-layout">
          <Sidebar />
          <div className="content">
            <div className="module-header" style={{ paddingBottom: "6px" }}>
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
                  <div className="module-sub">Central Intelligence Engine</div>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm">Clear</button>
            </div>
            <div className="quick-row">
              <div className="qchip">✍️ Draft Proposal</div>
              <div className="qchip">🐛 Debug Code</div>
              <div className="qchip">📋 Summarize Doc</div>
              <div className="qchip">📧 Write Email</div>
              <div className="qchip">🎯 Plan Sprint</div>
              <div className="qchip">🔄 Create Workflow</div>
            </div>
            <div className="chat-msgs"></div>
            <div className="empty-state">
              <div className="empty-icon">🧠</div>
              <div className="empty-title">Welcome to AIPP Brain</div>
              <div className="empty-sub">Context-aware AI assistant. Ask anything or tap a quick prompt.</div>
            </div>
            <div className="chat-input-row">
              <input className="chat-input" id="cinput" placeholder="Ask AIPP Brain Anything....." autoComplete="off" />
              <button className="btn btn-primary" id="cbtn">Send</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
