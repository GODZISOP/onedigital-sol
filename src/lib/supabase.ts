import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xixdylkqqyvagpdlglay.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_gbRiD0N1xjEx1Fow1DnKDw_6aWxkfXx';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
