import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { loginThunk, registerThunk } from "../../store/slices/authSlice";
// import "../../styles/Auth.css";

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        dispatch(loginThunk({ email: form.email, password: form.password }));
      } else {
        dispatch(
          registerThunk({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        );
      }
      navigate("/main/brain");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-wrap">
        <div className="auth-bg" />
        <div className="auth-grid" />
        <div className="auth-card fade-in">
          <div className="auth-logo">AIPP</div>
          <div className="auth-tagline">AI Unified Productivity Platform</div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => {
                setTab("login");
                setError("");
              }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => {
                setTab("register");
                setError("");
              }}
            >
              Create Account
            </button>
          </div>

          {tab === "register" && (
            <div className="form-field">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="Alex Johnson"
                autoComplete="name"
                value={form.name}
                onChange={update("name")}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={form.email}
              onChange={update("email")}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder={tab === "login" ? "••••••••" : "min 6 characters"}
              autoComplete={
                tab === "login" ? "current-password" : "new-password"
              }
              value={form.password}
              onChange={update("password")}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="btn-auth"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : tab === "login"
                ? "Sign In"
                : "Create Account"}
          </button>

          {tab === "login" && (
            <div className="auth-demo">Demo: demo@aipp.ai / demo123</div>
          )}

          {error && <div className="auth-error">{error}</div>}
        </div>
      </div>
    </>
  );
}
