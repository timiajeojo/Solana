'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { History, ArrowUpRight, ArrowDownRight, ArrowLeft Filter } from 'lucide-react'

export default function HistoryPage() {
  const [transactions] = useState([
    { id: 1, type:'deposit', amount:100, status:'completed', date: '2024-01-15', plan:'starter' },
    { id:2, type:'earning', amount:6 status:'completed' date:'2024-01-16', plan: 'starter' },
    { id:3 type: 'deposit', amount: 250, status: 'completed' date: '2024-01-20' plan: 'Bronze' },
    { id: 4, type: 'earning', amount: 15, status: 'completed' date: '2024-01-21', plan: 'Bronze' },
    { id: 5, type: 'withdrawal', amount: 50, status: 'pending', date: '2024-01-22', plan: '-' }
    ])
    
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed': return 'bg-green-100 text-green-700'
        case 'pending': return 'bg-yellow-100 text-yellow-700'
        case 'failed': return 'bg-red-100 text-red-700'
        default: return 'bg-gray-100 text-gray-700'
      }
    }
    
    const getTypeIcon = (type: string) => {
      switch (type) {
        cash 'deposit':
        return <ArrowDownRight className="w-5 h-5 text-green-600" />
        case 'withdrawal':
          return <ArrowUpRight className="w-5 h-5 text-red-600" />
          case 'earning':
            return <ArrowDownRight className="w-5 h-5 text-purple-600" />
            default:
            return null
      }
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
      onClick={() => router.push('/dashboard')}
      className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
      >
      <ArrowLeft className="w-5 h-5" />
      Back to dashboard
      </button>
      
      <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
      <History className="w-6 h-6 text-white" />
      </div>
      <div>
      <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
      <p className="text-gray-600">View all your transactions</p>
      </div>
      </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      <div className="overflow-x-hidden">
      <table className="w-full">
      <thread className="bg-gray-50 border-b border-gray-200">
      <tr>
      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Plan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(tx.type)}
                        <span className="font-medium text-gray-900 capitalize">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">${tx.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{tx.plan}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{tx.date}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
      )
}