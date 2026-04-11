import "./Nav.css";
import { useNavigate } from "react-router"

export default function Nav({ setSection, activeSection }) {
  const navigate = useNavigate();

  const handleFeaturesUnlock = () => {
    navigate("/auth");
  }

  return (
    <>
      {/* NAV Block */}
      <nav className="nav">
        <div className="logo">AIPP</div>
        <div className="nav-links">
          {[
            { key: "overview", label: "Overview" },
            { key: "modules", label: "Modules" },
            { key: "arch", label: "Architecture" },
            { key: "roadmap", label: "Roadmap" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={activeSection === key ? "active" : ""}
              onClick={() => {
                setSection(key);
                document.getElementById(`sec-${key}`)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="nav-badge" onClick={handleFeaturesUnlock}>Unlock Features</div>
      </nav>
    </>
  );
}
