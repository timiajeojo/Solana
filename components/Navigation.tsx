'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { layoutDashboard, History, TrendingUp, LogOut } from 'lucide-react'
import { signOut } from '../app/component/lib/supabase'

export 