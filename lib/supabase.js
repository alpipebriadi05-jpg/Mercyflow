import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

let supabase = null;
let supabaseConfigError = '';

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    supabaseConfigError = error?.message || 'Invalid Supabase configuration.';
  }
} else {
  supabaseConfigError = 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.';
}

export { supabase, supabaseConfigError };
export const supabaseConfigured = Boolean(supabase);
