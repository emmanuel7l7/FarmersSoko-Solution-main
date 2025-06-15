import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types
export type Profile = {
  id: string;
  role: 'admin' | 'farmer' | 'customer';
  created_at: string;
  updated_at: string;
};

// Create profiles table if it doesn't exist
export const initializeDatabase = async () => {
  try {
    // Check if profiles table exists
    const { error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (checkError) {
      console.log('Creating profiles table...');
      // Create profiles table
      const { error: createError } = await supabase.rpc('create_profiles_table');
      
      if (createError) {
        console.error('Error creating profiles table:', createError);
        throw createError;
      }
    }

    // Create RLS policies
    const { error: policyError } = await supabase.rpc('create_profiles_policies');
    
    if (policyError) {
      console.error('Error creating policies:', policyError);
      throw policyError;
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize database on module load
initializeDatabase(); 