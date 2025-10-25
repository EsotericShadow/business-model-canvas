import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, createSession } from '@/lib/auth-database'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('Sign in attempt for email:', email)
    
    if (!email || !password) {
      console.log('Missing email or password')
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Check database connection
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not configured')
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Authenticate user
    console.log('Attempting to authenticate user...')
    const user = await authenticateUser(email, password)
    if (!user) {
      console.log('Authentication failed - invalid credentials')
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    console.log('User authenticated:', user.id, 'Email verified:', user.email_verified)

    // Check if email is verified
    if (!user.email_verified) {
      console.log('User email not verified')
      return NextResponse.json({ 
        error: 'Please verify your email address before signing in',
        needsVerification: true,
        userId: user.id
      }, { status: 403 })
    }

    // Create session
    console.log('Creating session for user:', user.id)
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

    console.log('Sign in successful for user:', user.id)
    return response
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json({ 
      error: 'Sign in failed', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 })
  }
}
