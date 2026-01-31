
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
  id?: number,
  user_id: string,
  
}