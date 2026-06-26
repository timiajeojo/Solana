// app/wallets/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wallet, Plus, Copy, ArrowLeft, Trash2,
  ArrowDownToLine, CheckCircle2, Loader2, AlertCircle,
} from 'lucide-react';
import { getCurrentUser, addWithdrawal } from '../component/lib/supabase';
import { useUser } from '@/app/context/UserContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface WalletItem {
  id:      number;
  name:    string;
  address: string;
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

export default function WithdrawPage() {
  const router  = useRouter();
  const { user } = useUser();

  const [availableBalance, setAvailableBalance] = useState(0);
  const [loadingBalance,   setLoadingBalance]   = useState(true);
  const [wallets,          setWallets]          = useState<WalletItem[]>([]);
  const [selectedWallet,   setSelectedWallet]   = useState<WalletItem | null>(null);

  const [showAddModal,      setShowAddModal]      = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSuccessModal,  setShowSuccessModal]  = useState(false);

  const [newWallet,   setNewWallet]   = useState({ name: '', address: '' });
  const [amount,      setAmount]      = useState('');
  const [copied,      setCopied]      = useState<number | null>(null);
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    loadBalance();
  }, []);

  async function loadBalance() {
    setLoadingBalance(true);
    try {
      const authUser = await getCurrentUser();
      if (!authUser) { router.push('/auth'); return; }

      // Available balance = total profits credited so far
      const { data, error } = await supabase
        .from('profits')
        .select('amount')
        .eq('user_id', authUser.id);

      if (error) throw error;

      const total = (data || []).reduce((s: number, p: any) => s + p.amount, 0);
      setAvailableBalance(total);
    } catch (err) {
      console.error('Error loading balance:', err);
    } finally {
      setLoadingBalance(false);
    }
  }

  function handleAddWallet() {
    if (!newWallet.name.trim() || !newWallet.address.trim()) return;
    setWallets((prev) => [
      ...prev,
      { id: Date.now(), name: newWallet.name.trim(), address: newWallet.address.trim() },
    ]);
    setNewWallet({ name: '', address: '' });
    setShowAddModal(false);
  }

  function handleDelete(id: number) {
    if (!confirm('Remove this wallet?')) return;
    setWallets((prev) => prev.filter((w) => w.id !== id));
    if (selectedWallet?.id === id) setSelectedWallet(null);
  }

  function handleCopy(address: string, id: number) {
    navigator.clipboard.writeText(address);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleWithdraw() {
    if (!selectedWallet || !amount) return;
    setSubmitError(null);

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0) {
      setSubmitError('Please enter a valid amount.');
      return;
    }
    if (withdrawAmount > availableBalance) {
      setSubmitError(`Amount exceeds your available profit of $${availableBalance.toFixed(2)}.`);
      return;
    }

    setSubmitting(true);
    try {
      const authUser = await getCurrentUser();
      if (!authUser) { router.push('/auth'); return; }

      await addWithdrawal({
        user_id:        authUser.id,
        amount:         withdrawAmount,
        wallet_name:    selectedWallet.name,
        wallet_address: selectedWallet.address,
        status:         'pending',
      });

      // Send email notification to admin
      await fetch('/api/withdrawal/notify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName:      `${user.firstName} ${user.lastName}`.trim() || authUser.email,
          userEmail:     authUser.email,
          walletName:    selectedWallet.name,
          walletAddress: selectedWallet.address,
          amount:        withdrawAmount,
        }),
      });

      setShowWithdrawModal(false);
      setShowSuccessModal(true);
      setAmount('');
      setSelectedWallet(null);
    } catch (e: any) {
      console.error(e);
      setSubmitError('Failed to submit withdrawal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Withdraw</h1>
            <p className="text-gray-500 mt-1">Withdraw your earned profits</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-md text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Wallet
          </button>
        </div>

        {/* Available balance — profit only */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <p className="text-purple-100 text-sm font-medium mb-1">Available to Withdraw</p>
          {loadingBalance ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-purple-200" />
              <span className="text-purple-200 text-sm">Loading profit balance…</span>
            </div>
          ) : (
            <>
              <p className="text-4xl font-bold">
                ${availableBalance.toFixed(2)}
                <span className="text-xl font-semibold text-purple-200 ml-2">USD</span>
              </p>
              <p className="text-purple-200 text-xs mt-1">Total profits earned from your investment plan</p>
            </>
          )}
        </div>

        {/* Wallet list */}
        {wallets.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center mb-6">
            <Wallet className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No wallets added yet</p>
            <p className="text-sm text-gray-400 mt-1">Add a wallet to withdraw your profits</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-purple-600 font-semibold hover:underline text-sm"
            >
              + Add your first wallet
            </button>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Select withdrawal wallet
            </p>
            {wallets.map((wallet) => {
              const isSelected = selectedWallet?.id === wallet.id;
              return (
                <div
                  key={wallet.id}
                  onClick={() => setSelectedWallet(isSelected ? null : wallet)}
                  className={`bg-white rounded-2xl p-5 border-2 cursor-pointer transition-all shadow-sm ${
                    isSelected ? 'border-purple-500 shadow-purple-100 shadow-md' : 'border-gray-100 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900">{wallet.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md truncate max-w-[160px]">
                          {wallet.address.slice(0, 10)}…{wallet.address.slice(-6)}
                        </code>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopy(wallet.address, wallet.id); }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors shrink-0"
                        >
                          {copied === wallet.id
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(wallet.id); }}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-gray-300 group-hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Withdraw CTA */}
        <button
          onClick={() => selectedWallet && setShowWithdrawModal(true)}
          disabled={!selectedWallet || availableBalance <= 0}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
            selectedWallet && availableBalance > 0
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          <ArrowDownToLine className="w-5 h-5" />
          {availableBalance <= 0
            ? 'No profit available yet'
            : selectedWallet
              ? `Withdraw to ${selectedWallet.name}`
              : 'Select a wallet to withdraw'}
        </button>

      </div>

      {/* ── Withdraw modal ── */}
      {showWithdrawModal && selectedWallet && (
        <Modal onClose={() => { setShowWithdrawModal(false); setSubmitError(null); }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
              <ArrowDownToLine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Withdraw Profits</h3>
              <p className="text-xs text-gray-500">To: {selectedWallet.name}</p>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl px-4 py-3 mb-4 text-xs text-gray-600">
            <span className="font-semibold">Wallet: </span>
            <code>{selectedWallet.address.slice(0, 14)}…{selectedWallet.address.slice(-6)}</code>
          </div>

          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Amount (USD)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg mb-1"
          />
          <p className="text-xs text-gray-400 mb-4">
            Available profit: <span className="font-semibold text-purple-600">${availableBalance.toFixed(2)}</span>
          </p>

          {submitError && (
            <div className="flex items-center gap-2 text-sm text-red-500 font-medium mb-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {submitError}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setShowWithdrawModal(false); setSubmitError(null); }}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleWithdraw}
              disabled={!amount || Number(amount) <= 0 || submitting}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-semibold shadow-md flex items-center justify-center gap-2"
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : 'Confirm'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Add wallet modal ── */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <h3 className="text-lg font-bold text-gray-900 mb-5">Add Wallet</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Wallet Name</label>
              <input
                type="text"
                value={newWallet.name}
                onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
                placeholder="e.g. My Phantom Wallet"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Wallet Address</label>
              <input
                type="text"
                value={newWallet.address}
                onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                placeholder="Solana wallet address"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWallet}
                disabled={!newWallet.name.trim() || !newWallet.address.trim()}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-semibold shadow-md"
              >
                Add Wallet
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Success modal ── */}
      {showSuccessModal && (
        <Modal onClose={() => setShowSuccessModal(false)}>
          <div className="text-center py-2">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Withdrawal Requested</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Your withdrawal request has been submitted and will be processed shortly.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => router.push('/history')}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
              >
                View History
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
