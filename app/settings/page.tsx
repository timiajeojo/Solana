'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, Bell, Shield, Lock, ArrowLeft, Save } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    darkMode: false
  })
  
  const handleSave = () => {
    alert('settings saved successfully!')
  }
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <button
    onClick={() router.push('dashboard')}
    className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
    >
    <ArrowLeft className="w-5 h-5" />
    Back to dashboard
    </button>
    
    
    <div className="flex items-center gap-3 mb-8">
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
    <Settings className="w-6 h-6 text-white" />
    </div>
    <div>
    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
    <p className="text-gray-600">Manage your account prefrence</p>
    </div>
    </div>
    
    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
    {/* Notifications Section */}
    <div className="border-b border-gray-200 pb-6">
    <div className="flex items-center gap-2 mb-4">
    <Bell className="w-5 h-5 text-purple-600" />
    <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
    </div>
    <div className="space-y-4">
    <div className="flex items-center justify-between">
    <div>
    <p className="font-medium text-gray-900">Email Notifications</p>
    <p className="text-sm text-gray-600">Receive updates via email</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
    <input
    type="checkbox"
    checked={settings.emailNotifications}
    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
    className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
     </label>
     </div>
     
     <button className="w-full mt-4 px-6 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center gap-2">
     <Lock className="w-5 h-5" />
     Change Password
     </button>
     </div>
     </div>
     
     <button
     onClick={handleSave}
     className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-colors flex items-center justify-center gap-2"
     >
     <Save className="w-5 h-5" />
     Save settings
     </button>
     </div>
     </div>
     </div>
)
}