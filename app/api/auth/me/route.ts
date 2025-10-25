import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromSession, getUserById } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value
    
    if (!sessionId) {
      return NextResponse.json({ user: null })
    }

    const userId = getUserIdFromSession(sessionId)
    if (!userId) {
      return NextResponse.json({ user: null })
    }

    const user = getUserById(userId)
    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ user: null })
  }
}
