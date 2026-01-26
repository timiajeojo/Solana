'use client'
import React, { useState } from 'react'
import { auth } from '../component/lib/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [passowrd, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter()
  
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    }
  };
  
  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    }
  };
  
  return (
    <div clasName="max-w-md w-full mx-auto">
    <div className="bg-white border border-gray-200 rounded-xl p-8">
    <h2 className="text-2xl font-bold text-black mb-6">
    {isSignUp ? 'Create Account': 'Sign In'}
    </h2>
    {error && (
      <div className="bg-red-50 border border-red-200 text-red">
      
    </div>
    
    )
}