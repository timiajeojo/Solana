"use client";

import { useState, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = "profile" | "notifications" | "security" | "appearance";

interface SectionItem {
  id: Section;
  label: string;
  icon: ReactNode;
}

interface RowProps {
  label: string;
  description: string;
  children: ReactNode;
}

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

interface CardProps {
  title: string;
  description: string;
  children: ReactNode;
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const ghostBtn =
  "rounded-lg border border-[#e8e2ff] bg-white hover:bg-[#faf9ff] hover:border-violet-300 px-3 py-1.5 text-xs font-semibold text-[#0a0a0a] transition cursor-pointer";

const inputCls =
  "w-full sm:w-52 rounded-lg bg-white border border-[#e8e2ff] px-3 py-2 text-sm text-[#0a0a0a] placeholder:text-[#6b6b80] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition";

// ─── Sub-components ───────────────────────────────────────────────────────────

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
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Row({ label, description, children }: RowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 px-4 sm:px-6 border-b border-[#e8e2ff] last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#0a0a0a]">{label}</p>
        <p className="text-xs text-[#6b6b80] mt-0.5 leading-relaxed">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Card({ title, description, children }: CardProps) {
  return (
    <div className="rounded-2xl border border-[#e8e2ff] bg-white overflow-hidden shadow-sm">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#e8e2ff] bg-[#faf9ff]">
        <h2 className="text-sm font-semibold text-[#0a0a0a] tracking-tight">{title}</h2>
        <p className="text-xs text-[#6b6b80] mt-1">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}


function ProfileIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M-20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
    )
}

function BellIcon() {
return (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
  )  
}
function ShildIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
    )
}
function PaletteIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

{/* section panels */}

function ProfilePanel({ onSave }: { onSave: () => void }) {
  return (
    <div className="space-y-4">
      <Card title="Personal Information" description="Update your name, email, and public profile.">
        <Row label="Full Name" description="Your display name across the platform">
          <input className={inputCls} defaultValue="Alex Johnson" />
        </Row>
        <Row label="Email Address" description="Used for login and notifications">
          <input className={inputCls} defaultValue="alex@example.com" />
        </Row>
        <Row label="Username" description="Your unique @handle">
          <input className={inputCls} defaultValue="@alexj" />
        </Row>
        <Row label="Bio" description="A short description about yourself">
          <textarea rows={2} className={`${inputCls} resize-none`} defaultValue="Product designer & developer." />
        </Row>
        <div className="flex justify-end px-4 sm:px-6 py-4 bg-[#faf9ff] border-t border-[#e8e2ff]">
          <button
            onClick={onSave}
            className="rounded-lg bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold px-5 py-2 transition shadow-sm cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </Card>

      <Card title="Avatar" description="Upload a photo for your profile.">
        <div className="flex items-center gap-5 px-4 sm:px-6 py-5">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-md">
            AJ
          </div>
          <div className="space-y-2">
            <button className={ghostBtn}>Upload photo</button>
            <p className="text-xs text-[#6b6b80]">JPG, PNG or GIF · max 2 MB</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function NotificationPanel() {
  const [prefs, setPrefs] = useState({
    email: true, push: false, sms: false,
    weeklyDigest: true, priductUpdates: true, securityAlerts: true,
  });
  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));
  
  return (
    <div className="space-y-4">
      <Card title="Delivery Channels" description="Choose how you receive notifications.">
        <Row label="Email Notifications" description="Receive updates to your inbox">
          <Toggle checked={prefs.email} onChange={() => toggle("email")} />
        </Row>
        <Row label="Push Notifications" description="Browser and mobile push alerts">
        <Toggle checked={prefs.push} onChange={() => toggle("push")} />
        </Row>
        <Row label="SMS Notifications" description="Text messages for important events">
        <Toggle checked={prefs.sms} onChange={() => toggle("sms")} />
        </Row>
        </Card>
        
        <Card title="Notification Types" description="Fine-tune which events trigger alerts.">
        <Row label="Weekly Digest" description="A summary of your week every monday">
        <Toggle checked={prefs.weeklyDigest} onChange={() => toggle("weeklyDigest")} />
        </Row>
        <Row label="Product Updates" description="New features and announcements">
        <Toggle checked={prefs.productUpdates} onChange={() => toggle("productUpdates")} />
        </Row>
        <Row label="security Alerts" description="Sign-ins from new devices or locations">
        <Toggle checked={prefs.securityAlerts} onChange={() => toggle("security Alerts")} />
        </Row>
        </Card>
        </div>
    )
}

function SecurityPanel({ onAction }: { onAction: (msg: string) => void }) {
  const [twoFactor, setTwoFactor] = useState(true);
  const [activityLog, setActivityLog] = useState(false);
  
  return (
    <div className="space-y-4">
    <Card title="Authentication" description="Strengthen your account access.">
    <Row label="Two-Factor Authentication" description=""
    )
}