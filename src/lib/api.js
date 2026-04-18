import { AGENTS } from "../store/slices/billingSlice";

/**
 * callClaude
 * ----------
 * Routes to /api/claude via the Vite proxy (dev) or production backend.
 * Accepts an optional `agentId` to select model; defaults to claude-haiku.
 *
 * Production: point /api/claude at a server-side function that injects
 * API keys for Anthropic / OpenAI / Google as needed.
 */
export async function callClaude(
  messages,
  system = "You are a helpful AI assistant.",
  maxTokens = 1000,
  agentId = "claude-haiku",
) {
  const agent = AGENTS[agentId] || AGENTS["claude-haiku"];

  // Simulated agents (GPT-4o, Gemini) fall back to Claude Sonnet in this demo
  const model = agent.simulated ? "claude-sonnet-4-20250514" : agent.apiModel;

  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }),
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status} ${res.statusText}`;
    try {
      const d = await res.json();
      msg = d?.error?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  if (!data.content?.[0]?.text) throw new Error("Empty response from API");
  return data.content[0].text;
}

/** Markdown-lite → safe HTML for chat bubbles */
export function formatMessage(text) {
  if (!text) return "";
  let out = escHtml(text);
  out = out.replace(
    /```(\w+)?\n?([\s\S]*?)```/g,
    (_, lang, code) =>
      `<pre><code${lang ? ` class="language-${lang}"` : ""}>${code.trim()}</code></pre>`,
  );
  out = out.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  out = out.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  out = out.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  out = out.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  out = out.replace(/^[-•] (.+)$/gm, "<li>$1</li>");
  out = out.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
  out = out.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");
  out = out.replace(/\n{2,}/g, "</p><p>");
  out = out.replace(/(?<!>)\n(?!<)/g, "<br>");
  return `<p>${out}</p>`;
}

/** HTML for Dev Hub log — code blocks styled, rest as line-breaks */
export function formatLog(text) {
  if (!text) return "";
  let out = escHtml(text);
  out = out.replace(
    /```(\w+)?\n?([\s\S]*?)```/g,
    (_, lang, code) =>
      `<pre><code${lang ? ` class="language-${lang}"` : ""}>${code.trim()}</code></pre>`,
  );
  out = out.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(
    /(<pre[\s\S]*?<\/pre>)|(\n)/g,
    (m, pre, nl) => pre || "<br>",
  );
  return out;
}

export function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
