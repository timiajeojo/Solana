'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'
import { getCurrentUser, getInvestments, addInvestment, getUserProfile } from '../component/lib/supabase'
import Navigation from '../../component/Navigation'

interface Investment {
  id?: number
  amount: number
  sol_price: number
  sol_amount: number
  purchase_date: string
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showAddModal, setShowAddModel] = useState(false);
  const [newInvestment, setNewInvestment] = useState({amount: '', solPrice: ''});
  const [currentSolPrice] = useState(102.30);
  
  useEffect(() => {
    checkUser();
  }, [])
  
  const checkUser = async function getCurrentUser() {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/auth')
        return
      }
      setUser(currentUser)
      
      //Fetch User Profile
      const profile = await getUserProfile(currentUser.id);
      setUserProfile(profile)
      
      await loadInvestments(currentUser.id)
    } catch (error) {
      console.error('Error Checking User:', error);
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
  
  const handleAddInvestments = async () => {
    if (!newInvestment.amount || !newInvestment.solPrice || !user) return
    
    try {
      const amount = parseFloat(newInvestment.amount);
      const solPrice = parseFloat(newInvestment.solPrice);
      const solAmount = amount / solPrice
      
      const investment = {
        user_id: user.id,
        amount,
        sol_price: solPrice,
        sol_amount: solAmount,
        purchase_date: new Date().toISOString(),
      };
      
      await addInvestment(investment)
      await loadInvestments(user.id)
      setNewInvestment({ amount: '', solPrice: '' })
      setShowAddModel(false)
    } catch (error) {
      console.error('Error adding investments:', error);
      alert('Field to add investment')
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent  rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
      </div>
      </div>
      )
  }
  
  //Calculate portfolio metrics
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalSolCoins = investments.reduce((sum, inv) => sum + inv.sol_amount, 0);
  const currentValue = totalSolCoins * currentSolPrice;
  const profitLoss = currentValue - totalInvested;
  
  