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
    
  } catch (err) {
    console.error('Error:', err);
    
  }
  {
    
  }
}
}