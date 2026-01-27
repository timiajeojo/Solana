import { createClient  } from '@supabase/supabase-js';

const supabaseUrl = process.env.https://exfvkdeewzlneuhldtfq.supabase.co;
const supabaseAnonKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZnZrZGVld3psbmV1aGxkdGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NjY0OTMsImV4cCI6MjA4NTA0MjQ5M30.9ObubipBEglL5b5puBPx_q40pTTvpzrJ5T3QdCt1yu8;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing supabase environment variable. Please check your .env.local file ');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Investment {
  
}