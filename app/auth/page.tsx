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
}

const  handleSubmit = async () => {
  setError('')
  setLoading(true)
//validation
if (!email || !password) {
  setError('Please fill all required field')
  setLoading(false)
  return
}

if (!isSignIn && password.length < 6 ) {
  setError('Password must be around 6 characters')
  setLoading(false)
  return
}

try {
  if (!isSignIn) {
    //signIn 
    const result = await signInWithEmail(email, password);
    console.log('successful:', result)
    router.push('/dashboard')
  } else {
    //signup 
    const result = await signUpWithEmail(email, password, firstName, lastName);
    console.log('successful:', result)
    alert('Success! check your email to verify yoir account before signing in')
    //switch to signin tab
    setIsSignIn(true)
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setFirstName('')
    setLastName('')
  }
} catch (err) {
  console.error('Auth error:', err);
  setError(err.message || 'Authentication failed, please try again.')
} } finally {
  setLoading(false)
}
};

const handleWalletSignIn = () => {
  console.log('Wallet sign in not implemented yet')
  setError('Wallet sign in coming soon')
};

const handleGoogleSignIn = async () => {
  setError('')
  setLoading(true)
};