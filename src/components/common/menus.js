const modules = [
  {
    icon: "🧠",
    title: "AI Brain",
    color: "#5B6EF5",
    phase: "Phase 1",
    phaseColor: "rgba(91,110,245,0.15)",
    phaseText: "#5B6EF5",
    desc: "Central intelligence engine connecting every module with context-aware memory.",
    tags: ["Multi-model", "Voice", "Memory", "Plugins"],
    features: [
      "Multi-model AI chat interface",
      "Context-aware project memory",
      "Voice + text interaction",
      "Plugin system connecting all modules",
      "Real-time cross-module control",
      "Persistent user preferences",
    ],
  },
  {
    icon: "💻",
    title: "Developer Hub",
    color: "#22D3A5",
    phase: "Phase 1",
    phaseColor: "rgba(34,211,165,0.12)",
    phaseText: "#22D3A5",
    desc: "Code generation, debugging, repo integration, and auto documentation in one IDE-like environment.",
    tags: ["GitHub/GitLab", "API Testing", "Log Analysis", "Auto Docs"],
    features: [
      "AI code generation & debugging",
      "GitHub / GitLab integration",
      "Log monitoring + error analysis",
      "API testing with mock server",
      "Auto documentation generator",
      "CI/CD pipeline insights",
    ],
  },
  {
    icon: "📝",
    title: "Writing Studio",
    color: "#F59E0B",
    phase: "Phase 1",
    phaseColor: "rgba(245,158,11,0.1)",
    phaseText: "#F59E0B",
    desc: "Blog posts, emails, resumes, social content — all written and polished by AI.",
    tags: ["Blog", "Email", "Resume", "Social"],
    features: [
      "Long-form blog & article generation",
      "Smart email drafting & replies",
      "Resume + cover letter builder",
      "Social media content creation",
      "Grammar + tone correction",
      "Multi-language support",
    ],
  },
  {
    icon: "🎬",
    title: "Media Studio",
    color: "#EC4899",
    phase: "Phase 3",
    phaseColor: "rgba(236,72,153,0.1)",
    phaseText: "#EC4899",
    desc: "Image, video, voice generation plus subtitle syncing and thumbnail creation.",
    tags: ["Image Gen", "Video", "Voice", "Thumbnails"],
    features: [
      "AI image generation (Midjourney-style)",
      "Video creation from scripts",
      "Voice generation + dubbing",
      "Subtitle & script sync",
      "Thumbnail + banner generator",
      "Style transfer & editing",
    ],
  },
  {
    icon: "📊",
    title: "Smart Office",
    color: "#8B5CF6",
    phase: "Phase 1",
    phaseColor: "rgba(139,92,246,0.1)",
    phaseText: "#8B5CF6",
    desc: "AI-powered docs, sheets, presentations, and a knowledge base across all your files.",
    tags: ["Docs", "Sheets", "Slides", "Search"],
    features: [
      "AI Docs with auto-summarize & translate",
      "AI Sheets with formula generation",
      "Auto slide presentation builder",
      "Cross-file knowledge base search",
      "Real-time collaboration",
      "Template library",
    ],
  },
  {
    icon: "📅",
    title: "Meetings Hub",
    color: "#38BDF8",
    phase: "Phase 2",
    phaseColor: "rgba(56,189,248,0.1)",
    phaseText: "#38BDF8",
    desc: "Record, transcribe, summarize meetings and auto-schedule follow-ups with calendar sync.",
    tags: ["Transcription", "Summaries", "Calendar", "Follow-ups"],
    features: [
      "Meeting recording + transcription",
      "AI summaries with action items",
      "Calendar sync + smart scheduling",
      "Auto follow-up email generation",
      "Meeting analytics + trends",
      "Integration with Zoom / Meet / Teams",
    ],
  },
  {
    icon: "🔄",
    title: "Workflow Engine",
    color: "#22D3A5",
    phase: "Phase 2",
    phaseColor: "rgba(34,211,165,0.1)",
    phaseText: "#22D3A5",
    desc: "Drag-and-drop automation with AI decision nodes, triggers, and 100+ integrations.",
    tags: ["No-code", "Triggers", "Slack", "Gmail"],
    features: [
      "Visual drag-and-drop builder",
      "AI decision nodes in automations",
      "Slack, Gmail, API integrations",
      "Event-based triggers",
      "Conditional logic + branches",
      "Pre-built workflow templates",
    ],
  },
  {
    icon: "🎨",
    title: "Design Builder",
    color: "#F97316",
    phase: "Phase 3",
    phaseColor: "rgba(249,115,22,0.1)",
    phaseText: "#F97316",
    desc: "UI mockups, Figma-like tools, React/Tailwind code export, and landing page builder.",
    tags: ["Figma-like", "React Export", "Branding", "Landing Pages"],
    features: [
      "UI mockup canvas (Figma-style)",
      "Design → React/Tailwind code export",
      "Theme + branding generator",
      "Landing page builder",
      "Component library",
      "Responsive preview modes",
    ],
  },
  {
    icon: "🏢",
    title: "Business & CRM",
    color: "#A78BFA",
    phase: "Phase 3",
    phaseColor: "rgba(167,139,250,0.1)",
    phaseText: "#A78BFA",
    desc: "Customer AI chat, CRM dashboard, sales email automation, and analytics.",
    tags: ["CRM", "Sales AI", "Analytics", "Customer Chat"],
    features: [
      "AI customer chat widget",
      "Full CRM contact dashboard",
      "Sales email automation sequences",
      "Pipeline analytics + reports",
      "Deal probability scoring",
      "Integration with HubSpot / Salesforce",
    ],
  },
  {
    icon: "⚙️",
    title: "DevOps Center",
    color: "#EF4444",
    phase: "Phase 4",
    phaseColor: "rgba(239,68,68,0.1)",
    phaseText: "#EF4444",
    desc: "Incident monitoring, root cause analysis, alert routing, and auto ticket creation.",
    tags: ["Monitoring", "RCA", "Alerts", "Auto Tickets"],
    features: [
      "Log + metrics incident monitoring",
      "AI root cause analysis",
      "Alert routing (Slack/email/PagerDuty)",
      "Auto ticket creation in Jira",
      "Resolution knowledge base",
      "SLA tracking + escalation",
    ],
  },
];

let activeIdx = null;

function renderModules() {
  const grid = document.getElementById("module-grid");
  grid.innerHTML = modules
    .map(
      (m, i) => `
    <div class="module-card" id="mc-${i}"
      style="--card-accent:${m.color}; --card-glow:radial-gradient(ellipse at top left, ${m.color}10 0%, transparent 60%); --card-icon-bg:${m.color}18; --card-icon-border:${m.color}30"
      onclick="toggleDetail(${i})">
      <div class="card-phase" style="background:${m.phaseColor}; color:${m.phaseText}">${m.phase}</div>
      <div class="card-icon">${m.icon}</div>
      <div class="card-title">${m.title}</div>
      <div class="card-desc">${m.desc}</div>
      <div class="card-tags">${m.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
    </div>
  `,
    )
    .join("");
}

function toggleDetail(i) {
  const panel = document.getElementById("detail-panel");
  if (activeIdx === i && panel.classList.contains("open")) {
    closeDetail();
    return;
  }
  activeIdx = i;
  document
    .querySelectorAll(".module-card")
    .forEach((c) => c.classList.remove("active"));
  document.getElementById("mc-" + i).classList.add("active");
  const m = modules[i];
  document.getElementById("d-icon").textContent = m.icon;
  document.getElementById("d-title").textContent = m.title;
  document.getElementById("d-sub").textContent = m.desc;
  document.getElementById("d-features").innerHTML = m.features
    .map(
      (f) => `
    <div class="feature-item">
      <div class="feature-dot" style="background:${m.color}"></div>
      <div class="feature-text">${f}</div>
    </div>
  `,
    )
    .join("");
  panel.classList.add("open");
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closeDetail() {
  document.getElementById("detail-panel").classList.remove("open");
  document
    .querySelectorAll(".module-card")
    .forEach((c) => c.classList.remove("active"));
  activeIdx = null;
}

function showSection(sec) {
  document
    .querySelectorAll(".nav-links button")
    .forEach((b) => b.classList.remove("active"));
  event.target.classList.add("active");
  const targets = {
    overview: "sec-overview",
    modules: "sec-modules",
    arch: "sec-arch",
    roadmap: "sec-roadmap",
  };
  document
    .getElementById(targets[sec])
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Flow animation
let flowIdx = 0;
const flowColors = [
  "#5B6EF5",
  "#8B5CF6",
  "#22D3A5",
  "#F59E0B",
  "#38BDF8",
  "#A78BFA",
];
function animateFlow() {
  for (let i = 0; i < 6; i++) {
    const el = document.getElementById("fs" + i);
    if (el) {
      el.classList.remove("lit");
      el.style.background = "";
      el.style.color = "";
    }
  }
  const el = document.getElementById("fs" + flowIdx);
  if (el) {
    el.classList.add("lit");
    el.style.background = flowColors[flowIdx];
    el.style.boxShadow = `0 0 20px ${flowColors[flowIdx]}60`;
  }
  flowIdx = (flowIdx + 1) % 6;
}
setInterval(animateFlow, 900);
animateFlow();

renderModules();
export { showSection, toggleDetail, closeDetail };