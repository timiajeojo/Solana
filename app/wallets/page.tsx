// app/wallets/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, Plus, Copy, ArrowLeft, Trash2, ArrowDownToLine, CheckCircle2 } from 'lucide-react';
import { useBalance } from '@/context/BalanceContext';

interface WalletItem {
  id:      number;
  name:    string;
  address: string;
}

export default function WithdrawPage() {
  const router = useRouter();

  // Real balance from dashboard via context
  const { currentValue, totalSolCoins } = useBalance();

  const [wallets, setWallets] = useState<WalletItem[]>([
    { id: 1, name: 'Main Wallet', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb' },
    { id: 2, name: 'Savings',     address: '0x8d12A197cB00D4747a1fe03395095ce2A5CC6819' },
  ]);

  const [showAddModal,      setShowAddModal]      = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSuccessModal,  setShowSuccessModal]  = useState(false);
  const [newWallet,         setNewWallet]         = useState({ name: '', address: '' });
  const [selectedWallet,    setSelectedWallet]    = useState<WalletItem | null>(null);
  const [amount,            setAmount]            = useState('');
  const [copied,            setCopied]            = useState<number | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleCopy(address: string, id: number) {
    navigator.clipboard.writeText(address);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleAddWallet() {
    if (!newWallet.name || !newWallet.address) return;
    setWallets([...wallets, { id: Date.now(), name: newWallet.name, address: newWallet.address }]);
    setNewWallet({ name: '', address: '' });
    setShowAddModal(false);
  }

  function handleDelete(id: number) {
    if (confirm('Are you sure you want to remove this wallet?')) {
      setWallets(wallets.filter((w) => w.id !== id));
      if (selectedWallet?.id === id) setSelectedWallet(null);
    }
  }

  function handleWithdraw() {
    if (!selectedWallet || !amount) return;
    setShowWithdrawModal(false);
    setShowSuccessModal(true);
    setAmount('');
    setSelectedWallet(null);
  }

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Withdraw</h1>
            <p className="text-gray-500 mt-1">Select a wallet and withdraw your funds</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-md text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Wallet
          </button>
        </div>

        {/* Balance summary — real data from dashboard */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <p className="text-purple-100 text-sm font-medium mb-1">Available Balance</p>
          <p className="text-4xl font-bold">
            ${currentValue.toFixed(2)}
            <span className="text-xl font-semibold text-purple-200 ml-2">USD</span>
          </p>
          <p className="text-purple-200 text-sm mt-1">
            {totalSolCoins.toFixed(4)} SOL
          </p>
        </div>

        {/* Wallet list */}
        {wallets.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <Wallet className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No wallets added yet</p>
            <button onClick={() => setShowAddModal(true)} className="mt-4 text-purple-600 font-semibold hover:underline text-sm">
              Add your first wallet
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
                    isSelected
                      ? 'border-purple-500 shadow-purple-100 shadow-md'
                      : 'border-gray-100 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Radio */}
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>

                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900">{wallet.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md truncate max-w-[160px]">
                          {wallet.address.slice(0, 10)}…{wallet.address.slice(-6)}
                        </code>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCopy(wallet.address, wallet.id); }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors shrink-0"
                          title="Copy address"
                        >
                          {copied === wallet.id
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    {/* Delete */}
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

        {/* Withdraw button */}
        <button
          onClick={() => selectedWallet && setShowWithdrawModal(true)}
          disabled={!selectedWallet}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
            selectedWallet
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          <ArrowDownToLine className="w-5 h-5" />
          {selectedWallet ? `Withdraw to ${selectedWallet.name}` : 'Select a wallet to withdraw'}
        </button>

      </div>

      {/* ── Withdraw amount modal ─────────────────────────────────────────── */}
      {showWithdrawModal && selectedWallet && (
        <Modal onClose={() => setShowWithdrawModal(false)}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
              <ArrowDownToLine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Withdraw Funds</h3>
              <p className="text-sm text-gray-500">To: {selectedWallet.name}</p>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl px-4 py-3 mb-5 text-sm text-gray-600">
            <span className="font-medium">Wallet:</span>{' '}
            <code className="text-xs">{selectedWallet.address.slice(0, 14)}…{selectedWallet.address.slice(-6)}</code>
          </div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (USD)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 text-lg mb-1"
          />
          <p className="text-xs text-gray-400 mb-6">
            Available: <span className="font-semibold text-purple-600">${currentValue.toFixed(2)}</span>
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleWithdraw}
              disabled={!amount || Number(amount) <= 0}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-semibold shadow-md"
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}

      {/* ── Add wallet modal ──────────────────────────────────────────────── */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Wallet</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Wallet Name</label>
              <input
                type="text"
                value={newWallet.name}
                onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
                placeholder="e.g. Main Wallet"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Wallet Address</label>
              <input
                type="text"
                value={newWallet.address}
                onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                placeholder="0x..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWallet}
                disabled={!newWallet.name || !newWallet.address}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-semibold shadow-md"
              >
                Add Wallet
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Success modal ─────────────────────────────────────────────────── */}
      {showSuccessModal && (
        <Modal onClose={() => setShowSuccessModal(false)}>
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Withdrawal Submitted</h3>
            <p className="text-gray-500 text-sm mb-6">
              Your withdrawal request has been submitted and is being processed.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
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
