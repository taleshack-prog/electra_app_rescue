import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nhogtlycbbfvkdnzklyy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7UXE-1W8_4jPq9R5rr-Gig_WMdg1ZxV';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
