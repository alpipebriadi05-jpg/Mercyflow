import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
// Supabase supports both the newer publishable key and the legacy anon key.
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

let supabase = null;
let supabaseConfigError = '';

if (!supabaseUrl || !supabaseKey) {
  supabaseConfigError =
    'Mercyflow authentication is not configured. Add VITE_SUPABASE_URL and either VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY in Vercel.';
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    supabaseConfigError = error?.message || 'Invalid Supabase configuration.';
  }
}

export { supabase, supabaseConfigError };
export const supabaseConfigured = Boolean(supabase);
