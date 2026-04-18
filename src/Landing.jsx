import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useSelector } from "react-redux";
import "./styles/Landing.css";

/* ══════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════ */
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
    icon: "🤖",
    title: "Multi-AI Agents",
    desc: "Switch between Claude Sonnet, Haiku, Opus, GPT-4o, and Gemini with one click. Each agent has different strengths and credit costs.",
  },
  {
    icon: "🔁",
    title: "Cross-module AI",
    desc: "One chat prompt triggers actions across every module simultaneously — code, write, schedule, and automate at once.",
  },
  {
    icon: "💳",
    title: "Credit System",
    desc: "Transparent per-call credit pricing. Free plan includes 50 credits with a 5-hour cooldown. Pro and Enterprise have no limits.",
  },
  {
    icon: "🔐",
    title: "Role-Based Access",
    desc: "Viewer, Member, Admin, and Super Admin roles with granular permissions. Full team management built in.",
  },
  {
    icon: "🧠",
    title: "Persistent Memory",
    desc: "Context-aware suggestions based on your projects, past chats, and files across every session.",
  },
  {
    icon: "⚡",
    title: "Real-time Cooldown",
    desc: "Free credits? No problem. Watch a live countdown timer — credits auto-refill after 5 hours, or upgrade instantly.",
  },
];

const AGENTS = [
  {
    icon: "⚡",
    name: "Claude Haiku",
    color: "#22D4C8",
    cost: "1 cr",
    speed: "⚡⚡⚡",
    plan: "Free+",
    desc: "Fast & efficient. Great for quick tasks.",
  },
  {
    icon: "🎵",
    name: "Claude Sonnet",
    color: "#4F7FFA",
    cost: "3 cr",
    speed: "⚡⚡",
    plan: "Pro+",
    desc: "Balanced intelligence. Best for most work.",
  },
  {
    icon: "🎭",
    name: "Claude Opus",
    color: "#7C5CFC",
    cost: "8 cr",
    speed: "🔥",
    plan: "Enterprise",
    desc: "Most powerful. Complex reasoning & research.",
  },
  {
    icon: "🤖",
    name: "GPT-4o",
    color: "#10B981",
    cost: "5 cr",
    speed: "⚡⚡",
    plan: "Enterprise",
    desc: "OpenAI multimodal. Broad knowledge base.",
  },
  {
    icon: "💎",
    name: "Gemini 1.5 Pro",
    color: "#F59E0B",
    cost: "4 cr",
    speed: "⚡⚡",
    plan: "Enterprise",
    desc: "Google 1M context. Long-form analysis.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    color: "#8B92A8",
    credits: "50 credits",
    cooldown: "5h cooldown on depletion",
    badge: null,
    cta: "Start Free",
    features: [
      "50 AI credits per cycle",
      "5-hour auto-refill cooldown",
      "Access to all 6 live modules",
      "Claude Haiku model",
      "Community support",
      "1 team member",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    color: "#4F7FFA",
    credits: "500 credits",
    cooldown: "No cooldown",
    badge: "Most Popular",
    cta: "Start Pro Trial",
    features: [
      "500 AI credits per month",
      "No cooldown — always on",
      "All modules + priority features",
      "Claude Sonnet + Haiku models",
      "Email support",
      "Up to 5 team members",
    ],
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/mo",
    color: "#7C5CFC",
    credits: "Unlimited",
    cooldown: "No limits ever",
    badge: "Best Value",
    cta: "Contact Sales",
    features: [
      "Unlimited AI credits",
      "No cooldown, ever",
      "All current + future modules",
      "All 5 AI models (incl. GPT-4o & Gemini)",
      "Priority support + SLA",
      "Unlimited team members",
      "Role-Based Access Control",
      "Audit logs + SSO",
    ],
  },
];

const ROLES_DATA = [
  {
    icon: "👁️",
    name: "Viewer",
    color: "#8B92A8",
    desc: "Read-only access. Can see all modules but cannot run AI actions.",
  },
  {
    icon: "👤",
    name: "Member",
    color: "#10B981",
    desc: "Standard access. Uses AI features within plan credit limits.",
  },
  {
    icon: "🛡️",
    name: "Admin",
    color: "#4F7FFA",
    desc: "Full AI access + can manage team members and view billing.",
  },
  {
    icon: "👑",
    name: "Super Admin",
    color: "#7C5CFC",
    desc: "Complete control over billing, roles, integrations, and all settings.",
  },
];

const ARCH_LAYERS = [
  {
    label: "Frontend",
    color: "#4F7FFA",
    tags: [
      "React 19 + Vite",
      "Redux Toolkit",
      "React Router v7",
      "Tailwind-compatible",
      "Mobile-first",
    ],
  },
  {
    label: "Backend",
    color: "#7C5CFC",
    tags: [
      "Auth Service",
      "AI Orchestrator",
      "Billing Engine",
      "Workflow Engine",
      "Notification Svc",
    ],
  },
  {
    label: "AI Layer",
    color: "#22D4C8",
    tags: [
      "Anthropic Claude",
      "OpenAI GPT-4o",
      "Google Gemini",
      "Vector DB",
      "Prompt Engine",
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

/* ══════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════ */
function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
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
      { threshold: 0.1 },
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

/* ══════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════ */
function Navbar({ scrolled, onNav }) {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  return (
    <nav className={`lp-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="lp-nav-logo">AIPP</div>
      <div className="lp-nav-links">
        {["Features", "Agents", "Pricing", "Roadmap"].map((label) => (
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
          <button
            className="lp-btn-cta"
            onClick={() => navigate("/main/brain")}
          >
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
        Phase 1 &amp; 2 Live · 5 AI Models · Credit System · RBAC
      </div>
      <h1 className="lp-hero-h1">
        One app to run your
        <br />
        <span className="lp-grad">work, code, content,</span>
        <br />
        meetings &amp; automation.
      </h1>
      <p className="lp-hero-sub">
        Think ChatGPT + GitHub Copilot + Figma + Zapier + Notion — unified by a
        single AI brain. Switch between Claude, GPT-4o, and Gemini with one
        click.
      </p>
      <div className="lp-hero-actions">
        <button className="lp-hero-cta" onClick={onStart}>
          Start for free <span>→</span>
        </button>
        <a href="#pricing" className="lp-hero-secondary">
          View pricing
        </a>
      </div>
      <div className="lp-hero-stats">
        {[
          ["10", "Modules"],
          null,
          ["5", "AI Models"],
          null,
          ["4", "RBAC Roles"],
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
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            aipp.ai/brain
          </div>
          {/* Credit pill mock */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 10,
                padding: "2px 8px",
                background: "rgba(16,185,129,0.15)",
                color: "#10B981",
                borderRadius: 12,
                border: "1px solid rgba(16,185,129,0.2)",
                fontFamily: "'JetBrains Mono',monospace",
              }}
            >
              ● 487 cr
            </div>
            <div
              style={{
                fontSize: 10,
                padding: "2px 8px",
                background: "rgba(79,127,250,0.15)",
                color: "#7FA8FF",
                borderRadius: 12,
                border: "1px solid rgba(79,127,250,0.2)",
              }}
            >
              🎵 Sonnet
            </div>
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
                      fontFamily: "'JetBrains Mono',monospace",
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

function AgentsSection() {
  return (
    <div className="lp-section" id="agents">
      <div className="lp-eyebrow lp-reveal">Multi-Model AI</div>
      <h2 className="lp-section-title lp-reveal">
        Choose Your <span className="lp-grad">AI Agent</span>
      </h2>
      <p className="lp-section-sub lp-reveal">
        Switch between five AI models instantly. Each has different strengths,
        speeds, and credit costs. Enterprise unlocks them all.
      </p>
      <div className="lp-agents-grid lp-reveal">
        {AGENTS.map((a) => (
          <div key={a.name} className="lp-agent-card">
            <div className="lp-agent-top">
              <div
                className="lp-agent-icon"
                style={{
                  background: `${a.color}18`,
                  border: `1px solid ${a.color}30`,
                }}
              >
                {a.icon}
              </div>
              <div>
                <div className="lp-agent-name" style={{ color: a.color }}>
                  {a.name}
                </div>
                <div className="lp-agent-plan">{a.plan}</div>
              </div>
              <div className="lp-agent-speed">{a.speed}</div>
            </div>
            <div className="lp-agent-desc">{a.desc}</div>
            <div className="lp-agent-cost" style={{ color: a.color }}>
              <span className="lp-agent-cost-num">{a.cost}</span>
              <span className="lp-agent-cost-label">per call</span>
            </div>
          </div>
        ))}
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
            Most tools are isolated silos. AIPP modules talk to each other — one
            event flows through the entire platform automatically.
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

function RBACSection() {
  return (
    <div className="lp-section" id="roles">
      <div className="lp-eyebrow lp-reveal">Enterprise-Grade RBAC</div>
      <h2 className="lp-section-title lp-reveal">
        Four <span className="lp-grad">Permission Roles</span>
      </h2>
      <p className="lp-section-sub lp-reveal">
        Control exactly what each team member can do. From read-only viewers to
        full administrators.
      </p>
      <div className="lp-roles-grid lp-reveal">
        {ROLES_DATA.map((r) => (
          <div key={r.name} className="lp-role-card">
            <div className="lp-role-icon">{r.icon}</div>
            <div className="lp-role-name" style={{ color: r.color }}>
              {r.name}
            </div>
            <div className="lp-role-desc">{r.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingSection({ onStart }) {
  return (
    <div className="lp-section" id="pricing">
      <div className="lp-eyebrow lp-reveal">Transparent Pricing</div>
      <h2 className="lp-section-title lp-reveal">
        Start Free,
        <br />
        <span className="lp-grad">Scale Instantly</span>
      </h2>
      <p className="lp-section-sub lp-reveal">
        Pay only for what you use. Credits deducted per AI call based on model
        complexity. Free plan includes a 5-hour auto-refill cooldown — upgrade
        to remove it.
      </p>
      <div className="lp-pricing-grid lp-reveal">
        {PLANS.map((plan, i) => (
          <div
            key={plan.name}
            className={`lp-plan-card ${i === 1 ? "lp-plan-featured" : ""}`}
            style={{ "--plan-color": plan.color }}
          >
            {plan.badge && (
              <div
                className="lp-plan-badge"
                style={{ background: `${plan.color}22`, color: plan.color }}
              >
                {plan.badge}
              </div>
            )}
            <div className="lp-plan-name" style={{ color: plan.color }}>
              {plan.name}
            </div>
            <div className="lp-plan-price">
              <span className="lp-plan-amount">{plan.price}</span>
              <span className="lp-plan-period">{plan.period}</span>
            </div>
            <div className="lp-plan-credit-info">
              <span className="lp-plan-credits" style={{ color: plan.color }}>
                {plan.credits}
              </span>
              <span className="lp-plan-cooldown"> · {plan.cooldown}</span>
            </div>
            <ul className="lp-plan-features">
              {plan.features.map((f) => (
                <li key={f}>
                  <span className="lp-plan-check" style={{ color: plan.color }}>
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`lp-plan-cta ${i === 1 ? "lp-plan-cta-primary" : ""}`}
              style={
                i === 1
                  ? {
                      background: `linear-gradient(135deg,${plan.color},${plan.color}cc)`,
                    }
                  : { borderColor: `${plan.color}44`, color: plan.color }
              }
              onClick={onStart}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
      <div className="lp-pricing-note lp-reveal">
        All plans include access to all Phase 1 &amp; 2 modules. Credits reset
        monthly. Free plan resets every 5 hours when depleted.
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
        Four progressive phases from MVP to enterprise dominance.
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
        Start free — 50 credits, all modules, no credit card. Upgrade any time
        to unlock more AI models and remove cooldowns.
      </p>
      <div className="lp-cta-actions">
        <button className="lp-hero-cta" onClick={onStart}>
          Get started free →
        </button>
        <a href="#pricing" className="lp-hero-secondary">
          View pricing
        </a>
      </div>
    </div>
  );
}

function Footer({ onNav }) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-logo">AIPP</div>
        <div className="lp-footer-links">
          {[
            ["Features", "features"],
            ["Agents", "agents"],
            ["Pricing", "pricing"],
            ["Roadmap", "roadmap"],
          ].map(([label, id]) => (
            <button
              key={label}
              onClick={() => onNav(id)}
              className="lp-footer-link"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {label}
            </button>
          ))}
          <Link to="/login" className="lp-footer-link">
            Sign In
          </Link>
        </div>
        <div className="lp-footer-copy">
          © {currentYear} AIPP. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════ */

export default function Landing() {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const scrolled = useScrolled();
  const lit = useFlowAnimation();

  useEffect(() => {
    document.body.classList.add("landing");
    return () => document.body.classList.remove("landing");
  }, []);

  useReveal();

  const onStart = () => navigate(user ? "/main/brain" : "/auth");
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="landing-page-root">
        <Navbar scrolled={scrolled} onNav={scrollTo} />
        <HeroSection onStart={onStart} />
        <PreviewSection />
        <FlowSection lit={lit} />
        <FeaturesSection />
        <AgentsSection />
        <RBACSection />
        <PricingSection onStart={onStart} />
        <ModulesSection />
        <ArchSection />
        <RoadmapSection />
        <CTASection onStart={onStart} />
        <Footer onNav={scrollTo} />
      </div>
    </>
  );
}
