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
  
  
}