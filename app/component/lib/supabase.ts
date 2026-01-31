
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

export async function updateUserprofile() {
  
}