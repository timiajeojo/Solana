'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { layoutDashboard, History, TrendingUp, LogOut } from 'lucide-react';
import { signOut } from '../app/component/lib/supabase';

export default function Navigation() {
  const pathname = userPathname();
  const router = useRouter();
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/history', label: 'History', icon: History }
    ];
    const handleLogout = async () => {
      try {
        await signOut()
        router.push('/auth')
      } catch (err) {
        console.error('Logout Error:', error);
        
      }
    };
    
    return (
      <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-between h-16">
      <div className="flex items-center gap-8">
      <link href="/dashboard" className="flex items-center gap-2">
      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
      <TrendingUp className="w-6 h-6 text-white" />
      </div>
      <span className=""
      )
}