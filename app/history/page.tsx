// app/history/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowDownToLine, ArrowUpFromLine,
  TrendingUp, Clock, CheckCircle2, XCircle, RefreshCw,
} from 'lucide-react';
import { getCurrentUser, getFullHistory } from '../component/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

type TxType   = 'investment' | 'withdrawal' | 'deposit';
type TxStatus = 'completed' | 'pending' | 'failed';
type Filter   = 'all' | TxType;

interface Transaction {
  id:             string;
  type:           TxType;
  amount:         number;
  status:         TxStatus;
  plan:           string;
  date:           string;
  sol_amount?:    number;
  sol_price?:     number;
  wallet_name?:   string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });
}

const TYPE_CONFIG: Record<TxType, {
  label: string;
  icon:  React.ReactNode;
  color: string;
  bg:    string;
}> = {
  investment: {
    label: 'Investment',
    icon:  <TrendingUp className="w-4 h-4" />,
    color: 'text-purple-600',
    bg:    'bg-purple-100',
  },
  deposit: {
    label: 'Deposit',
    icon:  <ArrowDownToLine className="w-4 h-4" />,
    color: 'text-green-600',
    bg:    'bg-green-100',
  },
  withdrawal: {
    label: 'Withdrawal',
    icon:  <ArrowUpFromLine className="w-4 h-4" />,
    color: 'text-orange-500',
    bg:    'bg-orange-100',
  },
};

const STATUS_CONFIG: Record<TxStatus, {
  label: string;
  icon:  React.ReactNode;
  cls:   string;
}> = {
  completed: {
    label: 'Completed',
    icon:  <CheckCircle2 className="w-3 h-3" />,
    cls:   'bg-green-100 text-green-700',
  },
  pending: {
    label: 'Pending',
    icon:  <Clock className="w-3 h-3" />,
    cls:   'bg-yellow-100 text-yellow-700',
  },
  failed: {
    label: 'Failed',
    icon:  <XCircle className="w-3 h-3" />,
    cls:   'bg-red-100 text-red-700',
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [filter,       setFilter]       = useState<Filter>('all');

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      if (!user) { router.push('/auth'); return; }
      const data = await getFullHistory(user.id);
      setTransactions(data as Transaction[]);
    } catch (e) {
      console.error(e);
      setError('Failed to load history. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter((t) => t.type === filter);

  // Summary totals
  const totalInvested  = transactions.filter((t) => t.type === 'investment').reduce((s, t) => s + t.amount, 0);
  const totalDeposited = transactions.filter((t) => t.type === 'deposit').reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = transactions.filter((t) => t.type === 'withdrawal').reduce((s, t) => s + t.amount, 0);

  // ── Render ─────────────────────────────────────────────────────────────────

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-gray-500 mt-1">All your deposits, investments and withdrawals</p>
          </div>
          <button
            onClick={loadHistory}
            className="p-2 rounded-xl hover:bg-purple-100 text-gray-500 hover:text-purple-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <SummaryCard
            label="Invested"
            amount={totalInvested}
            color="text-purple-600"
            bg="bg-purple-50 border-purple-100"
            icon={<TrendingUp className="w-4 h-4 text-purple-600" />}
          />
          <SummaryCard
            label="Deposited"
            amount={totalDeposited}
            color="text-green-600"
            bg="bg-green-50 border-green-100"
            icon={<ArrowDownToLine className="w-4 h-4 text-green-600" />}
          />
          <SummaryCard
            label="Withdrawn"
            amount={totalWithdrawn}
            color="text-orange-500"
            bg="bg-orange-50 border-orange-100"
            icon={<ArrowUpFromLine className="w-4 h-4 text-orange-500" />}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {(['all', 'investment', 'deposit', 'withdrawal'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                filter === f
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              {f === 'all' ? 'All' : TYPE_CONFIG[f].label + 's'}
              {f !== 'all' && (
                <span className={`ml-1.5 text-xs font-bold ${filter === f ? 'text-purple-200' : 'text-gray-400'}`}>
                  {transactions.filter((t) => t.type === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-red-600 font-medium">{error}</p>
            <button onClick={loadHistory} className="mt-3 text-sm text-red-500 hover:underline">
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-14 text-center">
            <Clock className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No transactions yet</p>
            <p className="text-sm text-gray-400 mt-1">
              {filter === 'all'
                ? 'Your activity will appear here once you make a transaction.'
                : `No ${TYPE_CONFIG[filter as TxType].label.toLowerCase()}s found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((tx) => {
              const typeConf   = TYPE_CONFIG[tx.type];
              const statusConf = STATUS_CONFIG[tx.status];
              const isDebit    = tx.type === 'withdrawal';

              return (
                <div
                  key={tx.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-purple-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    {/* Type icon */}
                    <div className={`w-10 h-10 rounded-xl ${typeConf.bg} ${typeConf.color} flex items-center justify-center shrink-0`}>
                      {typeConf.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{typeConf.label}</p>
                        {tx.plan && tx.plan !== '-' && (
                          <span className="text-xs bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full font-medium">
                            {tx.plan}
                          </span>
                        )}
                        {tx.wallet_name && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            → {tx.wallet_name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {/* Status badge */}
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${statusConf.cls}`}>
                          {statusConf.icon}
                          {statusConf.label}
                        </span>

                        {/* SOL detail for investments */}
                        {tx.type === 'investment' && tx.sol_amount && (
                          <span className="text-xs text-gray-400">
                            {tx.sol_amount.toFixed(4)} SOL @ ${tx.sol_price?.toFixed(2)}
                          </span>
                        )}

                        {/* Date */}
                        <span className="text-xs text-gray-400">
                          {formatDate(tx.date)} · {formatTime(tx.date)}
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right shrink-0">
                      <p className={`text-lg font-bold ${isDebit ? 'text-orange-500' : 'text-gray-900'}`}>
                        {isDebit ? '-' : '+'}${tx.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-6">
            Showing {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
          </p>
        )}

      </div>
    </div>
  );
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({
  label, amount, color, bg, icon,
}: {
  label:  string;
  amount: number;
  color:  string;
  bg:     string;
  icon:   React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${bg}`}>
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <p className="text-xs font-semibold text-gray-500">{label}</p>
      </div>
      <p className={`text-xl font-bold ${color}`}>${amount.toFixed(2)}</p>
    </div>
  );
}
