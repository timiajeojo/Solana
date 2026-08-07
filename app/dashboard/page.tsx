'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp, Wallet, ArrowUpRight, ArrowDownRight,
  ArrowDownToLine, Plus, User, Settings, History, LogOut, CreditCard,
} from 'lucide-react';
import {
  getCurrentUser, getInvestments, getDeposits, getUserProfile, signOut,
} from '../component/lib/supabase';
import { useBalance } from '@/app/context/BalanceContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Investment {
  id?:           number;
  amount:        number;
  sol_price:     number;
  sol_amount:    number;
  purchase_date: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { setBalance } = useBalance();

  const [user,           setUser]           = useState<any>(null);
  const [userProfile,    setUserProfile]    = useState<any>(null);
  const [loading,        setLoading]        = useState(true);
  const [investments,    setInvestments]    = useState<Investment[]>([]);
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [totalProfit,    setTotalProfit]    = useState(0);
  const [activePlan,     setActivePlan]     = useState<any>(null);
  const [showDropdown,   setShowDropdown]   = useState(false);
  const [solPrice,       setSolPrice]       = useState(102.30);
  const [priceLoading,   setPriceLoading]   = useState(true);

  useEffect(() => {
    checkUser();
    fetchSolPrice();
    const interval = setInterval(fetchSolPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchSolPrice = async () => {
    try {
      const res  = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await res.json();
      if (data?.solana?.usd) setSolPrice(data.solana.usd);
    } catch { /* keep last price */ }
    finally { setPriceLoading(false); }
  };

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) { router.push('/auth'); return; }
      setUser(currentUser);

      const profile = await getUserProfile(currentUser.id);
      setUserProfile(profile);

      await Promise.all([
        loadInvestments(currentUser.id),
        loadDeposits(currentUser.id),
        loadProfits(currentUser.id),
        loadActivePlan(currentUser.id),
      ]);
    } catch (error) {
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const loadInvestments = async (userId: string) => {
    try {
      const data       = await getInvestments(userId);
      const inv        = data || [];
      setInvestments(inv);
      const solCoins   = inv.reduce((s: number, i: Investment) => s + i.sol_amount, 0);
      const invested   = inv.reduce((s: number, i: Investment) => s + i.amount, 0);
      setBalance({ currentValue: solCoins * solPrice, totalSolCoins: solCoins, totalInvested: invested });
    } catch { /* silent */ }
  };

  const loadDeposits = async (userId: string) => {
    try {
      const deposits = await getDeposits(userId);
      const total    = (deposits || [])
        .filter((d: any) => d.status === 'completed')
        .reduce((s: number, d: any) => s + d.amount, 0);
      setTotalDeposited(total);
    } catch { /* silent */ }
  };

  const loadProfits = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profits')
        .select('amount')
        .eq('user_id', userId);
      if (error) throw error;
      const total = (data || []).reduce((s: number, p: any) => s + p.amount, 0);
      setTotalProfit(total);
    } catch { /* silent */ }
  };

  const loadActivePlan = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();
      setActivePlan(data || null);
    } catch { /* no plan */ }
  };

  const handleLogout = async () => {
    try { await signOut(); router.push('/auth'); } catch { /* silent */ }
  };

  const getInitials = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name[0]}${userProfile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  // ── Calculations ──────────────────────────────────────────────────────────
  const totalInvested  = investments.reduce((s, i) => s + i.amount, 0);
  const totalSolCoins  = investments.reduce((s, i) => s + i.sol_amount, 0);
  const currentPortfolioValue = totalSolCoins * solPrice;
  const avgBuyPrice    = totalSolCoins > 0 ? totalInvested / totalSolCoins : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">

      {/* ── Header ── */}
<div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">

      {/* Left — Avatar */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold text-base shadow-md">
          {getInitials()}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : user?.email}
          </p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Right — Burger menu */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex flex-col justify-center items-center w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors gap-1.5"
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-gray-700 rounded transition-all duration-200 ${showDropdown ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 rounded transition-all duration-200 ${showDropdown ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 rounded transition-all duration-200 ${showDropdown ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'User'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              {[
                { label: 'Profile',  icon: <User className="w-5 h-5 text-purple-600" />,           path: '/profile'  },
                { label: 'Deposit',  icon: <ArrowDownToLine className="w-5 h-5 text-purple-600" />, path: '/deposit'  },
                { label: 'Withdraw', icon: <CreditCard className="w-5 h-5 text-purple-600" />,      path: '/wallets'  },
                { label: 'History',  icon: <History className="w-5 h-5 text-purple-600" />,         path: '/history'  },
                { label: 'Settings', icon: <Settings className="w-5 h-5 text-purple-600" />,        path: '/settings' },
              ].map(({ label, icon, path }) => (
                <button
                  key={label}
                  onClick={() => { setShowDropdown(false); router.push(path); }}
                  className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 text-gray-700"
                >
                  {icon}
                  <span className="font-medium">{label}</span>
                </button>
              ))}

              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={() => { setShowDropdown(false); handleLogout(); }}
                  className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  </div>
</div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {userProfile?.first_name || 'User'}! 👋
          </h2>
          <p className="text-gray-600 mt-1">Here's your Solana investment overview</p>
        </div>

        {/* Active plan banner */}
        {activePlan && (
          <div className="mb-6 bg-purple-600 text-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-sm text-purple-200 font-medium">Active Plan</p>
              <p className="text-xl font-bold">{activePlan.plan_name}</p>
              <p className="text-sm text-purple-200 mt-0.5">
                Earns <strong>${activePlan.daily_return}/day</strong> · Ends {new Date(activePlan.end_date).toLocaleDateString()}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-300" />
          </div>
        )}

        {/* Add Investment
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => router.push('/plans')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            {activePlan ? 'Change Plan' : 'Add Investment'}
          </button>
        </div>
         */}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Available Balance (confirmed deposits) */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <ArrowDownToLine className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Available Balance</p>
                <p className="text-2xl font-bold text-gray-900">${totalDeposited.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Total Invested */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Invested</p>
                <p className="text-2xl font-bold text-gray-900">${totalInvested.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* SOL Market Price */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">SOL Market Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  {priceLoading ? '…' : `$${solPrice.toFixed(2)}`}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Live · updates every 60s</p>
          </div>

          {/* Total Profit — from profits table */}
          <div className={`rounded-2xl p-6 shadow-lg border ${
            totalProfit > 0 ? 'bg-green-50 border-green-200' : 'bg-white border-purple-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                totalProfit > 0 ? 'bg-green-100' : 'bg-purple-100'
              }`}>
                {totalProfit > 0
                  ? <ArrowUpRight className="w-6 h-6 text-green-600" />
                  : <ArrowDownRight className="w-6 h-6 text-purple-600" />}
              </div>
              <div>
                <p className={`text-sm font-medium ${totalProfit > 0 ? 'text-green-700' : 'text-gray-600'}`}>
                  Total Profit
                </p>
                <p className={`text-2xl font-bold ${totalProfit > 0 ? 'text-green-700' : 'text-gray-900'}`}>
                  ${totalProfit.toFixed(2)}
                </p>
              </div>
            </div>
            {activePlan && (
              <p className="text-xs text-green-600 mt-3 font-medium">
                +${activePlan.daily_return}/day from {activePlan.plan_name}
              </p>
            )}
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-black mb-6">Portfolio Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total SOL Coins</p>
              <p className="text-3xl font-bold text-purple-600">{totalSolCoins.toFixed(4)}</p>
              <p className="text-xs text-gray-400 mt-1">≈ ${currentPortfolioValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Avg. Buy Price</p>
              <p className="text-3xl font-bold text-black">${avgBuyPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Current Price</p>
              <p className="text-3xl font-bold text-black">
                {priceLoading ? '…' : `$${solPrice.toFixed(2)}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Investments</p>
              <p className="text-3xl font-bold text-purple-600">{investments.length}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
