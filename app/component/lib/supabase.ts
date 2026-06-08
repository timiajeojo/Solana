
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// Types
// ============================================

export interface Withdrawal {
  id?:            number;
  user_id:        string;
  amount:         number;
  wallet_name:    string;
  wallet_address: string;
  status?:        'pending' | 'completed' | 'failed';
  created_at?:    string;
}

export interface Deposit {
  id?:         number;
  user_id:     string;
  amount:      number;
  plan:        string;
  status?:     'pending' | 'completed' | 'failed';
  created_at?: string;
}

// withdrwal function

export async function addWithdrawal(withdrawal: Withdrawal) {
  const { data, error } = await supabase
    .from('withdrawals')
    .insert([withdrawal])
    .select()
    .single();

  if (error) {
    console.error('Error adding withdrawal:', error);
    throw error;
  }
  return data;
}

export async function getWithdrawals(userId: string) {
  const { data, error } = await supabase
    .from('withdrawals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching withdrawals:', error);
    return [];
  }
  return data;
}

// ─── Deposit Functions ────────────────────────────────────────────────────────

export async function addDeposit(deposit: Deposit) {
  const { data, error } = await supabase
    .from('deposits')
    .insert([deposit])
    .select()
    .single();

  if (error) {
    console.error('Error adding deposit:', error);
    throw error;
  }
  return data;
}

export async function getDeposits(userId: string) {
  const { data, error } = await supabase
    .from('deposits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching deposits:', error);
    return [];
  }
  return data;
}


// ─── Combined History ─────────────────────────────────────────────────────────
// Fetches investments, withdrawals, and deposits in parallel
// and returns them merged and sorted newest-first.

export async function getFullHistory(userId: string) {
  const [investments, withdrawals, deposits] = await Promise.all([
    getInvestments(userId),
    getWithdrawals(userId),
    getDeposits(userId),
  ]);

  const mapped = [
    ...(investments ?? []).map((i: any) => ({
      id:         `inv-${i.id}`,
      type:       'investment' as const,
      amount:     i.amount,
      sol_amount: i.sol_amount,
      sol_price:  i.sol_price,
      status:     'completed' as const,
      plan:       '-',
      date:       i.purchase_date ?? i.created_at,
    })),
    ...(withdrawals ?? []).map((w: any) => ({
      id:            `wd-${w.id}`,
      type:          'withdrawal' as const,
      amount:        w.amount,
      wallet_name:   w.wallet_name,
      wallet_address:w.wallet_address,
      status:        w.status,
      plan:          '-',
      date:          w.created_at,
    })),
    ...(deposits ?? []).map((d: any) => ({
      id:     `dep-${d.id}`,
      type:   'deposit' as const,
      amount: d.amount,
      status: d.status,
      plan:   d.plan,
      date:   d.created_at,
    })),
  ];

// ============================================
// Profile Functions
// ============================================

export async function createUserProfile(userId: string, firstName: string, lastName: string) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        first_name: firstName,
        last_name: lastName,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    throw error;
  }

  return data;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return data;
}

// ============================================
// Investment Functions
// ============================================

export async function getInvestments(userId: string) {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', userId)
    .order('purchase_date', { ascending: false });

  if (error) {
    console.error('Error fetching investments:', error);
    return [];
  }

  return data;
}

export async function addInvestment(investment: Investment) {
  const { data, error } = await supabase
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

export async function updateInvestment(id: number, updates: Partial<Investment>) {
  const { data, error } = await supabase
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

export async function deleteInvestment(id: number) {
  const { error } = await supabase
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
// Authentication Functions
// ============================================

export async function signUpWithEmail(
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name:  lastName,
      },
    },
  });

  if (error) {
    console.error('Error signing up:', error);
    throw error;
  }

  if (data.user) {
    try {
      await createUserProfile(data.user.id, firstName, lastName);
    } catch (profileError) {
      console.error('Error creating profile:', profileError);
    }
  }

  return data;
}

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

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
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

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getting user:', error);
    return null;
  }

  return user;
}

export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null);
  });
  
  // Sort newest first
  return mapped.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
}