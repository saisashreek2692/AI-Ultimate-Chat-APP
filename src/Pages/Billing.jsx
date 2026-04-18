import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  changePlan,
  addTeamMember,
  removeTeamMember,
  changeRole,
  selectPlan,
  selectCredits,
  selectMaxCredits,
  selectCooldownMs,
  PLANS,
  ROLES,
  AGENTS,
} from "../store/slices/billingSlice";
import { showToast } from "../store/slices/uiSlice";

/* ── Credit bar ── */
function CreditBar({ credits, max, planColor }) {
  const pct = max >= 999999 ? 100 : Math.round((credits / max) * 100);
  const isLow = pct < 20;
  const color = max >= 999999 ? "#10B981" : isLow ? "#EF4444" : planColor;
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          marginBottom: 6,
        }}
      >
        <span style={{ color: "var(--text2)" }}>Credits remaining</span>
        <span style={{ fontWeight: 600, color }}>
          {max >= 999999
            ? "∞ Unlimited"
            : `${credits.toLocaleString()} / ${max.toLocaleString()}`}
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: "var(--surface3)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 4,
            transition: "width 0.4s ease",
            boxShadow: isLow ? `0 0 8px ${color}60` : "none",
          }}
        />
      </div>
      {isLow && max < 999999 && (
        <div style={{ fontSize: 11, color: "#FCA5A5", marginTop: 5 }}>
          ⚠️ Running low — {pct}% remaining
        </div>
      )}
    </div>
  );
}

/* ── Plan card ── */
function PlanCard({ plan, current, onUpgrade }) {
  const isCurrent = current.id === plan.id;
  const isEnterprise = plan.id === "enterprise";
  return (
    <div
      style={{
        background: isCurrent ? "var(--surface2)" : "var(--surface)",
        border: `1.5px solid ${isCurrent ? plan.color : "var(--border)"}`,
        borderRadius: 18,
        padding: "24px 20px",
        position: "relative",
        transition: "all 0.2s",
        flex: 1,
        minWidth: 220,
        boxShadow: isCurrent
          ? `0 0 0 1px ${plan.color}44, 0 8px 32px rgba(0,0,0,0.3)`
          : "none",
      }}
    >
      {isCurrent && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: `${plan.color}22`,
            color: plan.color,
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 20,
            letterSpacing: 0.5,
          }}
        >
          CURRENT PLAN
        </div>
      )}
      {plan.id === "pro" && !isCurrent && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "rgba(79,127,250,0.15)",
            color: "#7FA8FF",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 20,
          }}
        >
          MOST POPULAR
        </div>
      )}
      <div
        style={{
          fontFamily: "'Bricolage Grotesque',sans-serif",
          fontWeight: 800,
          fontSize: 22,
          color: plan.color,
          marginBottom: 4,
        }}
      >
        {plan.name}
      </div>
      <div
        style={{
          fontFamily: "'Bricolage Grotesque',sans-serif",
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: "-1px",
          marginBottom: 4,
        }}
      >
        {plan.price}
        <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text3)" }}>
          /mo
        </span>
      </div>
      <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 20 }}>
        {plan.credits === Infinity
          ? "Unlimited credits"
          : `${plan.credits} credits / month`}
        {plan.cooldownHours > 0
          ? ` · ${plan.cooldownHours}h cooldown`
          : plan.priceMonthly > 0
            ? " · No cooldown"
            : ""}
      </div>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 24,
        }}
      >
        {plan.features.map((f) => (
          <li
            key={f}
            style={{
              fontSize: 12,
              color: "var(--text2)",
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <span
              style={{ color: "var(--green)", flexShrink: 0, marginTop: 1 }}
            >
              ✓
            </span>{" "}
            {f}
          </li>
        ))}
      </ul>
      <button
        className={`btn ${isCurrent ? "btn-secondary" : "btn-primary"} btn-sm`}
        style={{
          width: "100%",
          justifyContent: "center",
          background: isCurrent
            ? ""
            : `linear-gradient(135deg,${plan.color},${plan.color}cc)`,
          boxShadow: isCurrent ? "" : `0 4px 16px ${plan.color}44`,
          opacity: isEnterprise && !isCurrent ? 0.9 : 1,
        }}
        onClick={() => onUpgrade(plan.id)}
      >
        {isCurrent
          ? "✓ Current Plan"
          : isEnterprise
            ? "📞 Contact Sales"
            : `Upgrade to ${plan.name}`}
      </button>
    </div>
  );
}

/* ── Usage history row ── */
function UsageRow({ item }) {
  const agent = AGENTS[item.agent];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: `${agent?.color}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {agent?.icon || "🤖"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>
          {agent?.name || item.agent}
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)" }}>
          {item.module} · {new Date(item.date).toLocaleString()}
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--amber)",
          flexShrink: 0,
        }}
      >
        -{item.credits} cr
      </div>
    </div>
  );
}

export default function Billing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const plan = useSelector(selectPlan);
  const credits = useSelector(selectCredits);
  const maxCr = useSelector(selectMaxCredits);
  const cdMs = useSelector(selectCooldownMs);
  const usage = useSelector((s) => s.billing.usageHistory);
  const team = useSelector((s) => s.billing.teamMembers);
  const myRole = useSelector((s) => s.billing.role);

  const [tab, setTab] = useState("plans");
  const [newMember, setNewMember] = useState({
    email: "",
    name: "",
    role: "member",
  });
  const [addErr, setAddErr] = useState("");

  const canManageBilling = ROLES[myRole]?.permissions.canManageBilling;
  const canManageTeam = ROLES[myRole]?.permissions.canManageTeam;

  const handleUpgrade = (planId) => {
    if (planId === "enterprise") {
      dispatch(showToast("Contact sales@aipp.ai for Enterprise", "📞"));
      return;
    }
    if (planId === plan.id) {
      dispatch(showToast("Already on this plan", "💡"));
      return;
    }
    dispatch(changePlan({ email: user.email, planId }));
    dispatch(showToast(`Switched to ${PLANS[planId].name} plan!`, "🎉"));
  };

  const handleAddMember = () => {
    setAddErr("");
    if (!newMember.email) {
      setAddErr("Email required.");
      return;
    }
    if (!newMember.name) {
      setAddErr("Name required.");
      return;
    }
    const maxSize = PLANS[plan.id]?.limits.teamSize || 1;
    if (team.length >= maxSize) {
      setAddErr(
        `Your ${plan.name} plan supports up to ${maxSize} team member${maxSize === 1 ? "" : "s"}. Upgrade to add more.`,
      );
      return;
    }
    dispatch(
      addTeamMember({
        email: user.email,
        member: { ...newMember, addedBy: user.email },
      }),
    );
    dispatch(showToast(`${newMember.name} added to team`, "✓"));
    setNewMember({ email: "", name: "", role: "member" });
  };

  const TABS = [
    { id: "plans", label: "Plans & Billing" },
    { id: "usage", label: "Usage History" },
    { id: "team", label: "Team Members" },
    { id: "roles", label: "Roles & Permissions" },
  ];

  return (
    <>
      <div className="module-header">
        <div className="module-title-row">
          <div
            className="module-icon"
            style={{
              background: "rgba(79,127,250,0.1)",
              borderColor: "rgba(79,127,250,0.2)",
            }}
          >
            💳
          </div>
          <div>
            <div className="module-title">Billing &amp; Subscription</div>
            <div className="module-sub">
              Manage your plan, credits, team, and roles
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "16px clamp(16px,3vw,28px)",
          flex: 1,
          overflowY: "auto",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* ── CREDIT STATUS CARD ── */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1, minWidth: 200 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Bricolage Grotesque',sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {plan.name} Plan
                </div>
                <div
                  style={{
                    background: `${plan.color}22`,
                    color: plan.color,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: 20,
                  }}
                >
                  {myRole.toUpperCase()}
                </div>
              </div>
              <CreditBar credits={credits} max={maxCr} planColor={plan.color} />
              {cdMs > 0 && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "#FCA5A5",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  ⏳ Cooldown active ·{" "}
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ padding: "3px 10px", fontSize: 11 }}
                    onClick={() => navigate("/billing")}
                  >
                    Upgrade to skip
                  </button>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setTab("plans")}
              >
                ⚡ Upgrade Plan
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate("/agents")}
              >
                🤖 Choose Agent
              </button>
            </div>
          </div>

          {/* ── TABS ── */}
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 20,
              borderBottom: "1px solid var(--border)",
              overflow: "auto",
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "9px 16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  color: tab === t.id ? "var(--text)" : "var(--text3)",
                  borderBottom:
                    tab === t.id
                      ? "2px solid var(--blue)"
                      : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── PLANS TAB ── */}
          {tab === "plans" && (
            <div>
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 6,
                }}
              >
                Choose Your Plan
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text2)",
                  marginBottom: 24,
                }}
              >
                All plans include access to all Phase 1 &amp; 2 modules. Credits
                reset monthly.
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {Object.values(PLANS).map((p) => (
                  <PlanCard
                    key={p.id}
                    plan={p}
                    current={plan}
                    onUpgrade={handleUpgrade}
                  />
                ))}
              </div>

              {/* Cooldown explainer */}
              {plan.id === "free" && (
                <div
                  style={{
                    marginTop: 24,
                    padding: "16px 20px",
                    background: "rgba(245,158,11,0.06)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: "#FCD34D",
                      marginBottom: 6,
                    }}
                  >
                    ⏳ Free Plan Cooldown Policy
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text2)",
                      lineHeight: 1.65,
                    }}
                  >
                    When your 50 credits are depleted, a{" "}
                    <strong style={{ color: "var(--text)" }}>
                      5-hour cooldown
                    </strong>{" "}
                    begins. After 5 hours, your credits automatically refill to
                    50. Upgrade to{" "}
                    <strong style={{ color: "#4F7FFA" }}>Pro</strong> or{" "}
                    <strong style={{ color: "#7C5CFC" }}>Enterprise</strong> to
                    remove cooldowns entirely.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── USAGE TAB ── */}
          {tab === "usage" && (
            <div>
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 20,
                }}
              >
                Usage History
              </div>
              {usage.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: 60,
                    color: "var(--text3)",
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
                  <div>
                    No usage recorded yet. Start using AI features to see your
                    history.
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 16,
                      marginBottom: 20,
                    }}
                  >
                    {[
                      ["Total Calls", usage.length, "var(--blue)"],
                      [
                        "Credits Used",
                        usage.reduce((a, u) => a + u.credits, 0),
                        "var(--amber)",
                      ],
                      [
                        "Modules Used",
                        [...new Set(usage.map((u) => u.module))].length,
                        "var(--green)",
                      ],
                    ].map(([label, val, color]) => (
                      <div
                        key={label}
                        style={{
                          textAlign: "center",
                          padding: "12px 8px",
                          background: "var(--surface2)",
                          borderRadius: 10,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Bricolage Grotesque',sans-serif",
                            fontWeight: 700,
                            fontSize: 24,
                            color,
                          }}
                        >
                          {val}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text3)",
                            marginTop: 3,
                          }}
                        >
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ maxHeight: 360, overflowY: "auto" }}>
                    {usage.map((item, i) => (
                      <UsageRow key={i} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TEAM TAB ── */}
          {tab === "team" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Bricolage Grotesque',sans-serif",
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    Team Members
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text3)",
                      marginTop: 3,
                    }}
                  >
                    {team.length} /{" "}
                    {PLANS[plan.id]?.limits.teamSize === Infinity
                      ? "∞"
                      : PLANS[plan.id]?.limits.teamSize}{" "}
                    members
                  </div>
                </div>
              </div>

              {/* Add member form */}
              {canManageTeam ? (
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: 20,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}
                  >
                    Add Team Member
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr auto",
                      gap: 10,
                      alignItems: "flex-end",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 11,
                          color: "var(--text3)",
                          marginBottom: 5,
                        }}
                      >
                        Full Name
                      </label>
                      <input
                        value={newMember.name}
                        onChange={(e) =>
                          setNewMember((m) => ({ ...m, name: e.target.value }))
                        }
                        placeholder="Jane Smith"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 11,
                          color: "var(--text3)",
                          marginBottom: 5,
                        }}
                      >
                        Email
                      </label>
                      <input
                        value={newMember.email}
                        onChange={(e) =>
                          setNewMember((m) => ({ ...m, email: e.target.value }))
                        }
                        placeholder="jane@company.com"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 11,
                          color: "var(--text3)",
                          marginBottom: 5,
                        }}
                      >
                        Role
                      </label>
                      <select
                        value={newMember.role}
                        onChange={(e) =>
                          setNewMember((m) => ({ ...m, role: e.target.value }))
                        }
                        style={inputStyle}
                      >
                        {Object.values(ROLES).map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {addErr && (
                    <div
                      style={{ color: "#FCA5A5", fontSize: 12, marginTop: 8 }}
                    >
                      {addErr}
                    </div>
                  )}
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: 12 }}
                    onClick={handleAddMember}
                  >
                    + Add Member
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    background: "var(--surface2)",
                    borderRadius: 10,
                    padding: 14,
                    fontSize: 13,
                    color: "var(--text3)",
                    marginBottom: 20,
                  }}
                >
                  🔒 Team management requires Admin or Super Admin role.
                </div>
              )}

              {/* Team list */}
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                {/* Owner row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 20px",
                    borderBottom: "1px solid var(--border)",
                    background: "var(--surface2)",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg,var(--blue),var(--violet))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {user?.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {user?.name}{" "}
                      <span style={{ color: "var(--text3)", fontWeight: 400 }}>
                        (you)
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>
                      {user?.email}
                    </div>
                  </div>
                  <div
                    style={{
                      ...rolePill(ROLES[myRole]?.color, ROLES[myRole]?.bg),
                    }}
                  >
                    {ROLES[myRole]?.label}
                  </div>
                </div>

                {team.length === 0 ? (
                  <div
                    style={{
                      padding: "32px 20px",
                      textAlign: "center",
                      color: "var(--text3)",
                      fontSize: 13,
                    }}
                  >
                    No team members added yet.
                  </div>
                ) : (
                  team.map((m) => (
                    <div
                      key={m.email}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 20px",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "var(--surface3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {(m.name || "?").slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>
                          {m.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>
                          {m.email}
                        </div>
                      </div>
                      <div
                        style={{
                          ...rolePill(ROLES[m.role]?.color, ROLES[m.role]?.bg),
                        }}
                      >
                        {ROLES[m.role]?.label}
                      </div>
                      {canManageTeam && (
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: "4px 10px",
                            fontSize: 11,
                            color: "var(--red)",
                          }}
                          onClick={() => {
                            dispatch(
                              removeTeamMember({
                                email: user.email,
                                memberEmail: m.email,
                              }),
                            );
                            dispatch(showToast(`${m.name} removed`, "✓"));
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── ROLES TAB ── */}
          {tab === "roles" && (
            <div>
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 8,
                }}
              >
                Roles &amp; Permissions
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text2)",
                  marginBottom: 24,
                }}
              >
                Roles control what each team member can do within AIPP.
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {Object.values(ROLES).map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: "18px 20px",
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        ...rolePill(r.color, r.bg),
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {r.label}
                    </div>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          marginBottom: 4,
                        }}
                      >
                        {r.label}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text2)",
                          marginBottom: 10,
                        }}
                      >
                        {r.description}
                      </div>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                      >
                        {Object.entries(r.permissions).map(
                          ([perm, allowed]) => (
                            <span
                              key={perm}
                              style={{
                                fontSize: 10,
                                fontWeight: 500,
                                padding: "2px 8px",
                                borderRadius: 6,
                                background: allowed
                                  ? "rgba(16,185,129,0.12)"
                                  : "rgba(239,68,68,0.08)",
                                color: allowed
                                  ? "var(--green)"
                                  : "var(--text3)",
                                border: `1px solid ${allowed ? "rgba(16,185,129,0.2)" : "var(--border)"}`,
                              }}
                            >
                              {allowed ? "✓" : "✗"}{" "}
                              {perm.replace(/([A-Z])/g, " $1").toLowerCase()}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                    {canManageBilling && r.id !== myRole && (
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ flexShrink: 0 }}
                        onClick={() => {
                          dispatch(
                            changeRole({ email: user.email, role: r.id }),
                          );
                          dispatch(
                            showToast(`Role changed to ${r.label}`, "✓"),
                          );
                        }}
                      >
                        Switch to this role
                      </button>
                    )}
                    {r.id === myRole && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--text3)",
                          flexShrink: 0,
                          padding: "6px 12px",
                          background: "var(--surface2)",
                          borderRadius: 8,
                        }}
                      >
                        Your role
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  background: "var(--bg2)",
  border: "1px solid var(--border2)",
  borderRadius: 9,
  color: "var(--text)",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
};

const rolePill = (color = "#888", bg = "rgba(0,0,0,0.1)") => ({
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: 20,
  background: bg,
  color,
  fontWeight: 600,
  fontSize: 11,
  border: `1px solid ${color}44`,
});
