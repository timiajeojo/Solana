'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, TrendingUp, Calendar, DollarSign,
  Check, Loader2, CheckCircle2, AlertCircle, Wallet,
} from 'lucide-react';
import { getCurrentUser } from '../component/lib/supabase';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Plans ────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 1,
    name: 'Starter Plan',
    amount: 100,
    dailyReturn: 6,
    duration: '30 Days',
    totalReturn: 180,
    features: ['6% Daily Returns', 'Minimum Investment', 'Beginner Friendly', '24/7 Support'],
  },
  {
    id: 2,
    name: 'Growth Plan',
    amount: 250,
    dailyReturn: 15,
    duration: '30 Days',
    totalReturn: 450,
    features: ['6% Daily Returns', 'Medium Investment', 'Priority Support', 'Monthly Reports'],
    popular: true,
  },
  {
    id: 3,
    name: 'Pro Plan',
    amount: 500,
    dailyReturn: 30,
    duration: '30 Days',
    totalReturn: 900,
    features: ['6% Daily Returns', 'High Returns', 'Premium Support', 'Weekly Reports'],
  },
  {
    id: 4,
    name: 'Premium Plan',
    amount: 750,
    dailyReturn: 45,
    duration: '30 Days',
    totalReturn: 1350,
    features: ['6% Daily Returns', 'Very High Returns', 'VIP Support', 'Daily Reports'],
  },
  {
    id: 5,
    name: 'Elite Plan',
    amount: 1000,
    dailyReturn: 60,
    duration: '30 Days',
    totalReturn: 1800,
    features: ['6% Daily Returns', 'Maximum Returns', 'Dedicated Manager', 'Real-time Analytics'],
  },
];

// ─── Confirm modal ────────────────────────────────────────────────────────────

interface ConfirmModalProps {
  plan: typeof PLANS[0];
  availableBalance: number;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function ConfirmModal({ plan, availableBalance, onConfirm, onCancel, loading }: ConfirmModalProps) {
  const canAfford = availableBalance >= plan.amount;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Confirm Investment</h3>
        <p className="text-sm text-gray-500 mb-5">
          This will deduct from your available balance
        </p>

        {/* Plan summary */}
        <div className="bg-purple-50 rounded-xl p-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Plan</span>
            <span className="font-semibold text-gray-900">{plan.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Investment</span>
            <span className="font-semibold text-purple-600">${plan.amount}.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Daily profit</span>
            <span className="font-semibold text-green-600">+${plan.dailyReturn}/day</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Duration</span>
            <span className="font-semibold text-gray-900">30 days</span>
          </div>
          <div className="border-t border-purple-200 pt-2 flex justify-between text-sm">
            <span className="text-gray-600">Total return</span>
            <span className="font-bold text-green-600">${plan.totalReturn}.00</span>
          </div>
        </div>

        {/* Balance check */}
        <div className={`rounded-xl px-4 py-3 mb-5 flex items-start gap-2 ${
          canAfford ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {canAfford
            ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            : <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
          <div>
            <p className={`text-xs font-semibold ${canAfford ? 'text-green-700' : 'text-red-700'}`}>
              {canAfford ? 'Sufficient balance' : 'Insufficient balance'}
            </p>
            <p className={`text-xs mt-0.5 ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
              Your available balance: <strong>${availableBalance.toFixed(2)}</strong>
              {!canAfford && ` — you need $${(plan.amount - availableBalance).toFixed(2)} more`}
            </p>
          </div>
        </div>

        {!canAfford && (
          <p className="text-xs text-gray-500 mb-4 text-center">
            Deposit more funds to activate this plan.
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!canAfford || loading}
            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Activating…</>
              : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlansPage() {
  const router = useRouter();

  const [userId,           setUserId]           = useState<string | null>(null);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [activePlanId,     setActivePlanId]     = useState<number | null>(null);
  const [activePlanEnd,    setActivePlanEnd]    = useState<string | null>(null);
  const [loadingBalance,   setLoadingBalance]   = useState(true);

  const [confirmPlan, setConfirmPlan] = useState<typeof PLANS[0] | null>(null);
  const [investing,   setInvesting]   = useState(false);
  const [successId,   setSuccessId]   = useState<number | null>(null);
  const [error,       setError]       = useState<string | null>(null);

  // ── Init ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();
      if (!user) { router.push('/auth'); return; }
      setUserId(user.id);
      await Promise.all([
        loadBalance(user.id),
        loadActivePlan(user.id),
      ]);
    }
    init();
  }, []);

  async function loadBalance(uid: string) {
    setLoadingBalance(true);
    try {
      // Available balance = completed deposits minus amount already invested in active plans
      const { data: deposits } = await supabase
        .from('deposits')
        .select('amount')
        .eq('user_id', uid)
        .eq('status', 'completed');

      const totalDeposited = (deposits || []).reduce((s: number, d: any) => s + d.amount, 0);

      // Subtract amount locked in active plan
      const { data: activePlan } = await supabase
        .from('user_plans')
        .select('amount')
        .eq('user_id', uid)
        .eq('status', 'active')
        .single();

      const locked = activePlan?.amount ?? 0;
      setAvailableBalance(Math.max(0, totalDeposited - locked));
    } catch {
      setAvailableBalance(0);
    } finally {
      setLoadingBalance(false);
    }
  }

  async function loadActivePlan(uid: string) {
    try {
      const { data } = await supabase
        .from('user_plans')
        .select('plan_id, end_date')
        .eq('user_id', uid)
        .eq('status', 'active')
        .single();
      if (data) {
        setActivePlanId(data.plan_id);
        setActivePlanEnd(data.end_date);
      }
    } catch { /* no plan */ }
  }

  // ── Invest ────────────────────────────────────────────────────────────────

  async function handleConfirmInvest() {
    if (!confirmPlan || !userId) return;
    setError(null);
    setInvesting(true);

    try {
      // Cancel any existing active plan
      await supabase
        .from('user_plans')
        .update({ status: 'cancelled' })
        .eq('user_id', userId)
        .eq('status', 'active');

      // Create new plan
      const { error: insertError } = await supabase
        .from('user_plans')
        .insert({
          user_id:      userId,
          plan_id:      confirmPlan.id,
          plan_name:    confirmPlan.name,
          amount:       confirmPlan.amount,
          daily_return: confirmPlan.dailyReturn,
          start_date:   new Date().toISOString(),
          end_date:     new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status:       'active',
        });

      if (insertError) throw insertError;

      setActivePlanId(confirmPlan.id);
      setActivePlanEnd(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
      setSuccessId(confirmPlan.id);
      setConfirmPlan(null);

      // Reload balance (locked amount changes)
      await loadBalance(userId);

      setTimeout(() => setSuccessId(null), 4000);
    } catch (e: any) {
      console.error(e);
      setError('Failed to activate plan. Please try again.');
    } finally {
      setInvesting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Investment Plans</h1>
          <p className="text-gray-600 mt-2">Choose the perfect plan for your investment goals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Balance bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 px-6 py-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Available Balance</p>
              <p className="text-xl font-bold text-gray-900">
                {loadingBalance ? '…' : `$${availableBalance.toFixed(2)}`}
              </p>
            </div>
          </div>
          {activePlanId && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-green-700">
                  Active: {PLANS.find(p => p.id === activePlanId)?.name}
                </p>
                {activePlanEnd && (
                  <p className="text-xs text-green-600">
                    Ends {new Date(activePlanEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}
          {!loadingBalance && availableBalance === 0 && !activePlanId && (
            <button
              onClick={() => router.push('/deposit')}
              className="text-sm font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              Deposit funds to invest →
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLANS.map((plan) => {
            const isActive  = activePlanId === plan.id;
            const isSuccess = successId === plan.id;
            const canAfford = availableBalance >= plan.amount;

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-2xl ${
                  isActive       ? 'border-green-400' :
                  plan.popular   ? 'border-purple-400' :
                  'border-gray-200'
                }`}
              >
                {/* Badge */}
                {isActive ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 whitespace-nowrap">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active Plan
                    </span>
                  </div>
                ) : plan.popular ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                ) : null}

                <div className="p-8">
                  {/* Plan header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <span className="text-4xl font-bold text-purple-600">${plan.amount}</span>
                    <p className="text-gray-500 mt-2">Minimum Investment</p>
                  </div>

                  {/* Daily return */}
                  <div className="bg-purple-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Daily Return</span>
                      </div>
                      <span className="text-xl font-bold text-purple-600">${plan.dailyReturn}</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Duration</span>
                    </div>
                    <span className="font-semibold text-gray-900">{plan.duration}</span>
                  </div>

                  {/* Total return */}
                  <div className="bg-green-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Total Return</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">${plan.totalReturn}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">After 30 days</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                          <Check className="w-3 h-3 text-purple-600" />
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => !isActive && setConfirmPlan(plan)}
                    disabled={isActive}
                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      isActive
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : !canAfford
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {isSuccess ? (
                      <><CheckCircle2 className="w-4 h-4" /> Activated!</>
                    ) : isActive ? (
                      <><CheckCircle2 className="w-4 h-4" /> Current Plan</>
                    ) : !canAfford ? (
                      `Need $${plan.amount - availableBalance > 0 ? (plan.amount - availableBalance).toFixed(0) : 0} more`
                    ) : (
                      'Invest Now'
                    )}
                  </button>

                  {/* Insufficient balance hint */}
                  {!isActive && !canAfford && (
                    <p className="text-xs text-center text-gray-400 mt-2">
                      <button
                        onClick={() => router.push('/deposit')}
                        className="text-purple-500 hover:underline"
                      >
                        Deposit more funds
                      </button>{' '}
                      to unlock this plan
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* How it works */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: 1, title: 'Deposit Funds',    desc: 'Add funds to your available balance via deposit' },
              { step: 2, title: 'Choose a Plan',    desc: 'Select a plan — the investment amount is deducted from your balance' },
              { step: 3, title: 'Earn Daily Profit', desc: 'Profits are credited to your account daily for 30 days' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-600">{step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Confirm modal */}
      {confirmPlan && (
        <ConfirmModal
          plan={confirmPlan}
          availableBalance={availableBalance}
          onConfirm={handleConfirmInvest}
          onCancel={() => setConfirmPlan(null)}
          loading={investing}
        />
      )}
    </div>
  );
}
