import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth-database'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ 
        error: 'Password must be at least 8 characters long' 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Please enter a valid email address' 
      }, { status: 400 })
    }

    // Create user
    const user = await createUser(email, password, name)

    // In a real app, you would send a verification email here
    // For now, we'll just return the verification token for testing
    const response = NextResponse.json({ 
      success: true, 
      message: 'Account created successfully. Please check your email for verification.',
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        email_verified: user.email_verified
      },
      // In development, include the verification token for testing
      ...(process.env.NODE_ENV === 'development' && {
        verification_token: user.verification_token
      })
    })

    return response
  } catch (error: any) {
    console.error('Sign up error:', error)
    
    if (error.message.includes('already exists')) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }
    
    return NextResponse.json({ error: 'Sign up failed' }, { status: 500 })
  }
}
