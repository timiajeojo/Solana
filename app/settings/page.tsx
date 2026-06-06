// app/settings/page.tsx
"use client";

import { useState, ChangeEvent, ReactNode } from "react";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = "profile" | "notifications" | "security" | "appearance";

interface NavItem   { id: Section; label: string; icon: ReactNode }
interface CardProps { title: string; description: string; children: ReactNode }
interface RowProps  { label: string; description: string; children: ReactNode }
interface ToggleProps { checked: boolean; onChange: () => void }

// ─── Shared styles ────────────────────────────────────────────────────────────

const INPUT =
  "w-full sm:w-64 rounded-lg border border-[#e8e2ff] bg-white px-3 py-2 text-sm text-[#0a0a0a] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow";

const INPUT_DISABLED =
  "w-full sm:w-64 rounded-lg border border-[#e8e2ff] bg-[#faf9ff] px-3 py-2 text-sm text-[#9ca3af] cursor-not-allowed select-none";

const GHOST =
  "rounded-lg border border-[#e8e2ff] bg-white hover:bg-[#faf9ff] hover:border-violet-300 px-3 py-1.5 text-xs font-semibold text-[#0a0a0a] transition-colors cursor-pointer";

// ─── Primitives ───────────────────────────────────────────────────────────────

function Card({ title, description, children }: CardProps) {
  return (
    <div className="rounded-2xl border border-[#e8e2ff] bg-white overflow-hidden shadow-sm">
      <div className="px-4 sm:px-6 py-4 border-b border-[#e8e2ff] bg-[#faf9ff]">
        <h3 className="text-sm font-semibold text-[#0a0a0a] tracking-tight">{title}</h3>
        <p className="text-xs text-[#6b6b80] mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Row({ label, description, children }: RowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 px-4 sm:px-6 border-b border-[#e8e2ff] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#0a0a0a]">{label}</p>
        <p className="text-xs text-[#6b6b80] mt-0.5 leading-relaxed">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${checked ? "bg-violet-700" : "bg-gray-200"}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ProfileIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const BellIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const PaletteIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

// ─── Profile Panel ────────────────────────────────────────────────────────────

function ProfilePanel({ onSave }: { onSave: () => void }) {
  const { user, loading, updateUser } = useUser();

  const [draft, setDraft] = useState({
    firstName: user.firstName,
    lastName:  user.lastName,
  });
  const [dirty,   setDirty]   = useState(false);
  const [saving,  setSaving]  = useState(false);

  // Keep draft in sync if context loads after mount
  // (happens on first render before Supabase responds)
  useState(() => {
    setDraft({ firstName: user.firstName, lastName: user.lastName });
  });

  function set(key: keyof typeof draft) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setDraft((p) => ({ ...p, [key]: e.target.value }));
      setDirty(true);
    };
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateUser(draft); // writes to Supabase profiles table
      setDirty(false);
      onSave();
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setDraft({ firstName: user.firstName, lastName: user.lastName });
    setDirty(false);
  }

  const initials = [draft.firstName[0], draft.lastName[0]]
    .filter(Boolean).join("").toUpperCase() || "?";

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#e8e2ff] bg-white p-6 animate-pulse space-y-4">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="h-10 bg-gray-100 rounded" />
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="h-10 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Avatar preview */}
      <Card title="Avatar" description="Your initials are generated from your name.">
        <div className="flex items-center gap-4 px-4 sm:px-6 py-5">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-md">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-[#0a0a0a]">{draft.firstName} {draft.lastName}</p>
            <p className="text-xs text-[#6b6b80] mt-0.5">{user.email}</p>
          </div>
        </div>
      </Card>

      {/* Editable name fields */}
      <Card
        title="Personal Information"
        description="Update your first and last name. This is shown on your profile."
      >
        <Row label="First Name" description="Your given name">
          <input
            className={INPUT}
            value={draft.firstName}
            onChange={set("firstName")}
            placeholder="Enter your first name"
          />
        </Row>

        <Row label="Last Name" description="Your family name">
          <input
            className={INPUT}
            value={draft.lastName}
            onChange={set("lastName")}
            placeholder="Enter your last name"
          />
        </Row>

        {/* Email — always read-only, comes from Supabase auth */}
        <Row
          label="Email Address"
          description="Tied to your account — cannot be changed"
        >
          <div className="space-y-1">
            <input
              className={INPUT_DISABLED}
              value={user.email}
              disabled
              readOnly
              tabIndex={-1}
            />
            <p className="text-xs text-[#6b6b80]">Email cannot be changed</p>
          </div>
        </Row>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-[#faf9ff] border-t border-[#e8e2ff]">
          <p className="text-xs text-[#6b6b80]">
            {dirty ? "You have unsaved changes." : "Your profile is up to date."}
          </p>
          <div className="flex items-center gap-2">
            {dirty && (
              <button onClick={handleDiscard} className={GHOST}>
                Discard
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!dirty || saving}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
                dirty && !saving
                  ? "bg-violet-700 hover:bg-violet-800 text-white cursor-pointer shadow-sm"
                  : "bg-violet-100 text-violet-300 cursor-not-allowed"
              }`}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Notifications Panel ──────────────────────────────────────────────────────

function NotificationsPanel() {
  const [prefs, setPrefs] = useState({
    email: true, push: false, sms: false,
    weeklyDigest: true, productUpdates: true, securityAlerts: true,
  });
  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-4">
      <Card title="Delivery Channels" description="Choose how you receive notifications.">
        <Row label="Email Notifications" description="Receive updates directly to your inbox">
          <Toggle checked={prefs.email} onChange={() => toggle("email")} />
        </Row>
        <Row label="Push Notifications" description="Browser and mobile push alerts">
          <Toggle checked={prefs.push} onChange={() => toggle("push")} />
        </Row>
        <Row label="SMS Notifications" description="Text messages for time-sensitive events">
          <Toggle checked={prefs.sms} onChange={() => toggle("sms")} />
        </Row>
      </Card>
      <Card title="Notification Types" description="Control which events send you an alert.">
        <Row label="Weekly Digest" description="A summary of activity every Monday">
          <Toggle checked={prefs.weeklyDigest} onChange={() => toggle("weeklyDigest")} />
        </Row>
        <Row label="Product Updates" description="New features and announcements">
          <Toggle checked={prefs.productUpdates} onChange={() => toggle("productUpdates")} />
        </Row>
        <Row label="Security Alerts" description="Sign-ins from unrecognised devices">
          <Toggle checked={prefs.securityAlerts} onChange={() => toggle("securityAlerts")} />
        </Row>
      </Card>
    </div>
  );
}

// ─── Security Panel ───────────────────────────────────────────────────────────

function SecurityPanel({ onAction }: { onAction: (msg: string) => void }) {
  const [twoFactor,   setTwoFactor]   = useState(true);
  const [activityLog, setActivityLog] = useState(false);

  return (
    <div className="space-y-4">
      <Card title="Authentication" description="Control how you sign in to your account.">
        <Row label="Two-Factor Authentication" description="Require a verification code on every sign-in">
          <Toggle checked={twoFactor} onChange={() => { setTwoFactor((v) => !v); onAction("2FA updated"); }} />
        </Row>
        <Row label="Change Password" description="Update your account password">
          <button className={GHOST} onClick={() => onAction("Password reset email sent")}>Update</button>
        </Row>
        <Row label="Passkeys" description="Sign in securely without a password">
          <button className={GHOST} onClick={() => onAction("Passkey setup launched")}>Set up</button>
        </Row>
      </Card>
      <Card title="Sessions" description="Manage where you are currently signed in.">
        <Row label="Activity Log" description="Track sign-ins and changes to your account">
          <Toggle checked={activityLog} onChange={() => setActivityLog((v) => !v)} />
        </Row>
        <Row label="Active Sessions" description="Currently signed in on 2 devices">
          <button className={GHOST} onClick={() => onAction("All other sessions revoked")}>Revoke all</button>
        </Row>
      </Card>
      <Card title="Danger Zone" description="These actions are permanent and cannot be undone.">
        <Row label="Delete Account" description="Remove your account and all associated data">
          <button
            onClick={() => onAction("Deletion requires email confirmation")}
            className="rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors cursor-pointer"
          >
            Delete account
          </button>
        </Row>
      </Card>
    </div>
  );
}

// ─── Appearance Panel ─────────────────────────────────────────────────────────

function AppearancePanel() {
  const [theme,      setTheme]      = useState<"light" | "dark" | "system">("light");
  const [accent,     setAccent]     = useState("violet");
  const [compact,    setCompact]    = useState(false);
  const [animations, setAnimations] = useState(true);
  const [language,   setLanguage]   = useState("en");

  const themes  = ["light", "dark", "system"] as const;
  const accents = [
    { id: "violet",  color: "bg-violet-600" },
    { id: "sky",     color: "bg-sky-500"    },
    { id: "emerald", color: "bg-emerald-500"},
    { id: "rose",    color: "bg-rose-500"   },
    { id: "amber",   color: "bg-amber-500"  },
  ];

  return (
    <div className="space-y-4">
      <Card title="Theme" description="Control the visual style of the interface.">
        <Row label="Color Scheme" description="Switch between light, dark, or system default">
          <div className="flex flex-wrap gap-1.5">
            {themes.map((t) => (
              <button key={t} onClick={() => setTheme(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors border cursor-pointer ${theme === t ? "bg-violet-700 border-violet-700 text-white shadow-sm" : "bg-white border-[#e8e2ff] text-[#6b6b80] hover:border-violet-300 hover:text-[#0a0a0a]"}`}>
                {t}
              </button>
            ))}
          </div>
        </Row>
        <Row label="Accent Color" description="Primary highlight colour across the UI">
          <div className="flex items-center gap-2">
            {accents.map((a) => (
              <button key={a.id} onClick={() => setAccent(a.id)} title={a.id}
                className={`h-6 w-6 rounded-full ${a.color} transition-transform ring-offset-2 ring-offset-white cursor-pointer ${accent === a.id ? "ring-2 ring-[#0a0a0a] scale-110" : "hover:scale-105"}`} />
            ))}
          </div>
        </Row>
      </Card>
      <Card title="Layout & Motion" description="Adjust density and animation preferences.">
        <Row label="Compact Mode" description="Reduce spacing and padding throughout the UI">
          <Toggle checked={compact} onChange={() => setCompact((v) => !v)} />
        </Row>
        <Row label="Animations" description="Enable transitions and motion effects">
          <Toggle checked={animations} onChange={() => setAnimations((v) => !v)} />
        </Row>
        <Row label="Language" description="Display language for the entire interface">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}
            className="rounded-lg bg-white border border-[#e8e2ff] px-3 py-2 text-sm text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow appearance-none cursor-pointer">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="ja">日本語</option>
          </select>
        </Row>
      </Card>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [section, setSection] = useState<Section>("profile");
  const [toast,   setToast]   = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const navItems: NavItem[] = [
    { id: "profile",       label: "Profile",       icon: <ProfileIcon /> },
    { id: "notifications", label: "Notifications", icon: <BellIcon /> },
    { id: "security",      label: "Security",      icon: <ShieldIcon /> },
    { id: "appearance",    label: "Appearance",    icon: <PaletteIcon /> },
  ];

  const titles: Record<Section, string> = {
    profile: "Profile", notifications: "Notifications",
    security: "Security", appearance: "Appearance",
  };

  return (
    <main className="min-h-screen bg-white text-[#0a0a0a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Syne:wght@700;800&display=swap');`}</style>

      {/* ── Header ── */}
      <div className="border-b border-[#e8e2ff] bg-[#faf9ff] px-4 sm:px-8 py-5 sm:py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0a0a0a]">
              Settings
            </h1>
            <p className="mt-0.5 text-sm text-[#6b6b80]">Manage your account and preferences.</p>
          </div>
          <Link href="/profile" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[#6b6b80] hover:text-[#0a0a0a] transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            View Profile
          </Link>
        </div>
      </div>

      {/* ── Mobile tab bar ── */}
      <div className="md:hidden border-b border-[#e8e2ff] bg-white overflow-x-auto">
        <div className="flex min-w-max px-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${section === item.id ? "border-violet-700 text-violet-700" : "border-transparent text-[#6b6b80] hover:text-[#0a0a0a]"}`}>
              <span className={section === item.id ? "text-violet-600" : ""}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex gap-8 items-start">

          {/* Desktop sidebar */}
          <nav className="hidden md:block w-52 shrink-0 sticky top-6">
            <ul className="space-y-0.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button onClick={() => setSection(item.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium border transition-all cursor-pointer ${section === item.id ? "bg-violet-50 text-violet-700 border-violet-200 shadow-sm" : "border-transparent text-[#6b6b80] hover:text-[#0a0a0a] hover:bg-[#faf9ff]"}`}>
                    <span className={section === item.id ? "text-violet-600" : "text-[#9ca3af]"}>{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h2 style={{ fontFamily: "'Syne', sans-serif" }} className="hidden md:block text-lg font-bold text-[#0a0a0a] mb-5">
              {titles[section]}
            </h2>
            <div key={section}>
              {section === "profile"       && <ProfilePanel       onSave={() => showToast("Profile saved!")} />}
              {section === "notifications" && <NotificationsPanel />}
              {section === "security"      && <SecurityPanel      onAction={showToast} />}
              {section === "appearance"    && <AppearancePanel />}
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#e8e2ff] bg-white px-4 py-3 text-sm font-medium text-[#0a0a0a] shadow-xl">
          <span className="h-2 w-2 rounded-full bg-violet-600 shrink-0" />
          {toast}
        </div>
      )}
    </main>
  );
}