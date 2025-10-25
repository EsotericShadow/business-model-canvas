import { neon } from '@neondatabase/serverless'

// Database connection - lazy initialization
let _sql: ReturnType<typeof neon> | null = null

export const sql = (query: TemplateStringsArray, ...values: any[]) => {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    _sql = neon(process.env.DATABASE_URL)
  }
  return _sql(query, ...values)
}

// Database types are defined in lib/actions.ts
