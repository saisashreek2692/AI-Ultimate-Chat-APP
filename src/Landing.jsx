import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useSelector } from "react-redux";
import "./styles/Landing.css";

/* ── DATA ── */
const MODULES = [
  {
    icon: "🧠",
    name: "AI Brain",
    phase: "P1",
    phaseColor: "#7FA8FF",
    phaseGlow: "rgba(79,127,250,0.15)",
    accent: "#4F7FFA",
    desc: "Central intelligence engine connecting every module with context-aware memory.",
    tags: ["Multi-model", "Voice", "Memory", "Plugins"],
  },
  {
    icon: "💻",
    name: "Developer Hub",
    phase: "P1",
    phaseColor: "#5EEAD4",
    phaseGlow: "rgba(34,212,200,0.12)",
    accent: "#22D4C8",
    desc: "Code generation, debugging, repo integration, and auto documentation in one IDE-like workspace.",
    tags: ["GitHub", "API Testing", "Log Analysis", "Auto Docs"],
  },
  {
    icon: "📝",
    name: "Writing Studio",
    phase: "P1",
    phaseColor: "#FCD34D",
    phaseGlow: "rgba(245,158,11,0.12)",
    accent: "#F59E0B",
    desc: "Blog posts, emails, resumes, social content — all written and polished by AI.",
    tags: ["Blog", "Email", "Resume", "Social"],
  },
  {
    icon: "📊",
    name: "Smart Office",
    phase: "P1",
    phaseColor: "#C4B5FD",
    phaseGlow: "rgba(124,92,252,0.12)",
    accent: "#7C5CFC",
    desc: "AI-powered docs, sheets, presentations, and a knowledge base across all your files.",
    tags: ["Docs", "Sheets", "Slides", "Search"],
  },
  {
    icon: "📅",
    name: "Meetings Hub",
    phase: "P2",
    phaseColor: "#93C5FD",
    phaseGlow: "rgba(56,189,248,0.12)",
    accent: "#38BDF8",
    desc: "Record, transcribe, and summarize meetings — auto-scheduled follow-ups included.",
    tags: ["Transcription", "Summaries", "Calendar", "Follow-ups"],
  },
  {
    icon: "🔄",
    name: "Workflow Engine",
    phase: "P2",
    phaseColor: "#6EE7B7",
    phaseGlow: "rgba(16,185,129,0.12)",
    accent: "#10B981",
    desc: "Drag-and-drop automation with AI decision nodes, triggers, and 100+ integrations.",
    tags: ["No-code", "Triggers", "Slack", "Gmail"],
  },
  {
    icon: "🎬",
    name: "Media Studio",
    phase: "P3",
    phaseColor: "#F9A8D4",
    phaseGlow: "rgba(236,72,153,0.10)",
    accent: "#EC4899",
    desc: "Image, video, voice generation plus subtitle syncing and thumbnail creation.",
    tags: ["Image Gen", "Video", "Voice", "Thumbnails"],
  },
  {
    icon: "🎨",
    name: "Design Builder",
    phase: "P3",
    phaseColor: "#FDba74",
    phaseGlow: "rgba(249,115,22,0.10)",
    accent: "#F97316",
    desc: "UI mockups, Figma-like canvas, React/Tailwind export, and landing page builder.",
    tags: ["Figma-like", "React Export", "Branding", "Pages"],
  },
  {
    icon: "🏢",
    name: "Business & CRM",
    phase: "P3",
    phaseColor: "#A5B4FC",
    phaseGlow: "rgba(99,102,241,0.10)",
    accent: "#6366F1",
    desc: "Customer AI chat, CRM dashboard, sales email automation, and analytics reports.",
    tags: ["CRM", "Sales AI", "Analytics", "Customer Chat"],
  },
  {
    icon: "⚙️",
    name: "DevOps Center",
    phase: "P4",
    phaseColor: "#FCA5A5",
    phaseGlow: "rgba(239,68,68,0.10)",
    accent: "#EF4444",
    desc: "Incident monitoring, root cause analysis, alert routing, and auto ticket creation.",
    tags: ["Monitoring", "RCA", "Alerts", "Auto Tickets"],
  },
];

const FEATURES = [
  {
    icon: "🔁",
    title: "Cross-module AI",
    desc: "One chat prompt triggers actions across every module simultaneously.",
  },
  {
    icon: "🧠",
    title: "Persistent Memory",
    desc: "Context-aware suggestions based on your projects, past chats, and files.",
  },
  {
    icon: "⚡",
    title: "Real-time Collaboration",
    desc: "Multiple users. Live cursors. Shared AI context. Built for teams.",
  },
  {
    icon: "🧩",
    title: "Plugin Marketplace",
    desc: "Extend any module with community or enterprise plugins. Open API.",
  },
  {
    icon: "🔐",
    title: "Enterprise Security",
    desc: "SSO, audit logs, role-based access, data residency options.",
  },
  {
    icon: "🌐",
    title: "Multi-model Support",
    desc: "Plug in GPT-4, Claude, Gemini, or your own fine-tuned models.",
  },
];

const ARCH_LAYERS = [
  {
    label: "Frontend",
    color: "#4F7FFA",
    tags: [
      "Next.js + React",
      "Tailwind CSS",
      "Micro-frontends",
      "Docker",
      "Kubernetes",
    ],
  },
  {
    label: "Backend",
    color: "#7C5CFC",
    tags: [
      "Spring Boot",
      "Auth Service",
      "AI Orchestrator",
      "Workflow Engine",
      "Notification Svc",
    ],
  },
  {
    label: "AI Layer",
    color: "#22D4C8",
    tags: [
      "LLM APIs",
      "Vector DB",
      "Prompt Engine",
      "OpenAI / Claude",
      "Embeddings",
    ],
  },
  {
    label: "Infra",
    color: "#10B981",
    tags: [
      "GKE / EKS",
      "AWS S3 + RDS",
      "Kafka Streaming",
      "Redis Cache",
      "Lambda",
    ],
  },
];

const FLOW_NODES = [
  { icon: "📅", label: "Meeting happens", color: "#4F7FFA" },
  { icon: "📝", label: "Notes generated", color: "#7C5CFC" },
  { icon: "✅", label: "Tasks created", color: "#22D4C8" },
  { icon: "⚡", label: "Workflow triggered", color: "#F59E0B" },
  { icon: "📧", label: "Email sent", color: "#10B981" },
  { icon: "📊", label: "Dashboard updated", color: "#A78BFA" },
];

const PHASES = [
  {
    num: "1",
    color: "#4F7FFA",
    name: "Foundation",
    items: [
      "AI Chat Brain",
      "Docs + Writing",
      "Code Assistant",
      "Memory System",
    ],
  },
  {
    num: "2",
    color: "#7C5CFC",
    name: "Automation",
    items: [
      "Workflow Engine",
      "Meetings Hub",
      "Calendar Sync",
      "Email Follow-ups",
    ],
  },
  {
    num: "3",
    color: "#38BDF8",
    name: "Creative",
    items: ["Media Studio", "UI Builder", "Design Tools", "CRM Dashboard"],
  },
  {
    num: "4",
    color: "#22D4C8",
    name: "Enterprise",
    items: ["DevOps Center", "Incident AI", "Plugin Market", "SSO + Audit"],
  },
];

const PREVIEW_NAVS = [
  { icon: "🧠", label: "AI Brain", active: true },
  { icon: "💻", label: "Dev Hub", active: false },
  { icon: "📝", label: "Writing", active: false },
  { icon: "📊", label: "Office", active: false },
  { icon: "📅", label: "Meetings", active: false },
];

/* ── HOOKS ── */
function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".lp-reveal");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("visible"),
        ),
      { threshold: 0.12 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useFlowAnimation() {
  const [lit, setLit] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setLit((p) => (p + 1) % FLOW_NODES.length),
      900,
    );
    return () => clearInterval(id);
  }, []);
  return lit;
}

/* ── SUB-COMPONENTS ── */
function Navbar({ scrolled, onNav }) {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  return (
    <nav className={`lp-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="lp-nav-logo">AIPP</div>
      <div className="lp-nav-links">
        {["Features", "Modules", "Architecture", "Roadmap"].map((label) => (
          <button
            key={label}
            className="lp-nav-link"
            onClick={() => onNav(label.toLowerCase())}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="lp-nav-spacer" />
      <div className="lp-nav-actions">
        {user ? (
          <button className="lp-btn-cta" onClick={() => navigate("/main/brain")}>
            Open App →
          </button>
        ) : (
          <>
            <Link to="/auth" className="lp-btn-ghost">
              Sign In
            </Link>
            <Link to="/auth" className="lp-btn-cta">
              Get Started →
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function HeroSection({ onStart }) {
  return (
    <section className="lp-hero">
      <div className="lp-hero-glow" />
      <div className="lp-hero-grid" />
      <div className="lp-hero-badge">
        <span className="lp-hero-badge-dot" />
        AI Unified Productivity Platform — Phase 1 &amp; 2 Live
      </div>
      <h1 className="lp-hero-h1">
        One app to run your
        <br />
        <span className="lp-grad">work, code, content,</span>
        <br />
        meetings &amp; automation.
      </h1>
      <p className="lp-hero-sub">
        Think ChatGPT + GitHub Copilot + Figma + Zapier + Notion — wired
        together by a single AI brain that connects everything.
      </p>
      <div className="lp-hero-actions">
        <button className="lp-hero-cta" onClick={onStart}>
          Start for free <span>→</span>
        </button>
        <a href="#features" className="lp-hero-secondary">
          See all features
        </a>
      </div>
      <div className="lp-hero-stats">
        {[
          ["10", "Core Modules"],
          null,
          ["50+", "Features"],
          null,
          ["4", "MVP Phases"],
          null,
          ["∞", "Integrations"],
        ].map((item, i) =>
          item ? (
            <div key={i} className="lp-stat">
              <div className="lp-stat-val">{item[0]}</div>
              <div className="lp-stat-lbl">{item[1]}</div>
            </div>
          ) : (
            <div key={i} className="lp-stat-divider" />
          ),
        )}
      </div>
    </section>
  );
}

function PreviewSection() {
  return (
    <div className="lp-preview lp-reveal">
      <div className="lp-preview-frame">
        <div className="lp-preview-bar">
          <div className="lp-preview-dot" style={{ background: "#FF5F57" }} />
          <div className="lp-preview-dot" style={{ background: "#FEBC2E" }} />
          <div className="lp-preview-dot" style={{ background: "#28C840" }} />
          <div
            style={{
              marginLeft: 12,
              fontSize: 11,
              color: "var(--text3)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            aipp.ai/brain
          </div>
        </div>
        <div className="lp-preview-inner">
          <div className="lp-preview-sidebar">
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: "var(--text3)",
                padding: "8px 10px 6px",
              }}
            >
              Phase 1
            </div>
            {PREVIEW_NAVS.map((n) => (
              <div
                key={n.label}
                className={`lp-preview-nav-item ${n.active ? "active" : ""}`}
              >
                {n.icon} {n.label}
              </div>
            ))}
          </div>
          <div className="lp-preview-content">
            <div className="lp-preview-chat">
              <div className="lp-preview-msg">
                <div
                  className="lp-preview-avatar"
                  style={{
                    background: "linear-gradient(135deg,#4F7FFA,#7C5CFC)",
                    color: "#fff",
                  }}
                >
                  DU
                </div>
                <div className="lp-preview-bubble user">
                  Generate a Python function that analyzes sales data and
                  returns the top 5 products by revenue.
                </div>
              </div>
              <div className="lp-preview-msg">
                <div
                  className="lp-preview-avatar"
                  style={{
                    background: "linear-gradient(135deg,#22D4C8,#10B981)",
                    color: "#000",
                    fontSize: 9,
                  }}
                >
                  AI
                </div>
                <div className="lp-preview-bubble">
                  Here's a clean Python function for sales analysis:
                  <div
                    style={{
                      marginTop: 8,
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "8px 10px",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: "#C9D1D9",
                      lineHeight: 1.7,
                    }}
                  >
                    <span style={{ color: "#7C5CFC" }}>def</span>{" "}
                    <span style={{ color: "#22D4C8" }}>top_products</span>(data,
                    n=5):
                    <br />
                    &nbsp;&nbsp;<span style={{ color: "#7C5CFC" }}>
                      return
                    </span>{" "}
                    sorted(data,
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;key=
                    <span style={{ color: "#F59E0B" }}>lambda</span> x: x[
                    <span style={{ color: "#10B981" }}>'revenue'</span>],
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;reverse=
                    <span style={{ color: "#4F7FFA" }}>True</span>)[:n]
                  </div>
                </div>
              </div>
              <div className="lp-preview-msg">
                <div
                  className="lp-preview-avatar"
                  style={{
                    background: "linear-gradient(135deg,#4F7FFA,#7C5CFC)",
                    color: "#fff",
                  }}
                >
                  DU
                </div>
                <div className="lp-preview-bubble user">
                  Now create a workflow that auto-sends a report every Monday
                  morning.
                </div>
              </div>
            </div>
            <div className="lp-preview-input">
              <span>Ask anything — I control all modules…</span>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "linear-gradient(135deg,#4F7FFA,#7C5CFC)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 14,
                }}
              >
                ➤
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowSection({ lit }) {
  return (
    <div className="lp-flow-section">
      <div className="lp-flow-inner">
        <div>
          <div className="lp-eyebrow">Key Differentiator</div>
          <h2 className="lp-section-title">
            Connected
            <br />
            <span className="lp-grad">Intelligence</span>
          </h2>
          <p className="lp-section-sub" style={{ marginBottom: 40 }}>
            Most tools are isolated silos. AIPP modules talk to each other
            intelligently — one event flows through the entire platform
            automatically.
          </p>
          <div className="lp-flow-steps">
            {[
              {
                icon: "📅",
                title: "Meeting happens",
                desc: "Join any meeting on Zoom, Google Meet, or Teams.",
              },
              {
                icon: "🤖",
                title: "AI takes over",
                desc: "Transcribes, summarizes, and extracts action items in real time.",
              },
              {
                icon: "⚡",
                title: "Automations fire",
                desc: "Tasks created, emails drafted, dashboard updated — all instantly.",
              },
            ].map((step) => (
              <div key={step.title} className="lp-flow-step">
                <div className="lp-flow-step-icon">{step.icon}</div>
                <div>
                  <div className="lp-flow-step-title">{step.title}</div>
                  <div className="lp-flow-step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-flow-visual lp-reveal">
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "var(--text3)",
              marginBottom: 4,
            }}
          >
            Live Automation Chain
          </div>
          {FLOW_NODES.map((node, i) => (
            <div key={node.label}>
              <div
                className={`lp-flow-node ${lit === i ? "lit" : ""}`}
                style={
                  lit === i
                    ? {
                        background: node.color,
                        boxShadow: `0 0 24px ${node.color}50`,
                      }
                    : {}
                }
              >
                <span className="lp-flow-node-icon">{node.icon}</span>
                <span className="lp-flow-node-text">{node.label}</span>
              </div>
              {i < FLOW_NODES.length - 1 && (
                <div className="lp-flow-connector">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModulesSection() {
  return (
    <div className="lp-section" id="modules">
      <div className="lp-eyebrow lp-reveal">Platform Modules</div>
      <h2 className="lp-section-title lp-reveal">
        Everything in
        <br />
        <span className="lp-grad">One Place</span>
      </h2>
      <p className="lp-section-sub lp-reveal">
        10 production-grade modules, all controlled by your AI brain. Launching
        in 4 progressive phases.
      </p>
      <div className="lp-modules-grid">
        {MODULES.map((m, i) => (
          <div
            key={m.name}
            className="lp-module-card lp-reveal"
            style={{
              "--card-accent": m.accent,
              "--card-glow": `radial-gradient(ellipse at top left, ${m.phaseGlow} 0%, transparent 60%)`,
              "--card-icon-bg": `${m.accent}18`,
              "--card-icon-border": `${m.accent}30`,
              transitionDelay: `${(i % 5) * 60}ms`,
            }}
          >
            <div
              className="lp-module-phase"
              style={{ background: `${m.accent}22`, color: m.phaseColor }}
            >
              Phase {m.phase.slice(1)}
            </div>
            <div className="lp-module-icon-wrap">{m.icon}</div>
            <div className="lp-module-name">{m.name}</div>
            <div className="lp-module-desc">{m.desc}</div>
            <div className="lp-module-tags">
              {m.tags.map((tag) => (
                <span key={tag} className="lp-module-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <div className="lp-section" id="features">
      <div className="lp-eyebrow lp-reveal">Why AIPP Wins</div>
      <h2 className="lp-section-title lp-reveal">
        Killer <span className="lp-grad">Features</span>
      </h2>
      <p className="lp-section-sub lp-reveal">
        Not just features — connected capabilities that compound across every
        module you use.
      </p>
      <div className="lp-features-grid">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="lp-feature-card lp-reveal"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="lp-feature-icon">{f.icon}</div>
            <div className="lp-feature-title">{f.title}</div>
            <div className="lp-feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchSection() {
  return (
    <div className="lp-arch-section lp-section-full" id="architecture">
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="lp-eyebrow lp-reveal">System Architecture</div>
        <h2 className="lp-section-title lp-reveal">
          Built to <span className="lp-grad">Scale</span>
        </h2>
        <p className="lp-section-sub lp-reveal">
          Microservices on Kubernetes, event-driven with Kafka, vector memory
          for AI context, edge-ready CDN.
        </p>
        <div className="lp-arch-grid">
          {ARCH_LAYERS.map((layer, i) => (
            <div
              key={layer.label}
              className="lp-arch-card lp-reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="lp-arch-label" style={{ color: layer.color }}>
                {layer.label}
              </div>
              <div className="lp-arch-tags">
                {layer.tags.map((tag) => (
                  <div key={tag} className="lp-arch-tag">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoadmapSection() {
  return (
    <div className="lp-section" id="roadmap">
      <div className="lp-eyebrow lp-reveal">MVP Strategy</div>
      <h2 className="lp-section-title lp-reveal">
        Ship Smart,
        <br />
        <span className="lp-grad">Scale Fast</span>
      </h2>
      <p className="lp-section-sub lp-reveal">
        Four progressive phases from MVP to enterprise dominance. Don't build
        everything at once.
      </p>
      <div className="lp-roadmap lp-reveal">
        <div className="lp-roadmap-line" />
        {PHASES.map((p) => (
          <div key={p.num} className="lp-phase">
            <div
              className="lp-phase-dot"
              style={{
                background: `${p.color}22`,
                borderColor: p.color,
                color: p.color,
              }}
            >
              {p.num}
            </div>
            <div className="lp-phase-name" style={{ color: p.color }}>
              {p.name}
            </div>
            <div className="lp-phase-items">
              {p.items.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CTASection({ onStart }) {
  return (
    <div className="lp-cta-section lp-reveal">
      <div className="lp-cta-glow" />
      <h2 className="lp-cta-title">
        Ready to unify
        <br />
        <span className="lp-grad">your entire workflow?</span>
      </h2>
      <p className="lp-cta-sub">
        Join the waitlist or sign up now. Phase 1 &amp; 2 are live — AI Brain,
        Dev Hub, Writing Studio, Smart Office, Meetings Hub, and Workflow
        Engine.
      </p>
      <div className="lp-cta-actions">
        <button className="lp-hero-cta" onClick={onStart}>
          Get started free →
        </button>
        <a href="#modules" className="lp-hero-secondary">
          Explore modules
        </a>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-logo">AIPP</div>
        <div className="lp-footer-links">
          {["Features", "Modules", "Architecture", "Roadmap", "Sign In"].map(
            (link) => (
              <a key={link} href="#" className="lp-footer-link">
                {link}
              </a>
            ),
          )}
        </div>
        <div className="lp-footer-copy">© 2026 AIPP. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const scrolled = useScrolled();
  const lit = useFlowAnimation();
  const rootRef = useRef(null);

  // Enable body scroll for landing (app pages need overflow:hidden)
  useEffect(() => {
    document.body.classList.add("landing");
    return () => document.body.classList.remove("landing");
  }, []);

  // Activate scroll-reveal
  useReveal();

  const onStart = () => navigate(user ? "/brain" : "/auth");

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div ref={rootRef} className="landing-page-root">
        <Navbar scrolled={scrolled} onNav={scrollTo} />
        <HeroSection onStart={onStart} />
        <PreviewSection />
        <FlowSection lit={lit} />
        <FeaturesSection />
        <ModulesSection />
        <ArchSection />
        <RoadmapSection />
        <CTASection onStart={onStart} />
        <Footer />
      </div>
    </>
  );
}
