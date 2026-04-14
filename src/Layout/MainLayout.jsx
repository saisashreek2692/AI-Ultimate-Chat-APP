import React, { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar, closeSidebar } from "../store/slices/uiSlice";
import { logout } from "../store/slices/authSlice";
import { ToastContainer } from "../components/ui";

import "../index.css"
// import Sidebar from "../components/common/Sidebar";

const NAV = [
  { path: "/main/brain", icon: "🧠", label: "AI Brain", badge: "p1b", bt: "P1" },
  { path: "/main/dev", icon: "💻", label: "Dev Hub", badge: "p1b", bt: "P1" },
  { path: "/main/writing", icon: "📝", label: "Writing", badge: "p1b", bt: "P1" },
  {
    path: "/main/office",
    icon: "📊",
    label: "Smart Office",
    badge: "p1b",
    bt: "P1",
  },
  { path: "/main/meetings", icon: "📅", label: "Meetings", badge: "p2b", bt: "P2" },
  { path: "/main/workflow", icon: "🔄", label: "Workflows", badge: "p2b", bt: "P2" },
];

export default function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((s) => s.auth.user);
  const { sidebarOpen } = useSelector((s) => s.ui);

  const current = NAV.find((n) => location.pathname.startsWith(n.path));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") dispatch(closeSidebar());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <div className="app">
        {/* TOPBAR */}
        <header className="topbar">
          <button
            className="hamburger"
            onClick={() => dispatch(toggleSidebar())}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
          <div className="topbar-logo">AIPP</div>
          <div className="topbar-mod">
            {current?.icon} {current?.label}
          </div>
          <div className="topbar-spacer" />
          <div className="user-pill">
            <div className="user-avatar">{user?.initials}</div>
            <span className="user-name">{user?.name?.split(" ")[0]}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </header>

        <div className="main-layout">
          {/* OVERLAY */}
          <div
            className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
            onClick={() => dispatch(closeSidebar())}
          />

          {/* SIDEBAR */}
          <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
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
          </nav>

          {/* CONTENT */}
          <main className="content">
            <Outlet />
          </main>
        </div>

        {/* BOTTOM NAV */}
        <nav className="bottom-nav">
          <div className="bnav-inner">
            {NAV.map((n) => {
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
