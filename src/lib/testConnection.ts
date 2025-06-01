import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_STAGING_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_STAGING_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1)
    
    if (error) {
      console.error('Error connecting to database:', error)
      return
    }
    
    console.log('Successfully connected to database!')
    console.log('Data:', data)
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

testConnection() 