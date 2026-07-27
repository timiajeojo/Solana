'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SolanaLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">

      {/* ── Navigation ── */}
      <nav className="px-6 py-4 max-w-7xl mx-auto relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
              <div className="w-6 h-1 bg-white rounded-full" />
            </div>
            <span className="text-xl font-bold text-gray-900">Solana Coins</span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home"     className="text-gray-700 hover:text-purple-600 transition">Home</a>
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition">Features</a>
            <a href="#support"  className="text-gray-700 hover:text-purple-600 transition">Support</a>
            <Link href="/auth">
              <button className="bg-purple-600 text-white px-6 py-2.5 rounded-full hover:bg-purple-700 transition font-semibold text-sm">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-6 bg-white rounded-2xl shadow-xl overflow-hidden z-50">
            <div className="py-2">
              <a href="#home"     onClick={() => setIsMenuOpen(false)} className="block px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition">Home</a>
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="block px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition">Features</a>
              <a href="#support"  onClick={() => setIsMenuOpen(false)} className="block px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition">Support</a>
              <div className="px-6 py-3">
                <Link href="/auth">
                  <button onClick={() => setIsMenuOpen(false)} className="w-full bg-purple-600 text-white px-6 py-2.5 rounded-full hover:bg-purple-700 transition font-semibold text-sm">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section id="home" className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Earn Solana Through Sharing,{' '}
            <span className="text-purple-600">Trading</span> &{' '}
            <span className="text-purple-600">Lending</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Share, trade, and lend your Solana tokens in a secure and decentralized way,
            connecting with a global community of traders.
          </p>

          {/* CTA buttons — equal size */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/auth" className="flex-1 sm:flex-none">
              <button className="w-full sm:w-auto bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition font-semibold text-base">
                Get Started
              </button>
            </Link>
            <button className="flex-1 sm:flex-none w-full sm:w-auto bg-white text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50 transition font-semibold text-base border border-gray-300">
              Learn More
            </button>
          </div>

          {/* Partner logos */}
          <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm">

            {/* Solana */}
            <span className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="sol-a" x1="90.737%" x2="35.509%" y1="35.052%" y2="86.771%">
                    <stop offset="0%" stopColor="#9945FF"/>
                    <stop offset="100%" stopColor="#14F195"/>
                  </linearGradient>
                </defs>
                <path fill="url(#sol-a)" d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zm0-164c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zM333.1 3.8c-2.4-2.4-5.7-3.8-9.2-3.8H6.5C.7 0-2.2 7 1.9 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1L333.1 3.8z"/>
              </svg>
              Solana
            </span>

            {/* CoinGecko */}
            <span className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#8DC63F"/>
                <circle cx="16" cy="16" r="12" fill="#F9F9F9"/>
                <circle cx="12" cy="13" r="2.5" fill="#8DC63F"/>
                <circle cx="20" cy="13" r="2.5" fill="#8DC63F"/>
                <path d="M10 19 Q16 24 22 19" stroke="#8DC63F" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <circle cx="12" cy="13" r="1" fill="#333"/>
                <circle cx="20" cy="13" r="1" fill="#333"/>
              </svg>
              CoinGecko
            </span>

            {/* FTX */}
            <span className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="6" fill="#02A8A8"/>
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif">FTX</text>
              </svg>
              FTX
            </span>

            {/* Phantom */}
            <span className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                <rect width="128" height="128" rx="24" fill="#AB9FF2"/>
                <path fill="white" d="M110.584 64.002c0 25.993-21.09 47.083-47.083 47.083-25.993 0-47.084-21.09-47.084-47.083 0-25.993 21.091-47.084 47.084-47.084 25.993 0 47.083 21.091 47.083 47.084z"/>
                <path fill="#AB9FF2" d="M63.501 35.918c-15.516 0-28.084 12.568-28.084 28.084 0 15.515 12.568 28.083 28.084 28.083 15.515 0 28.083-12.568 28.083-28.083 0-15.516-12.568-28.084-28.083-28.084zm0 10c9.983 0 18.083 8.1 18.083 18.084 0 9.983-8.1 18.083-18.083 18.083-9.984 0-18.084-8.1-18.084-18.083 0-9.984 8.1-18.084 18.084-18.084z"/>
              </svg>
              Phantom
            </span>

          </div>
        </div>

        {/* Hero graphic */}
        <div className="relative">
          <div className="w-full aspect-square bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-3xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-transparent opacity-30" />
            <div className="w-48 h-48 md:w-64 md:h-64 bg-purple-700 rounded-full flex items-center justify-center relative z-10 border-8 border-purple-400/30">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-300 to-purple-500 rounded-lg transform rotate-12" />
            </div>
            <div className="absolute top-20 left-10 w-16 h-16 bg-purple-300 rounded-full opacity-60" />
            <div className="absolute bottom-20 right-10 w-20 h-20 bg-purple-400 rounded-full opacity-50" />
            <div className="absolute top-40 right-20 w-12 h-12 bg-white/20 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg">Start sharing and trading Solana in just a few easy steps.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                <line x1="12" y1="9" x2="12" y2="15" strokeWidth="2"/>
                <line x1="9" y1="12" x2="15" y2="12" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Create an Account</h3>
            <p className="text-gray-600">Sign up and set up your wallet to start using Solana Coins.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2"/>
                <circle cx="12" cy="10" r="3" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Connect Your Wallet</h3>
            <p className="text-gray-600">Securely link your Solana wallet to our platform.</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Start Sharing & Earning</h3>
            <p className="text-gray-600">Trade, share, or lend your SOL to earn rewards and interest.</p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="support" className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-10 left-10 w-24 h-24 bg-purple-400/30 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Earning Solana Today</h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Join the Solana Coins community and start trading and sharing your SOL now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <button className="w-full sm:w-auto bg-white text-purple-600 px-8 py-3 rounded-full hover:bg-gray-50 transition font-semibold text-base">
                  Get Started
                </button>
              </Link>
              <button className="w-full sm:w-auto bg-purple-500 text-white px-8 py-3 rounded-full hover:bg-purple-600 transition font-semibold text-base border-2 border-purple-400">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
