import { neon } from '@neondatabase/serverless'

// Database connection with connection pooling and optimization
let _sql: ReturnType<typeof neon> | null = null

export const sql = (query: TemplateStringsArray, ...values: any[]) => {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    
    // Configure connection with optimization
    _sql = neon(process.env.DATABASE_URL, {
      // Query optimization for serverless
      fetchOptions: {
        cache: 'no-store', // Disable caching for real-time data
      }
    })
  }
  return _sql(query, ...values)
}

// Health check function for database
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const result = await sql`SELECT 1 as health_check` as any[]
    return result && result.length > 0
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

// Database types are defined in lib/actions.ts
