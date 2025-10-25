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
    const signInUrl = await stackServerApp.getSignInUrl({
      afterAuthReturnTo,
    })
    
    return NextResponse.redirect(signInUrl)
  } catch (error) {
    console.error('Sign-in error:', error)
    return NextResponse.redirect('/?error=signin_failed')
  }
}
