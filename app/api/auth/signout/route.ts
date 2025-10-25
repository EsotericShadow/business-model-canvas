import { NextRequest, NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth-database'

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value
    
    if (sessionId) {
      deleteSession(sessionId)
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete('session')
    
    return response
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json({ error: 'Sign out failed' }, { status: 500 })
  }
}
