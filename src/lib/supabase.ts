import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  toast.error('Missing Supabase configuration. Please check your environment variables.');
  console.error('Required environment variables are missing:', {
    VITE_SUPABASE_URL: supabaseUrl ? '✓' : '✗',
    VITE_SUPABASE_ANON_KEY: supabaseKey ? '✓' : '✗'
  });
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseKey || 'placeholder-key'
);