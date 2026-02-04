'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '.../componenet/lib/supabase'

export default function AuthPage() {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    
    //validation
    if (!email || !password) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }
    
    if (!isSignIn &&(!firstName || !lastName)) {
      setError('Please enter your first and last name')
      setLoading(false)
      return
    }
    
    if (!isSignIn && password !== confirmPassword) {
      setError('Password do not match')
      setLoading(false)
      return
    }
    
    if (!isSignIn && password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }
    
    try {
      if (isSignIn) {
        // Sign In
        const result = await signInWithEmail(email, password);
        console.log('Sign in successful:', result)
        router.push('/dashboard')
      } else {
        //Sign Up
        const result = await signUpWithEmail(email, password, firstName, lastName);
        console.log('Sign up successful:', result)
        alert('success! check your email to verify ypur account before signing in')
        // Switch to sigin tab
        setIsSignIn(true)
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setFirstName('')
        setLastName('')
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed please try again')
    } } finally {
      setLoading(false)
    }
  };
  
  const handleWalletSignIn = () => {
    console.log('Wallet signin not implemented yet')
    setError('Wallet signin coming soon')
  };
  
  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    
    try {
      await signInWithGoogle
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err.message || 'Google signin failed')
      setLoading(false)
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
    {/*Navigation */}
    <nav className="px-6 py-4 max-w-7xl mx-auto relative">
    <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
    <div className="w-6 h-1 bg-white rounded-full">
    </div>
    <span className="text-xl font-bold text-gray-900">Solana Coins</span>
    </div>
    
    <div className="hidden md:flex items-center gap-8">
    <a href="/" className="text-gray-700 hover:text-purple-600 transition">Home</a>
    <a href="#features" className="text-gray-700 hover:text-purple-600 transition">Features</a>
    <a href="#support" className="text-gray-700 hover:text-purple-600 transition">Support</a>
    <button
    onClick={() => router.push(/dashboard)}
    className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition font-mediuml"
    >
    Get Started
    </button>
    </div>
    
    <button
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    className="md:hidden p-2 text-gray-700 hover:text-purple-600 transition"
    >
     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-6 bg-white rounded-2xl shadow-xl overflow-hidden z-50">
          <div className="py-2">
          <a href="/" onClick={() => setIsMenuOpen(false)} className="block px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition">
          Home
          </a>
          <a href="#features" onClick={() => setIsMenuOpen(false)} className="block px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition">
          Features
          </a>
          <a href="#support" onClick={() => setIsMenuOpen(false)} className="block px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition">
          Support
          </a>
          </div>
          </div>
          )}
          </nav>
          
          {/* Auth Form*/}
          <div className="max-w-md mx-auto px-6 py-8 md:py-12">
          <div className="bg-white rounded-3xl shadow-2xl px-8 md:p-12">
          <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
          <div className="w-7 h-1.5 bg-white rounded-full"></div>
          </div>
          <span className="text-2xl font-bold text-gray-900">Solana Coins</span>
          </div>
          
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
        {isSignIn ? 'Welcome To Solana Coins' : 'Create Your Account'}
        </h1>
        
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
          </div>
          )}
          
          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b border-gray-200">
          <button
          onClick={() => {
            setIsSignIn(true)
            setError('')
          }}
          className={`pb-3 px-2 font-semibold transition relative ${
            isSignIn ? 'text-purple-600' : 'text-gray-400'
          }`}
          disabled={loading}
          >
          Sign In
          {isSignIn && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
            )}
            </button>
            <button
            onClick={() => {
              setIsSignIn(false)
              setError('')
            }}
            className={`pb-3 px-2 font-semibold transition relative ${
              !isSignIn ? 'text-purple-600' : 'text-gray-400'
            }`}
            disabled={loading}
            >
            Sign up
            {!isSignIn && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
              )}
              </button>
              </div>
              
              {/* Sign In Form */}
              {isSignIn && (
                <div className="space-y-6">
                <div>
                <label htmlFor="email" className="block text-gray-900 font-semibold mb-2">
                Email:
                </label>
                <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-purple-50/30 disabled:opacity-50"
                />
                </div>
                
                <div>
                <label htmlFor="password" className="block text-gray-900 font-semibold mb-2">
                Password:
                </label>
                <div className="relative">
                <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-12 bg-purple-50/30 disabled:opacity-50"
                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
                >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 oz" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                </button>
                </div>
                </div>
                
                <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-full hover:bg-purple-700 transition font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {loading ? 'Signing In...' : 'Sign In'}
                </button>
                
                <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-gray-400 text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                
                )}
}