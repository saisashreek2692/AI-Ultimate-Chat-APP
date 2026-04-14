export async function callClaude(
  messages,
  system = "You are a helpful AI assistant.",
  maxTokens = 1000,
) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content[0].text;
}

export function formatMessage(text) {
  return text
    .replace(
      /```(\w+)?\n?([\s\S]*?)```/g,
      (_, _l, code) => `<pre><code>${escHtml(code.trim())}</code></pre>`,
    )
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

export function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
