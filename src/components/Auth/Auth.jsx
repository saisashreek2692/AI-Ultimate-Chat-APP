import { useState } from "react";
import "../../styles/Auth.css";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("signin");

  return (
    <>
      <div className="auth-wrap">
        <div className="auth-bg"></div>
        <div className="auth-grid"></div>
        <div className="auth-card fade-in">
          <div className="auth-logo">AIPP</div>
          <div className="auth-tagline">AI Unified Productivity Platform</div>
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === "signin" ? "active" : ""}`}
              onClick={() => setActiveTab("signin")}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${activeTab === "create" ? "active" : ""}`}
              onClick={() => setActiveTab("create")}
            >
              Create Account
            </button>
          </div>
          {activeTab === "signin" ? (
            <>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  id="ae"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  id="ap"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              <button className="btn-auth">Sign In</button>
              <div
                style={{
                  marginTop: "12px",
                  textAlign: "center",
                  fontSize: "12px",
                  color: "#545b72",
                }}
              >
                Demo: demo@aipp.ai / demo123
              </div>
            </>
          ) : (
            <>
              <div className="form-field">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  id="fn"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  id="ae"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>
              <div className="form-field">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  id="ap"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
              <button className="btn-auth">Create Account</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
