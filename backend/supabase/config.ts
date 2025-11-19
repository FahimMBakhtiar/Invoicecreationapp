import { createClient } from '@jsr/supabase__supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Better error messages for debugging
if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL environment variable');
  console.error('💡 Make sure you have a .env file in the frontend/ directory with:');
  console.error('   VITE_SUPABASE_URL=your_supabase_project_url');
  throw new Error('Missing VITE_SUPABASE_URL environment variable. Check console for details.');
}

if (!supabaseAnonKey) {
  console.error('❌ Missing VITE_SUPABASE_ANON_KEY environment variable');
  console.error('💡 Make sure you have a .env file in the frontend/ directory with:');
  console.error('   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable. Check console for details.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

