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
  }
}