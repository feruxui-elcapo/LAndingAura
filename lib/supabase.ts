
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file at project root.');
}

// Avoid using obvious placeholders and provide helpful guidance if misconfigured
const isPlaceholder = (u: string | undefined) => !u || u.includes('your-project') || u.includes('placeholder');

if (isPlaceholder(supabaseUrl)) {
    console.error('Supabase URL appears to be a placeholder (your-project.supabase.co). Replace it with your real Supabase project URL in VITE_SUPABASE_URL.');
}

const url = supabaseUrl || '';
const key = supabaseAnonKey || '';

export const supabase = createClient(url, key);

