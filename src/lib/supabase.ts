import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function loginWithCode(code: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('invite_code', code)
    .single()
  if (error || !data) throw new Error('Invalid invite code')
  return data as import('./types').Profile
}
