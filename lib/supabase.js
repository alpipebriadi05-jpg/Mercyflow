import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

let supabase = null;
let supabaseConfigError = '';

if (!supabaseUrl || !supabasePublishableKey) {
  supabaseConfigError =
    'Mercyflow authentication is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel.';
} else {
  try {
    supabase = createClient(supabaseUrl, supabasePublishableKey, {
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
