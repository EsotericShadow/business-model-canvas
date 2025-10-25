import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    // Run migration 001: Initial schema
    const migration001 = fs.readFileSync(path.join(process.cwd(), 'migrations/001_initial_schema.sql'), 'utf8')
    console.log('Running migration 001...')
    
    // Split by semicolon and execute each statement
    const statements001 = migration001.split(';').filter(stmt => stmt.trim())
    for (const statement of statements001) {
      if (statement.trim()) {
        await sql.unsafe(statement.trim())
      }
    }
    console.log('✅ Migration 001 completed')
    
    // Run migration 003: Password auth
    const migration003 = fs.readFileSync(path.join(process.cwd(), 'migrations/003_add_password_auth.sql'), 'utf8')
    console.log('Running migration 003...')
    
    // Split by semicolon and execute each statement
    const statements003 = migration003.split(';').filter(stmt => stmt.trim())
    for (const statement of statements003) {
      if (statement.trim()) {
        await sql.unsafe(statement.trim())
      }
    }
    console.log('✅ Migration 003 completed')
    
    return NextResponse.json({ 
      success: true, 
      message: 'All migrations completed successfully!' 
    })
  } catch (error: any) {
    console.error('Migration failed:', error)
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error.message 
    }, { status: 500 })
  }
}
