import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

// For development, provide fallback values if env vars are not set
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder_key';

const finalUrl = supabaseUrl && supabaseUrl !== 'your_supabase_url_here' && supabaseUrl !== 'https://your-project.supabase.co' 
  ? supabaseUrl 
  : fallbackUrl;

const finalKey = supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here' 
  ? supabaseAnonKey 
  : fallbackKey;

// Only show warning in development
if (import.meta.env.DEV && (finalUrl === fallbackUrl || finalKey === fallbackKey)) {
  console.warn('⚠️ Using placeholder Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

export const supabase = createClient(finalUrl, finalKey);