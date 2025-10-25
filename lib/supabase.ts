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

// Database types
export interface CanvasData {
  id?: string
  user_id?: string
  title: string
  key_partners: string
  key_activities: string
  value_propositions: string
  customer_relationships: string
  customer_segments: string
  key_resources: string
  channels: string
  cost_structure: string
  revenue_streams: string
  is_public?: boolean
  created_at?: string
  updated_at?: string
}

export interface User {
  id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
}
