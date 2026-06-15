"use client";

import { useState, useEffect, ChangeEvent, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/app/component/lib/supabase"; 

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = "profile" | "notifications" | "security";

interface NavItem    { id: Section; label: string; icon: ReactNode }
interface CardProps  { title: string; description: string; children: ReactNode }
interface RowProps   { label: string; description: string; children: ReactNode }
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
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${
        checked ? "bg-violet-700" : "bg-gray-200"
      }`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ${
        checked ? "translate-x-5" : "translate-x-0"
      }`} />
    </button>
  );
}

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-[#e8e2ff]">
        {children}
      </div>
    </div>
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

  const [draft,  setDraft]  = useState({ firstName: user.firstName, lastName: user.lastName });
  const [dirty,  setDirty]  = useState(false);
  const [saving, setSaving] = useState(false);

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
      await updateUser(draft);
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

  const initials = [draft.firstName[0], draft.lastName[0]].filter(Boolean).join("").toUpperCase() || "?";

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

      <Card title="Personal Information" description="Update your first and last name. This is shown on your profile.">
        <Row label="First Name" description="Your given name">
          <input className={INPUT} value={draft.firstName} onChange={set("firstName")} placeholder="Enter your first name" />
        </Row>
        <Row label="Last Name" description="Your family name">
          <input className={INPUT} value={draft.lastName} onChange={set("lastName")} placeholder="Enter your last name" />
        </Row>
        <Row label="Email Address" description="Tied to your account — cannot be changed">
          <input className={INPUT_DISABLED} value={user.email} disabled readOnly tabIndex={-1} />
        </Row>
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-[#faf9ff] border-t border-[#e8e2ff]">
          <p className="text-xs text-[#6b6b80]">
            {dirty ? "You have unsaved changes." : "Your profile is up to date."}
          </p>
          <div className="flex items-center gap-2">
            {dirty && (
              <button onClick={handleDiscard} className={GHOST}>Discard</button>
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
  const router = useRouter();

  // ── Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword,       setNewPassword]       = useState("");
  const [confirmPassword,   setConfirmPassword]   = useState("");
  const [passwordLoading,   setPasswordLoading]   = useState(false);
  const [passwordError,     setPasswordError]     = useState<string | null>(null);
  const [passwordSuccess,   setPasswordSuccess]   = useState(false);

  // ── Sessions
  const [revoking, setRevoking] = useState(false);

  // ── Delete modal
  const [showDeleteModal,   setShowDeleteModal]   = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading,     setDeleteLoading]     = useState(false);
  const [deleteError,       setDeleteError]       = useState<string | null>(null);

  // ── 2FA toggle (UI only)
  const [twoFactor, setTwoFactor] = useState(false);

  // ── Change password ───────────────────────────────────────────────────────

  function openPasswordModal() {
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
    setPasswordSuccess(false);
    setShowPasswordModal(true);
  }

  async function handleChangePassword() {
  setPasswordError(null);
  setPasswordSuccess(false);

  if (newPassword.length < 6) {
    setPasswordError("Password must be at least 6 characters.");
    return;
  }
  if (newPassword !== confirmPassword) {
    setPasswordError("Passwords do not match.");
    return;
  }

  setPasswordLoading(true);
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    
    // Close modal immediately
    setShowPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
    // Fire the toast
    onAction("✓ Password updated successfully!");
  } catch (e: any) {
    setPasswordError(e.message || "Failed to update password.");
  } finally {
    setPasswordLoading(false);
  }
}

  // ── Revoke all sessions ───────────────────────────────────────────────────

  async function handleRevokeAll() {
    setRevoking(true);
    try {
      // Sign out from ALL sessions (global scope)
      const { error } = await supabase.auth.signOut({ scope: "global" });
      if (error) throw error;
      // Redirect to auth after sign-out
      router.push("/auth");
    } catch (e: any) {
      setRevoking(false);
      onAction("Failed to revoke sessions. Please try again.");
    }
  }

  // ── Delete account ────────────────────────────────────────────────────────

  function openDeleteModal() {
    setDeleteConfirmText("");
    setDeleteError(null);
    setShowDeleteModal(true);
  }

  async function handleDeleteAccount() {
    setDeleteError(null);
    if (deleteConfirmText !== "DELETE") {
      setDeleteError('Please type "DELETE" to confirm.');
      return;
    }
    setDeleteLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        // Delete profile row
        await supabase.from("profiles").delete().eq("id", authUser.id);
      }
      // Sign out all sessions then redirect
      await supabase.auth.signOut({ scope: "global" });
      router.push("/auth");
    } catch (e: any) {
      setDeleteError(e.message || "Failed to delete account. Please contact support.");
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-4">

      {/* ── Authentication ── */}
      <Card title="Authentication" description="Control how you sign in to your account.">
        <Row label="Two-Factor Authentication" description="Require a verification code on every sign-in">
          <Toggle
            checked={twoFactor}
            onChange={() => {
              setTwoFactor((v) => !v);
              onAction(twoFactor ? "2FA disabled" : "2FA enabled");
            }}
          />
        </Row>
        <Row label="Change Password" description="Update your account password">
          <button className={GHOST} onClick={openPasswordModal}>
            Update
          </button>
        </Row>
      </Card>

      {/* ── Sessions ── */}
      <Card title="Sessions" description="Manage where you are currently signed in.">
        <Row
          label="Active Sessions"
          description="Signing out will end all sessions on every device including this one"
        >
          <button
            onClick={handleRevokeAll}
            disabled={revoking}
            className="rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 text-xs font-semibold text-orange-600 transition-colors cursor-pointer"
          >
            {revoking ? "Signing out…" : "Revoke all"}
          </button>
        </Row>
      </Card>

      {/* ── Danger Zone ── */}
      <Card title="Danger Zone" description="These actions are permanent and cannot be undone.">
        <Row label="Delete Account" description="Permanently remove your account and all associated data">
          <button
            onClick={openDeleteModal}
            className="rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors cursor-pointer"
          >
            Delete account
          </button>
        </Row>
      </Card>

      {/* ── Change Password Modal ─────────────────────────────────────────── */}
      {showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0a0a0a]">Change Password</h3>
              <p className="text-xs text-[#6b6b80]">Choose a strong new password</p>
            </div>
          </div>

          {passwordSuccess ? (
            <div className="flex flex-col items-center py-4 gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-green-700">Password updated successfully!</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0a0a0a] mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full rounded-lg border border-[#e8e2ff] bg-white px-3 py-2 text-sm text-[#0a0a0a] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0a0a0a] mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your new password"
                    className="w-full rounded-lg border border-[#e8e2ff] bg-white px-3 py-2 text-sm text-[#0a0a0a] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
                  />
                </div>
                {passwordError && (
                  <p className="text-xs text-red-500 font-medium">{passwordError}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 border border-[#e8e2ff] rounded-lg text-sm font-semibold text-[#6b6b80] hover:bg-[#faf9ff] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                  className="flex-1 py-2.5 bg-violet-700 hover:bg-violet-800 disabled:bg-violet-200 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  {passwordLoading ? "Updating…" : "Update Password"}
                </button>
              </div>
            </>
          )}
        </Modal>
      )}

      {/* ── Delete Account Modal ──────────────────────────────────────────── */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0a0a0a]">Delete Account</h3>
              <p className="text-xs text-[#6b6b80]">This cannot be undone</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs text-red-700 leading-relaxed">
              Deleting your account will permanently remove all your data including investments, withdrawals, and profile information.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-[#0a0a0a] mb-1.5">
              Type <span className="text-red-600 font-bold">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-[#0a0a0a] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-shadow"
            />
          </div>

          {deleteError && (
            <p className="text-xs text-red-500 font-medium mb-3">{deleteError}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 py-2.5 border border-[#e8e2ff] rounded-lg text-sm font-semibold text-[#6b6b80] hover:bg-[#faf9ff] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteLoading || deleteConfirmText !== "DELETE"}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-200 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
            >
              {deleteLoading ? "Deleting…" : "Delete Account"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Appearance Panel ─────────────────────────────────────────────────────────


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
            <h1 style={{ fontFamily: "var(--font-syne)" }} className="text-xl sm:text-2xl font-bold tracking-tight text-[#0a0a0a]">
              Settings
            </h1>
            <p className="mt-0.5 text-sm text-[#6b6b80]">Manage your account and preferences.</p>
          </div>
          <Link
            href="/profile"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[#6b6b80] hover:text-[#0a0a0a] transition-colors"
          >
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
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                section === item.id
                  ? "border-violet-700 text-violet-700"
                  : "border-transparent text-[#6b6b80] hover:text-[#0a0a0a]"
              }`}
            >
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
                  <button
                    onClick={() => setSection(item.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium border transition-all cursor-pointer ${
                      section === item.id
                        ? "bg-violet-50 text-violet-700 border-violet-200 shadow-sm"
                        : "border-transparent text-[#6b6b80] hover:text-[#0a0a0a] hover:bg-[#faf9ff]"
                    }`}
                  >
                    <span className={section === item.id ? "text-violet-600" : "text-[#9ca3af]"}>{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h2
              style={{ fontFamily: "var(--font-syne)" }}
              className="hidden md:block text-lg font-bold text-[#0a0a0a] mb-5"
            >
              {titles[section]}
            </h2>
            <div key={section}>
              {section === "profile"       && <ProfilePanel       onSave={() => showToast("Profile saved!")} />}
              {section === "notifications" && <NotificationsPanel />}
              {section === "security"      && <SecurityPanel      onAction={showToast} />}
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
