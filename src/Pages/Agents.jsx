import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  selectAgent,
  selectPlan,
  selectCredits,
  setActiveAgent,
  AGENTS,
  PLANS,
} from "../store/slices/billingSlice";
import { showToast } from "../store/slices/uiSlice";

/* ─────────────────────────────────────
   AGENT CARD
───────────────────────────────────── */
function AgentCard({ agent, isSelected, isLocked, onSelect }) {
  return (
    <div
      onClick={() => !isLocked && onSelect(agent.id)}
      style={{
        background: isSelected ? "var(--surface2)" : "var(--surface)",
        border: `1.5px solid ${isSelected ? agent.color : isLocked ? "var(--border)" : "var(--border2)"}`,
        borderRadius: 18,
        padding: 24,
        cursor: isLocked ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        position: "relative",
        opacity: isLocked ? 0.55 : 1,
        boxShadow: isSelected
          ? `0 0 0 1px ${agent.color}44, 0 8px 32px rgba(0,0,0,0.3)`
          : "none",
      }}
    >
      {isSelected && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: `${agent.color}22`,
            color: agent.color,
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 20,
          }}
        >
          ACTIVE
        </div>
      )}

      {isLocked && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "var(--surface3)",
            color: "var(--text3)",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 20,
          }}
        >
          🔒 UPGRADE
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            flexShrink: 0,
            background: `${agent.color}18`,
            border: `1px solid ${agent.color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
          }}
        >
          {agent.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontWeight: 700,
              fontSize: 17,
            }}
          >
            {agent.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
            by {agent.provider}
          </div>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 20,
            background: `${agent.color}18`,
            color: agent.color,
            border: `1px solid ${agent.color}30`,
            flexShrink: 0,
          }}
        >
          {agent.badge}
        </span>
      </div>

      <div
        style={{
          fontSize: 13,
          color: "var(--text2)",
          lineHeight: 1.6,
          marginBottom: 14,
        }}
      >
        {agent.description}
      </div>

      {/* Strengths */}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}
      >
        {agent.strengths.map((s) => (
          <span
            key={s}
            style={{
              fontSize: 11,
              padding: "3px 9px",
              borderRadius: 20,
              background: "var(--surface3)",
              color: "var(--text2)",
              border: "1px solid var(--border)",
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {/* Credit cost */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 13px",
          background: "var(--bg2)",
          borderRadius: 10,
          border: "1px solid var(--border)",
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 12, color: "var(--text2)" }}>
          Credit cost per call
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontWeight: 700,
            fontSize: 14,
            color: agent.color,
          }}
        >
          {agent.creditCost} {agent.creditCost === 1 ? "credit" : "credits"}
        </span>
      </div>

      {/* Plan badges */}
      <div
        style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}
      >
        {agent.plans.map((p) => (
          <span
            key={p}
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 12,
              background: `${PLANS[p]?.color || "#888"}18`,
              color: PLANS[p]?.color || "#888",
              border: `1px solid ${PLANS[p]?.color || "#888"}30`,
            }}
          >
            {PLANS[p]?.name}
          </span>
        ))}
      </div>

      {isLocked ? (
        <div
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "var(--text3)",
            padding: "8px 0",
          }}
        >
          🔒 Requires {agent.plans.map((p) => PLANS[p]?.name).join(" or ")} plan
        </div>
      ) : (
        <button
          className={`btn ${isSelected ? "btn-secondary" : "btn-primary"} btn-sm`}
          style={{
            width: "100%",
            justifyContent: "center",
            background: isSelected
              ? ""
              : `linear-gradient(135deg,${agent.color},${agent.color}bb)`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(agent.id);
          }}
        >
          {isSelected ? "✓ Currently Active" : `Select ${agent.name}`}
        </button>
      )}
    </div>
  );
}

export default function Agents() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const plan = useSelector(selectPlan);
  const credits = useSelector(selectCredits);
  const activeId = useSelector((s) => s.billing.selectedAgent);

  const handleSelect = (agentId) => {
    const agent = AGENTS[agentId];
    if (!agent) return;
    if (!agent.plans.includes(plan.id)) {
      dispatch(
        showToast(
          `${agent.name} requires ${agent.plans.map((p) => PLANS[p]?.name).join(" or ")} plan`,
          "🔒",
        ),
      );
      navigate("/billing");
      return;
    }
    dispatch(setActiveAgent({ email: user.email, agentId }));
    dispatch(showToast(`Switched to ${agent.name}`, agent.icon));
  };

  return (
    <>
      <div className="module-header">
        <div className="module-title-row">
          <div
            className="module-icon"
            style={{
              background: "rgba(124,92,252,0.1)",
              borderColor: "rgba(124,92,252,0.2)",
            }}
          >
            🤖
          </div>
          <div>
            <div className="module-title">AI Agents</div>
            <div className="module-sub">
              Choose your model — different strengths, speeds, and credit costs
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "clamp(12px,2vw,20px) clamp(16px,3vw,28px)",
          flex: 1,
          overflowY: "auto",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Status bar */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "14px 20px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            {[
              ["Active Agent", AGENTS[activeId]?.name, AGENTS[activeId]?.color],
              ["Plan", plan.name, plan.color],
              [
                "Credits",
                credits >= 999999 ? "∞" : String(credits),
                credits < 10 ? "var(--red)" : "var(--text)",
              ],
            ].map(([label, val, color], i) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                {i > 0 && (
                  <div
                    style={{
                      width: 1,
                      height: 16,
                      background: "var(--border)",
                    }}
                  />
                )}
                <span style={{ fontSize: 12, color: "var(--text3)" }}>
                  {label}:
                </span>
                <strong style={{ fontSize: 13, color }}>{val}</strong>
              </div>
            ))}
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginLeft: "auto" }}
              onClick={() => navigate("/billing")}
            >
              ⚡ Upgrade Plan
            </button>
          </div>

          {/* Agent grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
              marginBottom: 32,
            }}
          >
            {Object.values(AGENTS).map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={agent.id === activeId}
                isLocked={!agent.plans.includes(plan.id)}
                onSelect={handleSelect}
              />
            ))}
          </div>

          {/* Comparison table */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              Model Comparison
            </div>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr style={{ background: "var(--surface2)" }}>
                    {[
                      "Model",
                      "Provider",
                      "Speed",
                      "Cost/Call",
                      "Best For",
                      "Plan Required",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "10px 16px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--text3)",
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                          borderBottom: "1px solid var(--border)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.values(AGENTS).map((a, i) => {
                    const speed =
                      a.creditCost <= 1
                        ? "⚡⚡⚡ Fast"
                        : a.creditCost <= 3
                          ? "⚡⚡ Balanced"
                          : a.creditCost <= 5
                            ? "⚡ Capable"
                            : "🔥 Powerful";
                    const isLocked = !a.plans.includes(plan.id);
                    return (
                      <tr
                        key={a.id}
                        style={{
                          background:
                            a.id === activeId
                              ? `${a.color}08`
                              : i % 2 === 0
                                ? "transparent"
                                : "var(--surface)",
                          borderBottom: "1px solid var(--border)",
                          opacity: isLocked ? 0.6 : 1,
                        }}
                      >
                        <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                          {a.icon} {a.name}
                          {a.id === activeId && (
                            <span
                              style={{
                                marginLeft: 8,
                                fontSize: 10,
                                background: `${a.color}22`,
                                color: a.color,
                                padding: "2px 7px",
                                borderRadius: 10,
                                fontWeight: 700,
                              }}
                            >
                              ACTIVE
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "var(--text2)",
                          }}
                        >
                          {a.provider}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "var(--text2)",
                          }}
                        >
                          {speed}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            fontFamily: "'JetBrains Mono',monospace",
                            color: a.color,
                          }}
                        >
                          {a.creditCost} cr
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "var(--text2)",
                          }}
                        >
                          {a.strengths.slice(0, 2).join(", ")}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          {isLocked ? (
                            <span style={{ fontSize: 11, color: "var(--red)" }}>
                              🔒 {a.plans.map((p) => PLANS[p]?.name).join("/")}
                            </span>
                          ) : (
                            <span
                              style={{ fontSize: 11, color: "var(--green)" }}
                            >
                              ✓ Available
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
