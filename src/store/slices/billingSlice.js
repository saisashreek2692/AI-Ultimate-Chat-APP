import { createSlice } from "@reduxjs/toolkit";

/* ══════════════════════════════════════════════════════════
   SUBSCRIPTION PLANS
══════════════════════════════════════════════════════════ */
export const PLANS = {
  free: {
    id: "free",
    name: "Free",
    price: "$0",
    priceMonthly: 0,
    credits: 50,
    cooldownHours: 5,
    color: "#8B92A8",
    features: [
      "50 AI credits per cycle",
      "5-hour cooldown when depleted",
      "Access to all 6 modules",
      "Claude Haiku model only",
      "Community support",
    ],
    limits: { model: ["claude-haiku"], maxTokens: 500, teamSize: 1 },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: "$19",
    priceMonthly: 19,
    credits: 500,
    cooldownHours: 0,
    color: "#4F7FFA",
    features: [
      "500 AI credits per month",
      "No cooldown — instant refill option",
      "All modules + priority features",
      "Claude Sonnet + Haiku models",
      "Email support",
      "Up to 5 team members",
    ],
    limits: {
      model: ["claude-sonnet", "claude-haiku"],
      maxTokens: 1500,
      teamSize: 5,
    },
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    priceMonthly: 99,
    credits: Infinity,
    cooldownHours: 0,
    color: "#7C5CFC",
    features: [
      "Unlimited AI credits",
      "No cooldown ever",
      "All current + future modules",
      "All models: Sonnet, Haiku, Opus + GPT-4o",
      "Priority support + SLA",
      "Unlimited team members",
      "Role-Based Access Control",
      "Custom integrations",
      "Audit logs",
    ],
    limits: {
      model: [
        "claude-sonnet",
        "claude-haiku",
        "claude-opus",
        "gpt-4o",
        "gemini-pro",
      ],
      maxTokens: 4000,
      teamSize: Infinity,
    },
  },
};

/* ══════════════════════════════════════════════════════════
   ROLES
══════════════════════════════════════════════════════════ */
export const ROLES = {
  viewer: {
    id: "viewer",
    label: "Viewer",
    color: "#8B92A8",
    bg: "rgba(139,146,168,0.12)",
    description:
      "Read-only access. Can view all modules but cannot run AI actions.",
    permissions: {
      canUseAI: false,
      canManageTeam: false,
      canManageBilling: false,
      canViewAll: true,
    },
  },
  member: {
    id: "member",
    label: "Member",
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
    description: "Standard access. Can use all AI features within plan limits.",
    permissions: {
      canUseAI: true,
      canManageTeam: false,
      canManageBilling: false,
      canViewAll: true,
    },
  },
  admin: {
    id: "admin",
    label: "Admin",
    color: "#4F7FFA",
    bg: "rgba(79,127,250,0.12)",
    description: "Full access. Can manage team members and view billing.",
    permissions: {
      canUseAI: true,
      canManageTeam: true,
      canManageBilling: false,
      canViewAll: true,
    },
  },
  superadmin: {
    id: "superadmin",
    label: "Super Admin",
    color: "#7C5CFC",
    bg: "rgba(124,92,252,0.12)",
    description:
      "Complete control. Manages billing, roles, integrations, and all settings.",
    permissions: {
      canUseAI: true,
      canManageTeam: true,
      canManageBilling: true,
      canViewAll: true,
    },
  },
};

/* ══════════════════════════════════════════════════════════
   AI AGENTS / MODELS
══════════════════════════════════════════════════════════ */
export const AGENTS = {
  "claude-haiku": {
    id: "claude-haiku",
    name: "Claude Haiku",
    provider: "Anthropic",
    icon: "⚡",
    color: "#22D4C8",
    creditCost: 1,
    apiModel: "claude-haiku-4-5-20251001",
    description:
      "Fast and efficient. Best for quick tasks, summaries, and simple queries.",
    strengths: ["Speed", "Cost-efficient", "Simple tasks"],
    plans: ["free", "pro", "enterprise"],
    badge: "Fast",
  },
  "claude-sonnet": {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    provider: "Anthropic",
    icon: "🎵",
    color: "#4F7FFA",
    creditCost: 3,
    apiModel: "claude-sonnet-4-20250514",
    description:
      "Balanced intelligence and speed. Ideal for most professional tasks.",
    strengths: ["Reasoning", "Writing", "Code", "Analysis"],
    plans: ["pro", "enterprise"],
    badge: "Recommended",
  },
  "claude-opus": {
    id: "claude-opus",
    name: "Claude Opus",
    provider: "Anthropic",
    icon: "🎭",
    color: "#7C5CFC",
    creditCost: 8,
    apiModel: "claude-opus-4-5",
    description:
      "Most powerful. For complex reasoning, research, and advanced code.",
    strengths: [
      "Complex reasoning",
      "Research",
      "Advanced code",
      "Long context",
    ],
    plans: ["enterprise"],
    badge: "Most Powerful",
  },
  "gpt-4o": {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    icon: "🤖",
    color: "#10B981",
    creditCost: 5,
    apiModel: "gpt-4o", // routed to OpenAI endpoint in production
    description:
      "OpenAI's multimodal flagship model. Excellent for diverse reasoning tasks.",
    strengths: ["Multimodal", "Broad knowledge", "Diverse tasks"],
    plans: ["enterprise"],
    badge: "OpenAI",
    simulated: true, // uses Claude under the hood in this demo
  },
  "gemini-pro": {
    id: "gemini-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    icon: "💎",
    color: "#F59E0B",
    creditCost: 4,
    apiModel: "gemini-1.5-pro",
    description: "Google's leading model with 1M token context window.",
    strengths: ["Long context", "Multimodal", "Code generation"],
    plans: ["enterprise"],
    badge: "Google",
    simulated: true,
  },
};

/* ══════════════════════════════════════════════════════════
   STORAGE HELPERS
══════════════════════════════════════════════════════════ */
const BILLING_KEY = "aipp_billing";

function loadBilling(email) {
  try {
    const all = JSON.parse(localStorage.getItem(BILLING_KEY) || "{}");
    return all[email] || null;
  } catch {
    return null;
  }
}

function saveBilling(email, data) {
  try {
    const all = JSON.parse(localStorage.getItem(BILLING_KEY) || "{}");
    all[email] = data;
    localStorage.setItem(BILLING_KEY, JSON.stringify(all));
  } catch {
    /* empty */
  }
}

/* Default billing state for a new user */
function defaultBilling(email) {
  return {
    email,
    planId: "free",
    role: "member",
    credits: PLANS.free.credits,
    maxCredits: PLANS.free.credits,
    cooldownUntil: null, // ISO timestamp or null
    selectedAgent: "claude-haiku",
    usageHistory: [], // [{ date, agent, credits, module }]
    teamMembers: [],
    billingCycle: new Date().toISOString(),
  };
}

/* ══════════════════════════════════════════════════════════
   INITIAL STATE
══════════════════════════════════════════════════════════ */
function buildInitialState() {
  // We don't know the email yet (loaded from auth session separately)
  return {
    planId: "free",
    role: "member",
    credits: PLANS.free.credits,
    maxCredits: PLANS.free.credits,
    cooldownUntil: null,
    selectedAgent: "claude-haiku",
    usageHistory: [],
    teamMembers: [],
    loaded: false,
  };
}

/* ══════════════════════════════════════════════════════════
   SLICE
══════════════════════════════════════════════════════════ */
const billingSlice = createSlice({
  name: "billing",
  initialState: buildInitialState(),

  reducers: {
    /* Called after login to hydrate billing state from localStorage */
    hydrateBilling(state, { payload: email }) {
      const stored = loadBilling(email);
      const data = stored || defaultBilling(email);
      if (!stored) saveBilling(email, data);

      // Sync plan limits in case PLANS changed
      const plan = PLANS[data.planId] || PLANS.free;
      state.planId = data.planId;
      state.role = data.role;
      state.credits = data.credits;
      state.maxCredits = plan.credits === Infinity ? 999999 : plan.credits;
      state.cooldownUntil = data.cooldownUntil;
      state.selectedAgent = data.selectedAgent || "claude-haiku";
      state.usageHistory = data.usageHistory || [];
      state.teamMembers = data.teamMembers || [];
      state.loaded = true;
    },

    /* Deduct credits after an AI call */
    deductCredits(state, { payload: { email, amount, agent, module: mod } }) {
      const plan = PLANS[state.planId];
      if (plan.credits === Infinity) return; // enterprise — no deduction

      state.credits = Math.max(0, state.credits - amount);

      // Record usage
      state.usageHistory = [
        { date: new Date().toISOString(), agent, credits: amount, module: mod },
        ...state.usageHistory.slice(0, 99), // keep last 100
      ];

      // Start cooldown if depleted and on free plan
      if (state.credits === 0 && plan.cooldownHours > 0) {
        const until = new Date(
          Date.now() + plan.cooldownHours * 60 * 60 * 1000,
        ).toISOString();
        state.cooldownUntil = until;
      }

      // Persist
      saveBilling(email, {
        email,
        planId: state.planId,
        role: state.role,
        credits: state.credits,
        maxCredits: state.maxCredits,
        cooldownUntil: state.cooldownUntil,
        selectedAgent: state.selectedAgent,
        usageHistory: state.usageHistory,
        teamMembers: state.teamMembers,
        billingCycle: new Date().toISOString(),
      });
    },

    /* Refill credits after cooldown expired */
    refillCredits(state, { payload: email }) {
      const plan = PLANS[state.planId];
      state.credits = plan.credits === Infinity ? 999999 : plan.credits;
      state.cooldownUntil = null;
      saveBilling(email, {
        email,
        planId: state.planId,
        role: state.role,
        credits: state.credits,
        maxCredits: state.maxCredits,
        cooldownUntil: null,
        selectedAgent: state.selectedAgent,
        usageHistory: state.usageHistory,
        teamMembers: state.teamMembers,
        billingCycle: new Date().toISOString(),
      });
    },

    /* Upgrade / downgrade plan */
    changePlan(state, { payload: { email, planId } }) {
      const plan = PLANS[planId];
      if (!plan) return;
      state.planId = planId;
      state.maxCredits = plan.credits === Infinity ? 999999 : plan.credits;
      state.credits = state.maxCredits;
      state.cooldownUntil = null;
      // Keep role if still valid
      if (planId === "free" && !["member", "viewer"].includes(state.role)) {
        state.role = "member";
      }
      // Default agent for plan
      const allowed = plan.limits.model;
      if (!allowed.includes(state.selectedAgent)) {
        state.selectedAgent = allowed[0];
      }
      saveBilling(email, {
        email,
        planId,
        role: state.role,
        credits: state.credits,
        maxCredits: state.maxCredits,
        cooldownUntil: null,
        selectedAgent: state.selectedAgent,
        usageHistory: state.usageHistory,
        teamMembers: state.teamMembers,
        billingCycle: new Date().toISOString(),
      });
    },

    /* Select active AI agent */
    setActiveAgent(state, { payload: { email, agentId } }) {
      state.selectedAgent = agentId;
      saveBilling(email, {
        email,
        planId: state.planId,
        role: state.role,
        credits: state.credits,
        maxCredits: state.maxCredits,
        cooldownUntil: state.cooldownUntil,
        selectedAgent: agentId,
        usageHistory: state.usageHistory,
        teamMembers: state.teamMembers,
        billingCycle: new Date().toISOString(),
      });
    },

    /* Change role (admin/superadmin only) */
    changeRole(state, { payload: { email, role } }) {
      if (!ROLES[role]) return;
      state.role = role;
      saveBilling(email, {
        email,
        planId: state.planId,
        role,
        credits: state.credits,
        maxCredits: state.maxCredits,
        cooldownUntil: state.cooldownUntil,
        selectedAgent: state.selectedAgent,
        usageHistory: state.usageHistory,
        teamMembers: state.teamMembers,
        billingCycle: new Date().toISOString(),
      });
    },

    /* Add team member */
    addTeamMember(state, { payload: { email, member } }) {
      if (state.teamMembers.find((m) => m.email === member.email)) return;
      state.teamMembers = [
        ...state.teamMembers,
        { ...member, addedAt: new Date().toISOString() },
      ];
      saveBilling(email, {
        email,
        planId: state.planId,
        role: state.role,
        credits: state.credits,
        maxCredits: state.maxCredits,
        cooldownUntil: state.cooldownUntil,
        selectedAgent: state.selectedAgent,
        usageHistory: state.usageHistory,
        teamMembers: state.teamMembers,
        billingCycle: new Date().toISOString(),
      });
    },

    /* Remove team member */
    removeTeamMember(state, { payload: { email, memberEmail } }) {
      state.teamMembers = state.teamMembers.filter(
        (m) => m.email !== memberEmail,
      );
      saveBilling(email, {
        email,
        planId: state.planId,
        role: state.role,
        credits: state.credits,
        maxCredits: state.maxCredits,
        cooldownUntil: state.cooldownUntil,
        selectedAgent: state.selectedAgent,
        usageHistory: state.usageHistory,
        teamMembers: state.teamMembers,
        billingCycle: new Date().toISOString(),
      });
    },

    resetBilling(state) {
      Object.assign(state, buildInitialState());
    },
  },
});

export const {
  hydrateBilling,
  deductCredits,
  refillCredits,
  changePlan,
  setActiveAgent,
  changeRole,
  addTeamMember,
  removeTeamMember,
  resetBilling,
} = billingSlice.actions;

export default billingSlice.reducer;

/* ── SELECTORS ── */
export const selectPlan = (s) => PLANS[s.billing.planId] || PLANS.free;
export const selectRole = (s) => ROLES[s.billing.role] || ROLES.member;
export const selectAgent = (s) =>
  AGENTS[s.billing.selectedAgent] || AGENTS["claude-haiku"];
export const selectCredits = (s) => s.billing.credits;
export const selectMaxCredits = (s) => s.billing.maxCredits;
export const selectCooldown = (s) => s.billing.cooldownUntil;
export const selectCooldownMs = (s) => {
  if (!s.billing.cooldownUntil) return 0;
  return Math.max(0, new Date(s.billing.cooldownUntil).getTime() - Date.now());
};
export const canUseAI = (s) => {
  // If billing hasn't loaded yet (e.g. page refresh before hydrate runs), allow through
  if (!s.billing.loaded) return true;
  const role = ROLES[s.billing.role] || ROLES.member;
  const cd = selectCooldownMs(s);
  // Enterprise (999999 credits) always passes credit check
  const hasCredits = s.billing.credits > 0 || s.billing.maxCredits >= 999999;
  return role.permissions.canUseAI && cd === 0 && hasCredits;
};

/* ── Seed demo billing with superadmin + enterprise + all agents ── */
(function seedDemoBilling() {
  try {
    const BILLING_STORE = localStorage.getItem("aipp_billing");
    const all = BILLING_STORE ? JSON.parse(BILLING_STORE) : {};
    if (!all["demo@aipp.ai"]) {
      all["demo@aipp.ai"] = {
        email: "demo@aipp.ai",
        planId: "enterprise",
        role: "superadmin",
        credits: 999999,
        maxCredits: 999999,
        cooldownUntil: null,
        selectedAgent: "claude-sonnet",
        usageHistory: [],
        teamMembers: [],
        billingCycle: new Date().toISOString(),
      };
      localStorage.setItem("aipp_billing", JSON.stringify(all));
    }
  } catch {
    /* empty */
  }
})();
