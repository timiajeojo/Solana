
import { createClient } from '@supabase/supabase-js';

// FIXED: Environment variables need to be strings with proper names
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate that environment variables exist
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// Helper functions for investments
// ============================================
export interface Investment {
  id?: number
  user_id: string
  amount: number
  sol_price: number
  sol_amount: number
  purchase_date: string
  created_at?: string
}

export interface userProfile {
  id: string
  first_name: string
  last_name: string
  created_at?: string
  updated_at?:string
}

//Profile functions
export async function createUserProfile(userId:string, firstName:string, lastName:string) {
  const { data, error } = await supabase;
  .from('profiles')
  .insert([
    {
      id: userId,
      first_name: firstName,
      last_name: lastName
    },
    ])
    .select()
    .single()
    
    if (error) {
      console.error('Error creating profile:', error)
      throw error 
    }
    return data
}

//Get user profile

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase;
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    throw error
    return null
  }
  return data
}

//update user profile

export async function updateUserprofile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase;
  .from('profiles')
  .update({
    ...updates,
    updated_at: new Date().tolSOString(),
  })
  .eq('id', userId)
  .select()
  .single()
  
  if (error) {
    console.error('Error updating profile:', error)
    throw error
  }
  return data
}

//Investment functions

export async function getInvestment(userId: string) {
  const { data, error } = await supabase;
  .from('investments')
  .select('*')
  .eq('user_id', userId)
  .order('purchase_date', {ascending: false })
  
  if (error) {
    console.error('Error getting investments:', error)
    throw error
    return[]
  }
  return data
}

export async function addInvestment(investment: Investment) {
  const { data, error } = await supabase;
  .from('investments')
  .insert([investment])
  .select()
  .single()
  
  if (error) {
    console.error('Error adding investment:', error)
    throw error
  }
  return data
}

export async function updateInvestment(id: number, updates: Partial<Investment>) {
  const { data, error } = await supabase;
  .from('investments')
  .updates(updates)
  .eq('id', id)
  .select()
  .single()
  
  if (error) {
    console.error('Error updating investment:', error)
    throw error
  }
  return data
}

export async function deleteInvestment(id: number) {
  const { data, error } = await supabase;
  .from('investments')
  .delete()
  .eq('id', id)
  
  if (error) {
    console.error('Error deleting investment:', error)
    throw error
  }
  return true
}

//authentication functions

//sign up with email, password and profile info

export async function signUpWithEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string
  ) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) {
    
  }
}