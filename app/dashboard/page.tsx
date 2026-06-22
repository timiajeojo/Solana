// app/deposit/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Copy, CheckCircle2, ArrowDownToLine,
  AlertCircle, Clock, Loader2, RefreshCw, XCircle,
} from 'lucide-react';
import { getCurrentUser } from '../component/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 'amount' | 'payment' | 'success' | 'failed';

interface PaymentData {
  paymentId:     string;
  payAddress:    string;
  payAmount:     number;
  payCurrency:   string;
  priceAmount:   number;
  priceCurrency: string;
  status:        string;
  expiresAt:     string | null;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, {
  label: string; color: string; bg: string; icon: React.ReactNode;
}> = {
  waiting: {
    label: 'Waiting for payment',
    color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200',
    icon: <Clock className="w-4 h-4 text-amber-500" />,
  },
  confirming: {
    label: 'Confirming on blockchain…',
    color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200',
    icon: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
  },
  confirmed: {
    label: 'Confirmed! Finalising…',
    color: 'text-green-600', bg: 'bg-green-50 border-green-200',
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  },
  sending: {
    label: 'Processing payment…',
    color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200',
    icon: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
  },
  finished: {
    label: 'Payment complete!',
    color: 'text-green-600', bg: 'bg-green-50 border-green-200',
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  },
  partially_paid: {
    label: 'Partially paid — waiting for remainder',
    color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200',
    icon: <Clock className="w-4 h-4 text-amber-500" />,
  },
  failed: {
    label: 'Payment failed',
    color: 'text-red-600', bg: 'bg-red-50 border-red-200',
    icon: <XCircle className="w-4 h-4 text-red-500" />,
  },
  expired: {
    label: 'Payment expired',
    color: 'text-red-600', bg: 'bg-red-50 border-red-200',
    icon: <XCircle className="w-4 h-4 text-red-500" />,
  },
};

// ─── Countdown timer ──────────────────────────────────────────────────────────

function CountdownTimer({ expiresAt }: { expiresAt: string | null }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!expiresAt) return;
    function update() {
      const diff = new Date(expiresAt!).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
    }
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
      <Clock className="w-3.5 h-3.5" />
      Expires in {timeLeft}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DepositPage() {
  const router = useRouter();

  const [step,       setStep]       = useState<Step>('amount');
  const [usdAmount,  setUsdAmount]  = useState('');
  const [solAmount,  setSolAmount]  = useState('');
  const [lastEdited, setLastEdited] = useState<'usd' | 'sol'>('usd');
  const [solPrice,   setSolPrice]   = useState(102.30);
  const [payment,    setPayment]    = useState<PaymentData | null>(null);
  const [payStatus,  setPayStatus]  = useState('waiting');
  const [copied,     setCopied]     = useState<'address' | 'amount' | null>(null);
  const [creating,   setCreating]   = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [userId,     setUserId]     = useState<string | null>(null);

  // ── Init ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (!u) { router.push('/auth'); return; }
      setUserId(u.id);
    });
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
      .then((r) => r.json())
      .then((d) => { if (d?.solana?.usd) setSolPrice(d.solana.usd); })
      .catch(() => {});
  }, []);

  // ── Calculator ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (lastEdited !== 'usd') return;
    const n = parseFloat(usdAmount);
    setSolAmount(!isNaN(n) && n > 0 ? (n / solPrice).toFixed(4) : '');
  }, [usdAmount, lastEdited, solPrice]);

  useEffect(() => {
    if (lastEdited !== 'sol') return;
    const n = parseFloat(solAmount);
    setUsdAmount(!isNaN(n) && n > 0 ? (n * solPrice).toFixed(2) : '');
  }, [solAmount, lastEdited, solPrice]);

  // ── Poll payment status every 15s ─────────────────────────────────────────

  const pollStatus = useCallback(async (pid: string) => {
    try {
      const res  = await fetch(`/api/nowpayments/status?paymentId=${pid}`);
      const data = await res.json();
      if (!data.status) return;
      setPayStatus(data.status);
      if (data.status === 'finished' || data.status === 'confirmed') {
        setTimeout(() => setStep('success'), 1500);
      } else if (data.status === 'failed' || data.status === 'expired') {
        setStep('failed');
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (step !== 'payment' || !payment) return;
    const t = setInterval(() => pollStatus(payment.paymentId), 15000);
    return () => clearInterval(t);
  }, [step, payment, pollStatus]);

  // ── Copy helper ───────────────────────────────────────────────────────────

  function copy(text: string, type: 'address' | 'amount') {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  // ── Create payment session via API route ──────────────────────────────────

  async function handleCreatePayment() {
    setError(null);
    const usd = parseFloat(usdAmount);
    if (!usd || usd < 1) { setError('Minimum deposit is $1.00'); return; }
    if (!userId)          { router.push('/auth'); return; }

    setCreating(true);
    try {
      const res  = await fetch('/api/nowpayments/create', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ amount: usd, orderId: `${userId}_${Date.now()}`, userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create payment');
      setPayment(data);
      setPayStatus('waiting');
      setStep('payment');
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setCreating(false);
    }
  }

  // ── Success screen ────────────────────────────────────────────────────────

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-9 h-9 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit Confirmed!</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Your SOL payment has been verified on-chain. Your balance has been updated.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/history')}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
            >
              View History
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Failed screen ─────────────────────────────────────────────────────────

  if (step === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-9 h-9 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            The payment session expired or failed. Please start a new deposit.
          </p>
          <button
            onClick={() => { setStep('amount'); setPayment(null); setUsdAmount(''); setSolAmount(''); }}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Payment screen ────────────────────────────────────────────────────────

  if (step === 'payment' && payment) {
    const sc = STATUS_CONFIG[payStatus] || STATUS_CONFIG.waiting;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
        <div className="max-w-lg mx-auto px-4 py-10">

          <button
            onClick={() => setStep('amount')}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
              <ArrowDownToLine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Send Payment</h1>
              <p className="text-sm text-gray-500">Send the exact SOL amount to the address below</p>
            </div>
          </div>

          {/* Status banner */}
          <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 mb-5 ${sc.bg}`}>
            {sc.icon}
            <span className={`text-sm font-semibold ${sc.color}`}>{sc.label}</span>
            <button
              onClick={() => pollStatus(payment.paymentId)}
              className="ml-auto p-1 rounded-lg hover:bg-white/50 transition-colors"
              title="Check status"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>

          {/* Amount summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5 mb-4">
            <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-100">
              <p className="text-sm text-gray-500">You deposit</p>
              <p className="text-lg font-bold text-gray-900">${payment.priceAmount.toFixed(2)} USD</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Send exactly</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-purple-600">{payment.payAmount} SOL</p>
                <button
                  onClick={() => copy(String(payment.payAmount), 'amount')}
                  className="p-1.5 rounded-lg hover:bg-purple-50 border border-purple-100 transition-colors"
                >
                  {copied === 'amount'
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    : <Copy className="w-3.5 h-3.5 text-purple-500" />}
                </button>
              </div>
            </div>
          </div>

          {/* Wallet address */}
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700">Deposit wallet address</p>
              {payment.expiresAt && <CountdownTimer expiresAt={payment.expiresAt} />}
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1.5">SOL Address</p>
              <div className="flex items-start gap-2">
                <code className="flex-1 text-xs font-mono text-gray-900 break-all leading-relaxed">
                  {payment.payAddress}
                </code>
                <button
                  onClick={() => copy(payment.payAddress, 'address')}
                  className="shrink-0 p-2 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg transition-colors"
                >
                  {copied === 'address'
                    ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                    : <Copy className="w-4 h-4 text-purple-600" />}
                </button>
              </div>
              {copied === 'address' && (
                <p className="text-xs text-green-600 font-medium mt-2">✓ Address copied!</p>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Send <strong>exactly {payment.payAmount} SOL</strong> to this address.
              This is a unique session address — do not reuse it. Only send SOL on the Solana network.
            </p>
          </div>

          <p className="text-center text-xs text-gray-400">
            This page automatically checks your payment every 15 seconds.
          </p>

        </div>
      </div>
    );
  }

  // ── Amount entry screen ───────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="max-w-lg mx-auto px-4 py-10">

        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
            <ArrowDownToLine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deposit</h1>
            <p className="text-gray-500 text-sm">Pay with SOL — confirmed automatically on-chain</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5 mb-5">
          <p className="text-sm font-semibold text-gray-700 mb-3">How it works</p>
          <div className="space-y-2.5">
            {[
              'Enter the amount you want to deposit in USD or SOL',
              'We generate a unique SOL payment address just for you',
              'Send the exact SOL amount from Phantom, Solflare, or any SOL wallet',
              'Payment is detected and confirmed automatically — no manual steps needed',
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5 mb-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">Enter deposit amount</p>

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Amount in USD</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={usdAmount}
                onChange={(e) => { setLastEdited('usd'); setUsdAmount(e.target.value); }}
                placeholder="0.00"
                className="w-full pl-9 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-xl font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center justify-center my-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
              </svg>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Amount in SOL</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.0001"
                value={solAmount}
                onChange={(e) => { setLastEdited('sol'); setSolAmount(e.target.value); }}
                placeholder="0.0000"
                className="w-full pl-4 pr-16 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-xl font-semibold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">SOL</span>
            </div>
          </div>

          <p className="text-xs text-gray-400">Live rate: 1 SOL ≈ ${solPrice.toFixed(2)} USD</p>

          {error && (
            <div className="flex items-center gap-2 mt-3 text-sm text-red-500 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        <button
          onClick={handleCreatePayment}
          disabled={!usdAmount || parseFloat(usdAmount) < 1 || creating}
          className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white shadow-lg disabled:shadow-none"
        >
          {creating
            ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating address…</>
            : <><ArrowDownToLine className="w-5 h-5" /> Generate Payment Address</>}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
          Powered by NOWPayments · Address expires in 20 minutes · Minimum deposit: $1.00
        </p>

        </div>
    </div>
  );
}