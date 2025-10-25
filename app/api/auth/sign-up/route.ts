import { NextRequest, NextResponse } from 'next/server'
import { StackServerApp } from '@stackframe/stack'

const stackServerApp = new StackServerApp({
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY!,
})

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const afterAuthReturnTo = url.searchParams.get('after_auth_return_to') || '/'
  
  try {
    const signUpUrl = await stackServerApp.getSignUpUrl({
      afterAuthReturnTo,
    })
    
    return NextResponse.redirect(signUpUrl)
  } catch (error) {
    console.error('Sign-up error:', error)
    return NextResponse.redirect('/?error=signup_failed')
  }
}
