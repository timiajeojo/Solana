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
  <div className=""
  )
}