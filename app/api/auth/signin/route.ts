import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail, createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user exists, create if not
    let user = getUserByEmail(email)
    if (!user) {
      user = createUser(email, name)
    }

    // Create session
    const sessionId = createSession(user.id)

    // Set session cookie
    const response = NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name }
    })
    
    response.cookies.set('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json({ error: 'Sign in failed' }, { status: 500 })
  }
}
