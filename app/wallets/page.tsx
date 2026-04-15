'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, Plus, Copy, ArrowLeft, Trash2 } from 'lucide-react';

export default function WalletsPage() {
  const router = useRouter();
  const [wallets, setWallets] = useState([
    { id: 1, name: 'Main Wallet', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', balance: 2.5 },
    { id: 2, name: 'Savings', address: '0x8d12A197cB00D4747a1fe03395095ce2A5CC6819', balance: 5.2 },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWallet, setNewWallet] = useState({ name: '', address: '' });

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    alert('Address copied to clipboard!');
  };

  const handleAddWallet = () => {
    if (!newWallet.name || !newWallet.address) return;
    
    setWallets([...wallets, {
      id: Date.now(),
      name: newWallet.name,
      address: newWallet.address,
      balance: 0
    }]);
    setNewWallet({ name: '', address: '' });
    setShowAddModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this wallet?')) {
      setWallets(wallets.filter(w => w.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wallets</h1>
            <p className="text-gray-600">Manage your cryptocurrency wallets</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Wallet
          </button>
        </div>

        <div className="space-y-4">
          {wallets.map((wallet) => (
            <div key={wallet.id} className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-purple-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{wallet.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                        {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                      </code>
                      <button
                        onClick={() => handleCopy(wallet.address)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy address"
                      >
                        <Copy className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Balance: <span className="font-semibold text-purple-600">{wallet.balance} SOL</span></p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(wallet.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                >
                  <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Wallet Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Wallet</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wallet Name
                  </label>
                  <input
                    type="text"
                    value={newWallet.name}
                    onChange={(e) => setNewWallet({ ...newWallet, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    placeholder="My Wallet"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={newWallet.address}
                    onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    placeholder="0x..."
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddWallet}
                    className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-semibold shadow-lg"
                  >
                    Add Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
