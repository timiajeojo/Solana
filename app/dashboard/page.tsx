'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Plus, User, Settings, History, LogOut, CreditCard } from 'lucide-react'
import { getCurrentUser, getInvestments, addInvestment, getUserProfile, signOut } from '../component/lib/supabase'

interface Investment {
  Id?: number
  amount: number
  sol_price: number
  sol_amount: number
  purchase_date: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null);
  const [iserProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    solAmount:'',
    pricePerSol: ''
  })
  const [currentSolPrice] = useState(102.30);
  
  useEffect(() => {
    checkUser()
  }, [])
  
  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth')
        return
      }
      setUser(currentUser)
      
      const profile = await getUserProfile(currentUser.id);
      setUserProfile(profile)
      
      await loadInvestments(currentUser.id)
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/auth')
    } finally {
    setLoading(false)
    }
  };

const loadInvestments = async (userId: string) => {
  try {
    const data = await getInvestments(userId);
    setInvestments(data || [])
  } catch (error) {
    console.error('Error loading investments:', error);
  }
};

const handleInvestment     = async () => {
  if (!newInvestment.solAmount || !newInvestment.pricePerSol || !user) return
  
  try {
    const solAmount = parseFloat(newInvestment.solAmount);
    const pricePerSol = parseFloat(,newInvestment.pricePerSol);
    const totalAmount = solAmount * pricePerSol;
    
    const investment = {
      user_id: user.id,
      amount: totalAmount,
      sol_price: pricePerSol,
      sol_amount: solAmount,
      purchase_date: new Date().toISOString(),
    };
    
    await addInvestment(investment)
    await loadInvestments(user.id)
    setNewInvestment({ solAmount: '', pricePerSol: ''})
    setShowAddModal(false)
  } catch (error) {
    console.error('Error adding invesents:', error);
    alert('failed to add investment')
  }
}

const handleLogout = async () => {
  try {
    await signOut
    router.push('/auth')
  } catch (error) {
    console.error('Logout error:', error);
  }
};

const getInitials = async () => {
  if (!userProfile?.first_name && userProfile?.last_name) {
    return `${userProfile.first_name[0]}${userProfile.last_name[0]}`.toUpperCase()
  }
  return user?.email?.[0]?.toUpperCase() || 'U'
}

const calculateTotalInvestment = () => {
  const solAmt = parseFloat(newInvestment.solAmount) || 0;
  const price = parseFloat(newInvestment.pricePerSol) || 0;
  return (solAmt * price).toFixed(2)
};

if (loading) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
    <div className="w-16 h-16 border border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
    <p className="text-gray-600">Loading...</p>
    </div>
    </div>
    )
}

const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
const totalSolCoins = investments.reduce((sum, inv) => sum + inv.sol_amount, 0);
const currentValue = totalSolCoins * currentSolPrice;
const profitLoss = currentValue - totalInvested;
const profitLossPercent = totalInvested > 0 ?((profitLoss / totalInvested) * 100).toFixed(2) : '0.00';

return (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
  {/* Header With User Profile Dropdown*/}
  <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex items-center justify-between h-20">
  {/* Logo */}
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
  <div className="w-6 h-6 text-white" />
  </div>
  <div>
  <h1 className="text-xl font-bold text-gray-900">Solana Tracker</h1>
  <p className="text-xs text-gray-500">Investment Dashboard</p>
  </div>
  </div>
  
  {/* User profile with Dropdown */}
  <div className="relative">
  <button
  onClick={() => setShowDropDown(!showDropDown)}
  className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-colors"
  >
  <div className="text-right hidden sm:block">
  <div className="text-sm font-semibold text-gray-900">
  {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : user?.email}
  </p>
  <p className=""
  </div>
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
  {getInitials()}
  </div>
  </button>
  
  {/* Dropdown Menu */}
  {showDropDown &&(
    <>
    <div
    className="fixed inset-0 z-10"
    onClick={() => setShowDropDown(false)}
    ></div>
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20">
    <div className="px-4 py-3 border-b border-gray-100">
    <p className="text-sm font-semibold text-gray-900">
    {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : 'user'}
    </p>
    <p className="text-xs text-gray-500">{user?.email}</p>
    </div>
    
    <button
    onClick={() => {
      setShowDropDown(false)
      router.push('/auth')
    }}
    className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 text-gray-700"
    >
    <User className="w-5 h-5 text-purple-600" />
    <span className="font-medium">Profile</span>
    </button>
    
    <button
    onClick={() => {
      setShowDropDown(false)
      router.push('/wallets')
    }}
    className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3.text-gray-700"
    >
    <CreditCard className="w-5 h-5 text-purple-600" />
    <span className="font-medium">Wallets</span>
    </button>
    
    <button
    onClick={() => {
      setShowDropDown(false)
      router.push('/history')
    }}
    className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 text-gray-700"
    >
    <History className="w-5 h-5 text-purple-600" />
    <span className="font-medium">History</span>
    </button>
    
    <button
    onClick={() => {
    setShowDropDown(false)
    router.push('/settings')
    }}
    className="w-full px-4 py-3 text-white hover:bg-purple-50 transition-colors flex items-center gap-3 text-gray-700"
    >
    <settings className="w-5 h-5 text-purple-600" />
    <span className="font-medium">Settings</span>
    </button>
    
    <div className="border-t border-gray-100 mt-2 pt-2">
    <button
    onClick={() => {
      setShowDropDown(false)
      handleLogout()
    }}
    className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
    >
    <logOut className="w-5 h-5" />
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
    
    {/* Main Content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Welcome Section */}
    <div className="mb-8">
    <h2 className="text-3xl font-bold text-gray-900 mb-2">
    Welcome back, {userProfile?.first_name || 'user'}!👋
    </h2>
    <p className="text-gray-600">Heres your solana investment overview</p>
    </div>
    
    {/* Add investment button */}
    <div className="mb-6 flex justify-end">
    <button
    onClick={() => setShowAddModal(true)}
    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl"
    >
    <Plus className="w-5 h-5" />
    Add Investment
    </button>
    </div>
    
    {/* Portfolio summary cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
    <div className="flex items-center gap-3 mb-4">
    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
    <wallet className="w-6 h-6 text-purple-600" />
    </div>
    <div>
    <p className="text-sm text-gray-600 font-medium">Total Invested</p>
    <p className="text-2xl fontbold text-gray-900">${totalInvested.toFixed(2)}</p>
    </div>
    </div>
    </div>
    
    <div className="bg-white rounded-2xl p-6 shadow-lg border- border-purple-100">
    <div className="flex items-center gap-3 mb-4">
    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
    <TrendingUp className="w-6 h-6 text-purple-600" />
    </div>
    <div>
    <p className="text-sm text-gray-600 font-medium"> Current Value</p>
    <p className="text-2xl font-bold text-gray-900">${currentValue.toFixed(2)}</p>
    </div>
    </div>
    </div>
    
    <div className={`rounded-2xl p-6 shadow-lg border ${
      profitLoss >= 0
      ? 'bg-green-50 border-green-200'
      : 'bg-red-50 border-red-200'
    }`>
    <div className="flex items-center gap-3 mb-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
      profitLoss >= 0 ? 'bg-green-100' : 'bg-red-100'
    }`}>
    {profitLoss >= 0 ? (
      <ArrowUpRight className="w-6 h-6 text-green-600" />
      ) : (
      <ArrowDownRight className="w-6 h-6 text-red-600" />
      )}
      </div>
      <div>
      <p className={`text-sm font-medium ${
        profitLoss >= 0 ? 'text-green-700' : 'text-red-700'
      }`}>
      {profitLoss >= 0 'Profit' : 'Loss'}
      </p>
      <p className={`text-2xl font-bold ${
        profitLoss >= 0 ? 'text-green-700' : 'text-red-700'
      }`}>
      ${Math.abs(profitLoss).toFixed(2)}
      </p>
      </div>
      </div>
      
  )
}