# AIPP — AI Unified Productivity Platform

> One platform to run your work, code, content, meetings, and automation.
> Powered by multi-model AI with credit tokens, role-based access, and a 5-hour cooldown system.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure your API key
```bash
cp .env.example .env
```
Open `.env` and set your Anthropic API key:
```
VITE_ANTHROPIC_API_KEY=sk-ant-api03-YOUR-KEY-HERE
```
Get a key at https://console.anthropic.com

### 3. Run the dev server
```bash
npm run dev
# → http://localhost:5173
```

**Demo account:** `demo@aipp.ai` / `demo123` — pre-seeded with Enterprise plan + Super Admin role + unlimited credits.

---

## 🔑 How the API Works

The Vite dev server **proxies** all `/api/claude` requests to `https://api.anthropic.com/v1/messages`, injecting your API key server-side. This avoids CORS and keeps the key out of the browser bundle.

In production, replace the proxy with a server-side function (Cloudflare Worker, Next.js API route, Express endpoint) that does the same injection.

---

## 💳 Credit & Billing System

### Plans

| Plan | Price | Credits | Cooldown | Team |
|------|-------|---------|----------|------|
| **Free** | $0/mo | 50 cr/cycle | 5h cooldown when depleted | 1 member |
| **Pro** | $19/mo | 500 cr/month | No cooldown | 5 members |
| **Enterprise** | $99/mo | Unlimited | Never | Unlimited |

### Credit Costs per AI Call

| Agent | Provider | Cost | Plans |
|-------|----------|------|-------|
| ⚡ Claude Haiku | Anthropic | 1 credit | All plans |
| 🎵 Claude Sonnet | Anthropic | 3 credits | Pro + Enterprise |
| 🎭 Claude Opus | Anthropic | 8 credits | Enterprise only |
| 🤖 GPT-4o | OpenAI (simulated) | 5 credits | Enterprise only |
| 💎 Gemini 1.5 Pro | Google (simulated) | 4 credits | Enterprise only |

### Cooldown Policy
Free plan users who exhaust their 50 credits trigger a **5-hour cooldown** countdown displayed live in the topbar and on a full-page gate. Credits auto-refill when the timer reaches zero. Pro/Enterprise users have no cooldowns.

---

## 🔐 Role-Based Access Control (RBAC)

| Role | Use AI | Manage Team | Manage Billing |
|------|--------|-------------|---------------|
| **Viewer** | ✗ | ✗ | ✗ |
| **Member** | ✓ | ✗ | ✗ |
| **Admin** | ✓ | ✓ | ✗ |
| **Super Admin** | ✓ | ✓ | ✓ |

Roles are managed from **Billing → Roles & Permissions**. Super Admin can switch roles and add/remove team members.

---

## 🧩 Modules

| Module | Route | Phase | Description |
|--------|-------|-------|-------------|
| 🧠 AI Brain | `/brain` | P1 | Central chat, powered by selected agent |
| 💻 Dev Hub | `/dev` | P1 | Code generation, debug, docs, explain |
| 📝 Writing Studio | `/writing` | P1 | Blog, email, resume, social, reports |
| 📊 Smart Office | `/office` | P1 | Summarize, translate, Q&A, compare docs |
| 📅 Meetings Hub | `/meetings` | P2 | Transcript + AI action item extraction |
| 🔄 Workflow Engine | `/workflow` | P2 | Visual automation builder |
| 🤖 AI Agents | `/agents` | — | Agent selector & comparison |
| 💳 Billing | `/billing` | — | Plans, usage history, team, roles |
| 👤 Profile | `/profile` | — | Settings, password, preferences |

---

## 🏗 Architecture

```
src/
├── components/
│   ├── layout/AppLayout.jsx    # Topbar (credit pill + countdown + agent pill), sidebar, bottom nav
│   └── ui/
│       ├── index.jsx           # Spinner, ToastContainer, EmptyState
│       └── CooldownGate.jsx    # Full-page credit/role gate with live countdown
├── lib/api.js                  # callClaude (routes to /api/claude proxy), formatMessage, formatLog
├── pages/
│   ├── landing/                # Marketing page with pricing, agents, RBAC sections
│   ├── Auth.jsx                # Login + Register
│   ├── agents/Agents.jsx       # Agent selector grid + comparison table
│   ├── billing/Billing.jsx     # Plans, usage history, team management, roles
│   ├── brain/Brain.jsx
│   ├── dev/Dev.jsx
│   ├── meetings/Meetings.jsx
│   ├── office/Office.jsx
│   ├── profile/Profile.jsx     # Profile, password, subscription card, preferences
│   ├── workflow/Workflow.jsx
│   └── writing/Writing.jsx
└── store/
    ├── index.js
    └── slices/
        ├── authSlice.js        # Login, register, updateProfile, changePassword
        ├── billingSlice.js     # Plans, credits, cooldown, agents, roles, team members
        ├── brainSlice.js       # Chat history + sendMessage (credit-aware)
        ├── devSlice.js         # Code editor + runDevAction (credit-aware)
        ├── moduleSlices.js     # Office, Meetings, Workflow (credit-aware)
        ├── uiSlice.js          # Sidebar, drawer, toasts
        └── writingSlice.js     # Content generation + improvement (credit-aware)
```

---

## 🛠 Tech Stack

- **React 19** + **Vite 8**
- **React Router v7** (`createBrowserRouter`)
- **Redux Toolkit** (`createSlice`, `createAsyncThunk`)
- **React Redux 9**
- **Claude API** via Anthropic (claude-sonnet-4-20250514 default)
- **localStorage** for auth, billing, and session persistence

---

## 🚢 Production Deployment

Build the app:
```bash
npm run build   # output: dist/
npm run preview # preview locally
```

You need a server-side proxy for `/api/claude`. Options:

**Cloudflare Worker:**
```js
export default { async fetch(req) {
  const r = req.clone();
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', body: r.body,
    headers: { 'content-type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' }
  });
  return new Response(res.body, { headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' } });
}};
```

**Next.js API Route** (`/app/api/claude/route.js`):
```js
export async function POST(req) {
  const body = await req.json();
  const res  = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', body: JSON.stringify(body),
    headers: { 'content-type':'application/json', 'x-api-key': process.env.ANTHROPIC_KEY, 'anthropic-version':'2023-06-01' }
  });
  return Response.json(await res.json());
}
```

---

## ⚠️ Notes

- **GPT-4o and Gemini** are simulated in this demo (they route to Claude Sonnet under the hood). In production, add separate API keys and endpoint routing per provider.
- Auth and billing use `localStorage` — suitable for demos and prototypes. Replace with a proper backend for production.
- The demo account is seeded client-side on first load if it doesn't exist.

