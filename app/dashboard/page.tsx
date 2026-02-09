'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Plus, User, Settings, History, LogOut, CreditCard } from 'lucide-react'
import { getCurrentUser, getInvestments, addInvestment, getUserProfile, signOut } from '../component/lib/supabase'

interface Investment {
  
}