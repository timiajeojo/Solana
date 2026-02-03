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
  
}