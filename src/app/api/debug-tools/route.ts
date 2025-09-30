import { createClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Check tools table with different approaches
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('*')
      .limit(10)
    
    // Try to get tools count
    const { count: toolsCount, error: toolsCountError } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true })
    
    // Check services table
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .limit(10)
    
    // Try to get services count
    const { count: servicesCount, error: servicesCountError } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
    
    // Check RLS policies (commented out - pg_policies not in types)
    // const { data: policies, error: policiesError } = await supabase
    //   .from('pg_policies')
    //   .select('*')
    //   .eq('schemaname', 'public')
    //   .in('tablename', ['tools', 'services'])
    const policies = null
    const policiesError = null
    
    return NextResponse.json({
      success: true,
      auth: {
        user: user?.id || null,
        error: authError
      },
      tools: {
        data: tools,
        error: toolsError,
        count: toolsCount,
        countError: toolsCountError,
        sample: tools?.slice(0, 3) || []
      },
      services: {
        data: services,
        error: servicesError,
        count: servicesCount,
        countError: servicesCountError,
        sample: services?.slice(0, 3) || []
      },
      policies: {
        data: policies,
        error: policiesError
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
