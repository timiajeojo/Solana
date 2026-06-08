// app/profile/page.tsx
"use client";

import Link from "next/link";
import { useUser } from "@/app/context/UserContext";

export default function ProfilePage() {
  const { user, loading } = useUser();

  const initials = [user.firstName[0], user.lastName[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "?";

  return (
    <main
      className="min-h-screen bg-white text-[#0a0a0a]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Syne:wght@700;800&display=swap');`}</style>

      {/* ── Top nav ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#e8e2ff] px-4 sm:px-8 h-14 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6b6b80] hover:text-[#0a0a0a] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Dashboard
        </Link>
        <Link
          href="/settings"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-700 hover:text-violet-800 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit in Settings
        </Link>
      </div>

      {/* ── Heading ── */}
      <div className="px-4 sm:px-8 pt-6 pb-5">
        <h1
          style={{ fontFamily: "'Syne', sans-serif" }}
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0a0a0a]"
        >
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-[#6b6b80]">Manage your personal information</p>
      </div>

      {/* ── Body ── */}
      <div className="bg-[#f5f3ff] min-h-[calc(100vh-160px)] px-4 sm:px-8 pb-16 pt-2">
        <div className="max-w-lg mx-auto">

          {loading ? (
            /* ── Skeleton while fetching ── */
            <div className="rounded-2xl overflow-hidden shadow-md animate-pulse">
              <div className="bg-violet-300 h-52" />
              <div className="bg-white px-5 py-5 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
              </div>
            </div>
          ) : (
            <>
              {/* ── Avatar banner ── */}
              <div className="rounded-2xl overflow-hidden shadow-md">
                <div className="bg-gradient-to-b from-violet-600 to-violet-400 pt-10 pb-5 flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-white shadow-lg flex items-center justify-center">
                      <span className="text-3xl font-bold text-violet-600">{initials}</span>
                    </div>
                    <Link
                      href="/settings"
                      title="Edit in Settings"
                      className="absolute bottom-0.5 right-0.5 h-7 w-7 rounded-full bg-white border border-violet-100 shadow flex items-center justify-center hover:bg-violet-50 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </Link>
                  </div>
                  <div className="text-center">
                    <p
                      style={{ fontFamily: "'Syne', sans-serif" }}
                      className="text-white text-lg font-bold tracking-tight"
                    >
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-violet-200 text-sm mt-0.5">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* ── Read-only fields ── */}
              <div className="mt-6 space-y-4">
                <Field label="First Name"    value={user.firstName} icon="person" />
                <Field label="Last Name"     value={user.lastName}  icon="person" />
                <Field
                  label="Email Address"
                  value={user.email}
                  icon="mail"
                  note="Email cannot be changed"
                  muted
                />
              </div>

              {/* ── CTA ── */}
              <Link
                href="/settings"
                className="mt-8 flex items-center justify-center gap-2 w-full rounded-xl bg-violet-700 hover:bg-violet-800 active:bg-violet-900 text-white text-sm font-semibold py-3.5 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2" />
                </svg>
                Go to Settings
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

// ─── Read-only field ──────────────────────────────────────────────────────────

type IconType = "person" | "mail";

interface FieldProps {
  label: string;
  value: string;
  icon:  IconType;
  note?: string;
  muted?: boolean;
}

function Field({ label, value, icon, note, muted }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0a0a0a] mb-1.5">{label}</label>
      <div className={`flex items-center gap-3 rounded-xl border border-[#e8e2ff] px-4 py-3 bg-white text-sm ${muted ? "text-[#6b6b80]" : "text-[#0a0a0a]"}`}>
        <span className="text-[#6b6b80] shrink-0">
          {icon === "mail" ? <MailIcon /> : <PersonIcon />}
        </span>
        <span className="flex-1 truncate">{value || "—"}</span>
      </div>
      {note && <p className="mt-1.5 text-xs text-[#6b6b80]">{note}</p>}
    </div>
  );
}

function PersonIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
