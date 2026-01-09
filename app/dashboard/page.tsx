'use client'

import React, { useState } from 'react';

export default function Dashboard() {
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
 const user = {
  name: 'John Doe',
  email: 'john@example.com',
  wallet: '7xKX...9mPq',
  balance: '125.50',
  referralCode: 'JOHN2024'
 };
 
 const handleLogout = () => {
  console.log('Logging out...');
  window.location.href = '/';
 };
 
 return (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-purple-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-1 bg-white rounded-full"></div>
                </div>
                <span className="text-xl font-bold text-gray-900">Solana Coins</span>
              </div>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden md:block font-medium text-gray-900">{user.name}</span>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <a href="#profile" className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition">
                      Profile Settings
                    </a>
                    <a href="#wallet" className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition">
                      Wallet
                    </a>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white shadow-lg z-30 transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 lg:block
        `}>
          <div className="p-6 pt-24 lg:pt-6">
            <nav className="space-y-2">
              <a href="#dashboard" className="flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-600 rounded-xl font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </a>
              <a href="#trade" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Trade
              </a>
              <a href="#share" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share & Earn
              </a>
              <a href="#lend" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Lending
              </a>
              <a href="#transactions" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Transactions
              </a>
              <a href="#settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </a>
            </nav>
          </div>
        </aside>

        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          ></div>
        )}

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}! 👋</h1>
              <p className="text-gray-600">Here&apos;s what&apos;s happening with your Solana today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-purple-100">Total Balance</span>
                  <svg className="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-1">{user.balance} SOL</h2>
                <p className="text-purple-100 text-sm">≈ $2,510.00 USD</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Total Earned</span>
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">25.30 SOL</h2>
                <p className="text-green-600 text-sm font-medium">+12.5% this month</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Active Trades</span>
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">8</h2>
                <p className="text-gray-600 text-sm">3 pending orders</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Referrals</span>
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">24</h2>
                <p className="text-gray-600 text-sm">Code: {user.referralCode}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Wallet</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Connected Wallet</p>
                      <p className="font-mono font-semibold text-gray-900">{user.wallet}</p>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition font-semibold">
                      Deposit
                    </button>
                    <button className="flex-1 bg-purple-100 text-purple-600 py-3 rounded-xl hover:bg-purple-200 transition font-semibold">
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Received SOL</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                    <span className="font-bold text-green-600">+5.20 SOL</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Trade Executed</p>
                      <p className="text-sm text-gray-600">5 hours ago</p>
                    </div>
                    <span className="font-bold text-gray-900">12.50 SOL</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Lending Interest</p>
                      <p className="text-sm text-gray-600">1 day ago</p>
                    </div>
                    <span className="font-bold text-green-600">+0.85 SOL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
 );
}