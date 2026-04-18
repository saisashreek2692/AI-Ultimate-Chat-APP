import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar, closeSidebar } from "../store/slices/uiSlice";
import { logout } from "../store/slices/authSlice";
import {
  refillCredits,
  hydrateBilling,
  selectPlan,
  selectCredits,
  selectMaxCredits,
  selectAgent,
  selectCooldownMs,
  ROLES,
} from "../store/slices/billingSlice";
import { ToastContainer } from "../components/ui";

import "../index.css";
// import Sidebar from "../components/common/Sidebar";

const NAV = [
  {
    path: "/main/brain",
    icon: "🧠",
    label: "AI Brain",
    badge: "p1b",
    bt: "P1",
  },
  { path: "/main/dev", icon: "💻", label: "Dev Hub", badge: "p1b", bt: "P1" },
  {
    path: "/main/writing",
    icon: "📝",
    label: "Writing",
    badge: "p1b",
    bt: "P1",
  },
  {
    path: "/main/office",
    icon: "📊",
    label: "Smart Office",
    badge: "p1b",
    bt: "P1",
  },
  {
    path: "/main/meetings",
    icon: "📅",
    label: "Meetings",
    badge: "p2b",
    bt: "P2",
  },
  {
    path: "/main/workflow",
    icon: "🔄",
    label: "Workflows",
    badge: "p2b",
    bt: "P2",
  },
];
const BNAV = [
  ...NAV,
  { path: "/main/agents", icon: "🤖", label: "Agents" },
  { path: "/main/profile", icon: "👤", label: "Profile" },
];
const ALL_NAV = [
  ...NAV,
  { path: "/main/agents", icon: "🤖", label: "Agents" },
  { path: "/main/billing", icon: "💳", label: "Billing" },
  { path: "/main/profile", label: "Profile", icon: "👤" },
];

function pad(n) {
  return String(n).padStart(2, "0");
}
function fmtCd(ms) {
  const s = Math.floor(ms / 1000);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

export default function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((s) => s.auth.user);
  const { sidebarOpen } = useSelector((s) => s.ui);
  const plan = useSelector(selectPlan);
  const credits = useSelector(selectCredits);
  const maxCr = useSelector(selectMaxCredits);
  const agent = useSelector(selectAgent);
  const role = useSelector((s) => s.billing.role);
  const cdMs0 = useSelector(selectCooldownMs);
  const [cdMs, setCdMs] = useState(cdMs0);

  const current = ALL_NAV.find((n) => location.pathname.startsWith(n.path));
  const creditPct = maxCr >= 999999 ? 100 : Math.round((credits / maxCr) * 100);
  const creditColor =
    creditPct < 20
      ? "var(--red)"
      : creditPct < 50
        ? "var(--amber)"
        : "var(--green)";

  // Live countdown
  useEffect(() => {
    if (cdMs <= 0) return;
    const id = setInterval(() => {
      setCdMs((prev) => {
        const next = Math.max(0, prev - 1000);
        if (next === 0 && user?.email) dispatch(refillCredits(user.email));
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [cdMs, user, dispatch]);
  useEffect(() => {
    setCdMs(cdMs0);
  }, [cdMs0]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") dispatch(closeSidebar());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  // Hydrate billing on session restore — only runs when email changes
  useEffect(() => {
    if (user?.email) dispatch(hydrateBilling(user.email));
  }, [user?.email, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  return (
    <>
      <div className="app">
        {/* ── TOPBAR ── */}
        <header className="topbar">
          <button
            className="hamburger"
            onClick={() => dispatch(toggleSidebar())}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
          <div
            className="topbar-logo"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/brain")}
          >
            AIPP
          </div>
          <div className="topbar-mod">
            {current?.icon} {current?.label}
          </div>
          <div className="topbar-spacer" />

          {/* Credit pill */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 8 }}
            className="topbar-credits"
          >
            {cdMs > 0 ? (
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono',monospace",
                  color: "#F59E0B",
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  borderRadius: 20,
                  padding: "4px 10px",
                }}
              >
                ⏳ {fmtCd(cdMs)}
              </div>
            ) : (
              <div
                onClick={() => navigate("/main/billing")}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  background: "var(--surface)",
                  border: "1px solid var(--border2)",
                  borderRadius: 20,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: creditColor,
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono',monospace",
                    color: "var(--text2)",
                  }}
                >
                  {maxCr >= 999999 ? "∞" : credits}
                </span>
                <span style={{ fontSize: 10, color: "var(--text3)" }}>cr</span>
              </div>
            )}
            {/* Agent pill */}
            <div
              onClick={() => navigate("/main/agents")}
              style={{
                cursor: "pointer",
                fontSize: 11,
                padding: "4px 10px",
                background: "var(--surface)",
                border: "1px solid var(--border2)",
                borderRadius: 20,
                color: "var(--text2)",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
              title={`Active agent: ${agent?.name}`}
            >
              <span>{agent?.icon}</span>
              <span style={{ color: agent?.color, fontWeight: 600 }}>
                {agent?.name?.split(" ").pop()}
              </span>
            </div>
          </div>

          <div
            className="user-pill"
            onClick={() => navigate("/main/profile")}
            title="Profile"
            style={{ cursor: "pointer" }}
          >
            <div className="user-avatar">{user?.initials}</div>
            <span className="user-name">{user?.name?.split(" ")[0]}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </header>

        <div className="main-layout">
          <div
            className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
            onClick={() => dispatch(closeSidebar())}
          />

          {/* ── SIDEBAR ── */}
          <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            {/* Credit bar in sidebar */}
            <div
              style={{
                padding: "8px 10px 14px",
                borderBottom: "1px solid var(--border)",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  marginBottom: 5,
                }}
              >
                <span
                  style={{
                    color: "var(--text3)",
                    fontWeight: 600,
                    letterSpacing: "0.3px",
                  }}
                >
                  {plan.name} Plan
                </span>
                <span style={{ color: creditColor, fontWeight: 600 }}>
                  {maxCr >= 999999 ? "∞ credits" : `${credits}/${maxCr}`}
                </span>
              </div>
              <div
                style={{
                  height: 5,
                  background: "var(--surface3)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${creditPct}%`,
                    background: creditColor,
                    borderRadius: 3,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              {cdMs > 0 && (
                <div
                  style={{
                    fontSize: 10,
                    color: "#F59E0B",
                    marginTop: 5,
                    textAlign: "center",
                  }}
                >
                  ⏳ Refill in {fmtCd(cdMs)}
                </div>
              )}
            </div>

            {/* Role badge */}
            <div style={{ padding: "0 10px 10px" }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  background: ROLES[role]?.bg || "var(--surface2)",
                  color: ROLES[role]?.color || "var(--text3)",
                  border: `1px solid ${ROLES[role]?.color || "var(--border)"}33`,
                  borderRadius: 6,
                  padding: "4px 10px",
                  display: "inline-block",
                }}
              >
                {ROLES[role]?.label || role}
              </div>
            </div>

            <div className="sidebar-section-label">Phase 1 — Foundation</div>
            {NAV.slice(0, 4).map((n) => (
              <NavLink
                key={n.path}
                to={n.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                onClick={() => dispatch(closeSidebar())}
              >
                <span className="nav-icon">{n.icon}</span>
                <span className="nav-label">{n.label}</span>
                <span className={`nav-badge ${n.badge}`}>{n.bt}</span>
              </NavLink>
            ))}

            <div className="sidebar-section-label">Phase 2 — Automation</div>
            {NAV.slice(4).map((n) => (
              <NavLink
                key={n.path}
                to={n.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                onClick={() => dispatch(closeSidebar())}
              >
                <span className="nav-icon">{n.icon}</span>
                <span className="nav-label">{n.label}</span>
                <span className={`nav-badge ${n.badge}`}>{n.bt}</span>
              </NavLink>
            ))}

            <div style={{ flex: 1 }} />
            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: 8,
                marginTop: 8,
              }}
            >
              <NavLink
                to="/main/agents"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                onClick={() => dispatch(closeSidebar())}
              >
                <span className="nav-icon">🤖</span>
                <span className="nav-label">AI Agents</span>
              </NavLink>
              <NavLink
                to="/main/billing"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                onClick={() => dispatch(closeSidebar())}
              >
                <span className="nav-icon">💳</span>
                <span className="nav-label">Billing</span>
              </NavLink>
              <NavLink
                to="/main/profile"
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                onClick={() => dispatch(closeSidebar())}
              >
                <span className="nav-icon">👤</span>
                <span className="nav-label">Profile</span>
              </NavLink>
              <div
                className="nav-item"
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              >
                <span className="nav-icon">🚪</span>
                <span className="nav-label" style={{ color: "var(--text3)" }}>
                  Sign Out
                </span>
              </div>
            </div>
          </nav>

          <main className="content">
            <Outlet />
          </main>
        </div>

        {/* ── BOTTOM NAV ── */}
        <nav className="bottom-nav">
          <div className="bnav-inner">
            {BNAV.map((n) => {
              const active = location.pathname.startsWith(n.path);
              return (
                <button
                  key={n.path}
                  className={`bnav-btn ${active ? "active" : ""}`}
                  onClick={() => navigate(n.path)}
                >
                  <span className="bnav-icon">{n.icon}</span>
                  <span className="bnav-label">{n.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <ToastContainer />
      </div>
    </>
  );
}
