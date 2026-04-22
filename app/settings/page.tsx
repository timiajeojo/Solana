"usse client"

import { useState, ReactNode} from "react"

type section = "profile" | "notifications" | "security" | "appearance"

interface SectionItem {
  id: Section,
  label: string,
  icon: ReactNode
}

interface RowProps {
  label: string,
  description: string,
  icon: ReactNode
}

interface ToggleProps {
  checked: boolean,
  onChange: () => void
}

interface CardProps {
  title: string,
  description: string,
  children: ReactNode
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
    <span
    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
        />
        </button>
            
    )
}

function Row({ label, description, children }: RowProps) {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-[#e8e2ff] last:border-0">
      <div className="pr-6">
        <p className="text-sm font-medium text-[#0a0a0a]">{label}</p>
        <p className="text-xs text-[#6b6b80] mt-0.5 leading-relaxed">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
