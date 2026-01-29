
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
  id?: number;
  user_id: string;
  amount: number;
  sol_price: number;
  sol_amount: number;
  purchase_date: string;
  created_at?: string;
}

// Get all investments for a user
export async function getInvestments(userId: string) {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', userId) // FIXED: Added comma
    .order('purchase_date', { ascending: false }); // FIXED: Added comma

  if (error) {
    console.error('Error fetching investments:', error);
    return [];
  }

  return data;
}

// Add a new investment
export async function addInvestment(investment: Investment) { // FIXED: Function name
  const { data, error } = await supabase // FIXED: Removed semicolon
    .from('investments')
    .insert([investment])
    .select()
    .single();

  if (error) {
    console.error('Error adding investment:', error);
    throw error;
  }

  return data;
}

// Update an investment
export async function updateInvestment(id: number, updates: Partial<Investment>) { // FIXED: Partial capitalization
  const { data, error } = await supabase // FIXED: Removed semicolon
    .from('investments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating investment:', error);
    throw error;
  }

  return data;
}

// Delete an investment
export async function deleteInvestment(id: number) {
  const { error } = await supabase // FIXED: Removed semicolon
    .from('investments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting investment:', error);
    throw error;
  }

  return true;
}

// ============================================
// Authentication helpers
// ============================================

// Sign up with email and password
export async function signUpWithEmail(email: string, password: string) { // FIXED: Typo "passowrd" -> "password"
  const { data, error } = await supabase.auth.signUp({
    email,
    password, // FIXED: Typo
  });

  if (error) {
    console.error('Error signing up:', error);
    throw error;
  }

  return data;
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error signing in:', error);
    throw error;
  }

  return data;
}

// Sign in with Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({ // FIXED: signInWithGoogle -> signInWithOAuth
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }

  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user:', error);
    return null;
  }

  return user;
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null);
  });
}