import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nbckqasfhtdhiublaebj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iY2txYXNmaHRkaGl1YmxhZWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNTc3MzgsImV4cCI6MjA5MjYzMzczOH0.avcPb-i5j2P72oY5uOA2evVGJ26_z4RNLCFsfaUOHNA'

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
