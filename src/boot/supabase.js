import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kbphxbdxqzshovckiypx.supabase.co'
const supabaseKey = 'sb_publishable_pnUJ0y21Zg1OiW2oVN48mw_rlU8Mmq1'

export const supabase = createClient(supabaseUrl, supabaseKey)
