import { NextResponse } from 'next/server'
import { healthCheck } from '@/lib/env'

export async function GET() {
  try {
    const health = await healthCheck()
    
    if (health.status === 'healthy') {
      return NextResponse.json(health, { status: 200 })
    } else {
      return NextResponse.json(health, { status: 503 })
    }
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Health check failed',
        checks: {
          database: false,
          auth: false,
          environment: false
        }
      }, 
      { status: 503 }
    )
  }
}
