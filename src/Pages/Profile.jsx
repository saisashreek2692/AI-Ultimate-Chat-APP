import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  updateProfileThunk,
  changePasswordThunk,
  logout,
} from "../store/slices/authSlice";
import { clearHistory } from "../store/slices/brainSlice";
import { showToast } from "../store/slices/uiSlice";
import { Spinner } from "../components/ui";
import {
  selectPlan,
  selectAgent,
  selectCredits,
  selectMaxCredits,
  ROLES,
  AGENTS,
  PLANS,
} from "../store/slices/billingSlice";

/* ── Section card ── */
function Section({ title, sub, children }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "-0.3px",
          }}
        >
          {title}
        </div>
        {sub && (
          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 3 }}>
            {sub}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── Field ── */
function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  hint,
  disabled,
}) {
  const base = {
    width: "100%",
    padding: "10px 14px",
    background: disabled ? "var(--surface2)" : "var(--bg2)",
    border: "1px solid var(--border2)",
    borderRadius: 10,
    color: disabled ? "var(--text3)" : "var(--text)",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    cursor: disabled ? "not-allowed" : "auto",
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 500,
          color: "var(--text2)",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          style={{ ...base, resize: "vertical", lineHeight: 1.6 }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          style={base}
          onFocus={(e) => {
            if (!disabled) {
              e.target.style.borderColor = "var(--blue)";
              e.target.style.boxShadow = "0 0 0 3px rgba(79,127,250,0.12)";
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border2)";
            e.target.style.boxShadow = "none";
          }}
        />
      )}
      {hint && (
        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 5 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

/* ── Avatar ── */
function Avatar({ user, size = 72 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg,var(--blue),var(--violet))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.34,
        fontWeight: 700,
        color: "#fff",
        border: "3px solid var(--border2)",
        letterSpacing: "-0.5px",
      }}
    >
      {user?.initials}
    </div>
  );
}

/* ── Stat card ── */
function Stat({ label, value, color }) {
  return (
    <div
      style={{
        background: "var(--surface2)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "12px 16px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'Bricolage Grotesque',sans-serif",
          fontWeight: 700,
          fontSize: 20,
          background: `linear-gradient(135deg,${color},${color}99)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>
        {label}
      </div>
    </div>
  );
}

/* ── Toggle ── */
function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        cursor: "pointer",
        flexShrink: 0,
        background: checked ? "var(--blue)" : "var(--surface3)",
        border: `1px solid ${checked ? "var(--blue)" : "var(--border2)"}`,
        position: "relative",
        transition: "all 0.2s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: checked ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}

/* ── Notif row ── */
function NotifRow({ label, sub, checked, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        {sub && (
          <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
            {sub}
          </div>
        )}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const chatLen = useSelector((s) => s.brain.history.length);
  const authLoad = useSelector((s) => s.auth.loading);

  /* Billing */
  const plan = useSelector(selectPlan);
  const agent = useSelector(selectAgent);
  const credits = useSelector(selectCredits);
  const maxCr = useSelector(selectMaxCredits);
  const role = useSelector((s) => s.billing.role);
  const roleInfo = ROLES[role] || ROLES.member;

  /* Profile form */
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  useEffect(() => {
    setProfileForm({ name: user?.name || "", bio: user?.bio || "" });
  }, [user?.name, user?.bio]);

  /* Password form */
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwVisible, setPwVisible] = useState(false);

  /* Prefs */
  const [prefs, setPrefs] = useState({
    emailNotifs: true,
    slackNotifs: false,
    weeklyDigest: true,
    aiModel: "claude-sonnet",
    language: "en",
  });

  /* Danger zone */
  const [deleteText, setDeleteText] = useState("");

  /* ── Handlers ── */
  const saveProfile = async () => {
    if (!profileForm.name.trim()) {
      dispatch(showToast("Name cannot be empty", "⚠️"));
      return;
    }
    setProfileSaving(true);
    const res = await dispatch(
      updateProfileThunk({ name: profileForm.name, bio: profileForm.bio }),
    );
    setProfileSaving(false);
    dispatch(
      showToast(
        res.meta.requestStatus === "fulfilled"
          ? "Profile updated"
          : res.payload || "Update failed",
        res.meta.requestStatus === "fulfilled" ? "✓" : "⚠️",
      ),
    );
  };

  const savePassword = async () => {
    setPwError("");
    if (!pwForm.current) {
      setPwError("Enter your current password.");
      return;
    }
    if (pwForm.next.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError("New passwords do not match.");
      return;
    }
    setPwSaving(true);
    const res = await dispatch(
      changePasswordThunk({
        currentPassword: pwForm.current,
        newPassword: pwForm.next,
      }),
    );
    setPwSaving(false);
    if (res.meta.requestStatus === "fulfilled") {
      setPwForm({ current: "", next: "", confirm: "" });
      dispatch(showToast("Password changed", "🔐"));
    } else {
      setPwError(res.payload || "Failed to change password.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const clearAIMemory = () => {
    dispatch(clearHistory());
    dispatch(showToast("AI history cleared", "🧠"));
  };

  const handleDelete = () => {
    if (deleteText !== user?.email) {
      dispatch(showToast("Email does not match", "⚠️"));
      return;
    }
    try {
      const users = JSON.parse(localStorage.getItem("aipp_users") || "{}");
      delete users[user.email];
      localStorage.setItem("aipp_users", JSON.stringify(users));
    } catch {}
    dispatch(logout());
    navigate("/");
  };

  /* ── Password field ── */
  const PwField = ({ label, fKey, placeholder }) => (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 500,
          color: "var(--text2)",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={pwVisible ? "text" : "password"}
          value={pwForm[fKey]}
          onChange={(e) => setPwForm((f) => ({ ...f, [fKey]: e.target.value }))}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") savePassword();
          }}
          style={{
            width: "100%",
            padding: "10px 44px 10px 14px",
            background: "var(--bg2)",
            border: "1px solid var(--border2)",
            borderRadius: 10,
            color: "var(--text)",
            fontSize: 14,
            outline: "none",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--blue)";
            e.target.style.boxShadow = "0 0 0 3px rgba(79,127,250,0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border2)";
            e.target.style.boxShadow = "none";
          }}
        />
        {fKey === "current" && (
          <button
            onClick={() => setPwVisible((v) => !v)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "var(--text3)",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            {pwVisible ? "🙈" : "👁️"}
          </button>
        )}
      </div>
    </div>
  );

  const creditPct =
    maxCr >= 999999 ? 100 : Math.max(0, Math.round((credits / maxCr) * 100));
  const creditColor =
    creditPct < 20
      ? "var(--red)"
      : creditPct < 50
        ? "var(--amber)"
        : "var(--green)";
  return (
    <>
      <div
        style={{ padding: "clamp(16px,3vw,28px)", overflowY: "auto", flex: 1 }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {/* PAGE HEADER */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontWeight: 800,
                fontSize: "clamp(20px,3vw,26px)",
                letterSpacing: "-0.5px",
              }}
            >
              Profile &amp; Settings
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>
              Manage your account, subscription, and security
            </div>
          </div>

          {/* OVERVIEW CARD */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 24,
              marginBottom: 20,
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <Avatar user={user} />
            <div style={{ flex: 1, minWidth: 160 }}>
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque',sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  letterSpacing: "-0.3px",
                }}
              >
                {user?.name}
              </div>
              <div
                style={{ fontSize: 13, color: "var(--text2)", marginTop: 3 }}
              >
                {user?.email}
              </div>
              {user?.bio && (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text3)",
                    marginTop: 7,
                    lineHeight: 1.55,
                  }}
                >
                  {user.bio}
                </div>
              )}
              {/* Role badge */}
              <div
                style={{
                  marginTop: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 20,
                  background: roleInfo.bg,
                  color: roleInfo.color,
                  border: `1px solid ${roleInfo.color}44`,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {roleInfo.label}
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                minWidth: 200,
              }}
            >
              <Stat label="AI Messages" value={chatLen} color="var(--blue)" />
              <Stat label="Plan" value={plan.name} color={plan.color} />
            </div>
          </div>

          {/* SUBSCRIPTION CARD */}
          <div
            style={{
              background: "var(--surface)",
              border: `1.5px solid ${plan.color}44`,
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Bricolage Grotesque',sans-serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: plan.color,
                    marginBottom: 4,
                  }}
                >
                  💳 {plan.name} Plan
                </div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>
                  {maxCr >= 999999
                    ? "Unlimited credits"
                    : `${credits} of ${maxCr} credits remaining`}
                  {plan.cooldownHours > 0
                    ? ` · ${plan.cooldownHours}h cooldown on depletion`
                    : " · No cooldown"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate("/agents")}
                >
                  {agent?.icon} {agent?.name}
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate("/billing")}
                  style={{
                    background: `linear-gradient(135deg,${plan.color},${plan.color}cc)`,
                  }}
                >
                  {plan.id === "enterprise" ? "🏢 Manage Plan" : "⚡ Upgrade"}
                </button>
              </div>
            </div>

            {/* Credit bar */}
            {maxCr < 999999 && (
              <div style={{ marginTop: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    marginBottom: 5,
                    color: "var(--text3)",
                  }}
                >
                  <span>Credits used</span>
                  <span style={{ color: creditColor, fontWeight: 600 }}>
                    {creditPct}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "var(--surface3)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${100 - creditPct}%`,
                      background: creditColor,
                      borderRadius: 3,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Active agent info */}
            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                background: "var(--surface2)",
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  background: `${agent?.color}18`,
                  flexShrink: 0,
                }}
              >
                {agent?.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {agent?.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>
                  {agent?.description?.slice(0, 60)}…
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono',monospace",
                  color: agent?.color,
                  fontWeight: 700,
                }}
              >
                {agent?.creditCost} cr/call
              </div>
            </div>
          </div>

          {/* PROFILE DETAILS */}
          <Section
            title="Profile Details"
            sub="Your public-facing name and bio"
          >
            <Field
              label="Full Name"
              value={profileForm.name}
              placeholder="Your full name"
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, name: e.target.value }))
              }
            />
            <Field
              label="Email Address"
              value={user?.email || ""}
              disabled
              hint="Email cannot be changed. Create a new account to use a different address."
            />
            <Field
              label="Bio"
              type="textarea"
              value={profileForm.bio}
              placeholder="Tell us a little about yourself…"
              onChange={(e) =>
                setProfileForm((f) => ({ ...f, bio: e.target.value }))
              }
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={saveProfile}
                disabled={profileSaving || authLoad}
              >
                {profileSaving ? (
                  <>
                    <Spinner /> Saving…
                  </>
                ) : (
                  "💾 Save Profile"
                )}
              </button>
            </div>
          </Section>

          {/* CHANGE PASSWORD */}
          <Section
            title="Change Password"
            sub="Use a strong password with at least 6 characters"
          >
            <PwField
              label="Current Password"
              fKey="current"
              placeholder="Your current password"
            />
            <PwField
              label="New Password"
              fKey="next"
              placeholder="At least 6 characters"
            />
            <PwField
              label="Confirm New Password"
              fKey="confirm"
              placeholder="Repeat new password"
            />
            {pwError && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  color: "#FCA5A5",
                  fontSize: 12,
                  marginBottom: 14,
                }}
              >
                {pwError}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={savePassword}
                disabled={pwSaving}
              >
                {pwSaving ? (
                  <>
                    <Spinner /> Updating…
                  </>
                ) : (
                  "🔐 Update Password"
                )}
              </button>
            </div>
          </Section>

          {/* NOTIFICATIONS */}
          <Section title="Notifications" sub="Control how AIPP contacts you">
            <NotifRow
              label="Email Notifications"
              sub="Important updates and announcements"
              checked={prefs.emailNotifs}
              onChange={(v) => setPrefs((p) => ({ ...p, emailNotifs: v }))}
            />
            <NotifRow
              label="Slack Alerts"
              sub="Receive workflow alerts in Slack"
              checked={prefs.slackNotifs}
              onChange={(v) => setPrefs((p) => ({ ...p, slackNotifs: v }))}
            />
            <NotifRow
              label="Weekly Digest"
              sub="Activity summary every Monday"
              checked={prefs.weeklyDigest}
              onChange={(v) => setPrefs((p) => ({ ...p, weeklyDigest: v }))}
            />
          </Section>

          {/* PREFERENCES */}
          <Section title="Preferences" sub="Customize your AIPP experience">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text2)",
                    marginBottom: 6,
                  }}
                >
                  Default AI Agent
                </label>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{
                    width: "100%",
                    justifyContent: "flex-start",
                    gap: 8,
                  }}
                  onClick={() => navigate("/agents")}
                >
                  {agent?.icon} {agent?.name} — {agent?.creditCost} cr/call{" "}
                  <span style={{ marginLeft: "auto", fontSize: 10 }}>
                    Change →
                  </span>
                </button>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text2)",
                    marginBottom: 6,
                  }}
                >
                  Language
                </label>
                <select
                  value={prefs.language}
                  onChange={(e) =>
                    setPrefs((p) => ({ ...p, language: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "9px 12px",
                    background: "var(--bg2)",
                    border: "1px solid var(--border2)",
                    borderRadius: 9,
                    color: "var(--text)",
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  {[
                    ["en", "English"],
                    ["es", "Español"],
                    ["fr", "Français"],
                    ["de", "Deutsch"],
                    ["ja", "日本語"],
                    ["zh", "中文"],
                    ["ar", "العربية"],
                    ["pt", "Português"],
                  ].map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => dispatch(showToast("Preferences saved", "✓"))}
              >
                💾 Save Preferences
              </button>
            </div>
          </Section>

          {/* ACCOUNT ACTIONS */}
          <Section title="Account" sub="Session and data management">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleLogout}
              >
                🚪 Sign Out
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={clearAIMemory}
              >
                🧠 Clear AI Memory
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate("/billing")}
              >
                💳 Manage Billing
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => dispatch(showToast("Export coming soon", "📊"))}
              >
                📊 Export Data
              </button>
            </div>
          </Section>

          {/* DANGER ZONE */}
          <div
            style={{
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 16,
              padding: 24,
              marginBottom: 40,
            }}
          >
            <div
              style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--red)",
                marginBottom: 6,
              }}
            >
              ⚠️ Danger Zone
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text2)",
                marginBottom: 18,
                lineHeight: 1.6,
              }}
            >
              Deleting your account is permanent and cannot be undone. All your
              data will be erased.
            </div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text2)",
                marginBottom: 6,
              }}
            >
              Type{" "}
              <strong style={{ color: "var(--text)" }}>{user?.email}</strong> to
              confirm
            </label>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <input
                type="email"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder={user?.email}
                style={{
                  flex: 1,
                  minWidth: 200,
                  maxWidth: 320,
                  padding: "10px 14px",
                  background: "var(--bg2)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 10,
                  color: "var(--text)",
                  fontSize: 14,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <button
                className="btn btn-sm"
                style={{
                  background: "var(--red)",
                  color: "#fff",
                  opacity: deleteText === user?.email ? 1 : 0.35,
                  cursor:
                    deleteText === user?.email ? "pointer" : "not-allowed",
                }}
                onClick={handleDelete}
                disabled={deleteText !== user?.email}
              >
                🗑️ Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
