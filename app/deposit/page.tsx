// app/deposit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, CheckCircle2, ArrowDownToLine, QrCode, AlertCircle } from 'lucide-react';
import { getCurrentUser, addDeposit } from '../component/lib/supabase';

// ─── Config ───────────────────────────────────────────────────────────────────

// Replace with your actual receiving wallet address
const DEPOSIT_WALLET_ADDRESS = 'GZj3hG5pump9XJ4kT2vR8mN1qW6sL3yB7dC0eF5aH2uK';
const CURRENT_SOL_PRICE = 102.30; // keep in sync with dashboard's currentSolPrice

export default function DepositPage() {
  const router = useRouter();

  const [usdAmount, setUsdAmount] = useState('');
  const [solAmount, setSolAmount] = useState('');
  const [lastEdited, setLastEdited] = useState<'usd' | 'sol'>('usd');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Live calculator — keeps USD and SOL in sync ────────────────────────────

  useEffect(() => {
    if (lastEdited === 'usd') {
      const usd = parseFloat(usdAmount);
      if (!isNaN(usd) && usd > 0) {
        setSolAmount((usd / CURRENT_SOL_PRICE).toFixed(4));
      } else {
        setSolAmount('');
      }
    }
  }, [usdAmount, lastEdited]);

  useEffect(() => {
    if (lastEdited === 'sol') {
      const sol = parseFloat(solAmount);
      if (!isNaN(sol) && sol > 0) {
        setUsdAmount((sol * CURRENT_SOL_PRICE).toFixed(2));
      } else {
        setUsdAmount('');
      }
    }
  }, [solAmount, lastEdited]);

  function handleUsdChange(value: string) {
    setLastEdited('usd');
    setUsdAmount(value);
  }

  function handleSolChange(value: string) {
    setLastEdited('sol');
    setSolAmount(value);
  }

  function handleCopyAddress() {
    navigator.clipboard.writeText(DEPOSIT_WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmitDeposit() {
    setError(null);
    const usd = parseFloat(usdAmount);

    if (!usd || usd <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await getCurrentUser();
      if (!user) { router.push('/auth'); return; }

      await addDeposit({
        user_id: user.id,
        amount:  usd,
        plan:    'Manual Deposit',
        status:  'pending',
      });

      setShowSuccess(true);
      setUsdAmount('');
      setSolAmount('');
    } catch (e) {
      console.error(e);
      setError('Failed to record deposit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const formattedAddress = `${DEPOSIT_WALLET_ADDRESS.slice(0, 8)}...${DEPOSIT_WALLET_ADDRESS.slice(-8)}`;

  // ── Success screen ───────────────────────────────────────────────────────

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-9 h-9 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit Submitted</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            We've recorded your deposit request. Once your SOL transfer is confirmed on-chain,
            your balance will be updated. Track its status in History.
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

  // ── Main UI ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
            <ArrowDownToLine className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deposit</h1>
            <p className="text-gray-600">Send SOL to fund your account</p>
          </div>
        </div>

        {/* Wallet address card */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="w-4 h-4 text-purple-600" />
            <p className="text-sm font-semibold text-gray-700">Send SOL to this wallet</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1.5">Wallet Address</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono text-gray-900 break-all sm:break-normal">
                {formattedAddress}
              </code>
              <button
                onClick={handleCopyAddress}
                className="shrink-0 p-2.5 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg transition-colors"
                title="Copy full address"
              >
                {copied
                  ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                  : <Copy className="w-4 h-4 text-purple-600" />}
              </button>
            </div>
          </div>

          {copied && (
            <p className="text-xs text-green-600 font-medium mt-2">Address copied to clipboard!</p>
          )}

          <div className="flex items-start gap-2 mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Only send <strong>SOL</strong> to this address. Sending any other asset may result in permanent loss of funds.
            </p>
          </div>
        </div>

        {/* Calculator */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">Calculate your deposit</p>

          {/* USD input */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={usdAmount}
                onChange={(e) => handleUsdChange(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg font-semibold"
              />
            </div>
          </div>

          {/* Swap indicator */}
          <div className="flex items-center justify-center my-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="19 12 12 19 5 12" />
                <line x1="12" y1="5" x2="12" y2="19" />
              </svg>
            </div>
          </div>

          {/* SOL input */}
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Amount (SOL)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.0001"
                value={solAmount}
                onChange={(e) => handleSolChange(e.target.value)}
                placeholder="0.0000"
                className="w-full pl-4 pr-16 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg font-semibold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">SOL</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Rate: 1 SOL ≈ ${CURRENT_SOL_PRICE.toFixed(2)} USD
          </p>

          {error && (
            <p className="text-sm text-red-500 font-medium mt-3">{error}</p>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmitDeposit}
          disabled={!usdAmount || parseFloat(usdAmount) <= 0 || submitting}
          className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white disabled:shadow-none"
        >
          <ArrowDownToLine className="w-5 h-5" />
          {submitting ? 'Submitting…' : "I've Sent the SOL"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          After sending, click the button above to notify us. Your balance updates once the transaction is confirmed.
        </p>

      </div>
    </div>
  );
}
