'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '../component/lib/supabase';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const result = await signUpWithEmail(email, password);
        console.log('Sign up successful:', result);
        alert('Check your email for verification link!');
      } else {
        const result = await signInWithEmail(email, password);
        console.log('Sign in successful:', result);
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      // Redirect happens automatically
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err.message || 'Google sign-in failed');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-black mb-6">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full border border-gray-300 text-black py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Continue with Google'}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            disabled={loading}
            className="text-purple-600 hover:text-purple-700 text-sm disabled:text-purple-400"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}