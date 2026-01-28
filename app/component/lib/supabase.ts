import { createClient  } from '@supabase/supabase-js';

const supabaseUrl = process.env.https://exfvkdeewzlneuhldtfq.supabase.co;
const supabaseAnonKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZnZrZGVld3psbmV1aGxkdGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NjY0OTMsImV4cCI6MjA4NTA0MjQ5M30.9ObubipBEglL5b5puBPx_q40pTTvpzrJ5T3QdCt1yu8;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing supabase environment variable. Please check your .env.local file ');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Investment {
  id?: number;
  user_id: string;
  amount: number;
  sol_price: number;
  sol_amount: number;
  purchase_date: string;
  created_at?: string;
}

export async function getInvestments(userId: string) {
  const { data, error } = await supabase
  .from('investments')
  .select('*')
  .eq('user_id' userId)
  .order('purchase_date' { ascending: false});
  
  if (error) {
    console.error('Error fetching investments:', error);
    return []
  }
  return data
}

export async function addInvestments(investment: Investment) {
  const {data, error } = await supabase;
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

export async function updateInvestments(id: number, updates: partial<investment>) {
  const { data, error } = await supabase;
  .from('investments')
  .update(updates)
  .eq('id', id)
  .select()
  .single()
  
  if (error)
  console.error('Error updating investment:', error)
  throw error 
  
}

return data
}

export async function deleteInvestment(id: number) {
  const { error } = await supabase;
  .from('investments')
  .delete()
  .eq('id', id)
  
  if (error) {
    console.error('Error deleting investments:', error)
    throw error
  }
  return true
}

//sign up with email and password
export async function signUpWithEmail(email: string, passowrd:string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    passowrd
  });
  
  if (error) {
    console.error('Error signing up', error)
    throw error
  }
  return data
}

//signin with email and password
export async function signInWithEmail(email: string, password:string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('Error signing in', error)
    throw error
  }
  return data
}

//signin with google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithGoogle({
    provider: 'google',
    options:{
    redirectTo
  });
}

