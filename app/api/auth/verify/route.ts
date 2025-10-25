import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailToken } from '@/lib/auth-enhanced'

export async function POST(request: NextRequest) {
  try {
    const { userId, token } = await request.json()
    
    if (!userId || !token) {
      return NextResponse.json({ error: 'User ID and verification token are required' }, { status: 400 })
    }

    // Verify email token
    const success = verifyEmailToken(userId, token)
    
    if (!success) {
      return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully' 
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json({ error: 'Email verification failed' }, { status: 500 })
  }
}
