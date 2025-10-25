'use client'

import { StackProvider, StackClientApp } from '@stackframe/stack'
import { useEffect, useState } from 'react'

export function StackAuthProvider({ children }: { children: React.ReactNode }) {
  const [stackApp, setStackApp] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      const app = new StackClientApp({
        projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
        publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
        tokenStore: 'nextjs-cookie',
        urls: {
          signIn: '/api/auth/sign-in',
          signUp: '/api/auth/sign-up',
          afterSignIn: '/',
          afterSignUp: '/',
        }
      })
      setStackApp(app)
    }
  }, [])

  // Don't render until client-side and stackApp is ready
  if (!isClient || !stackApp) {
    return <div>Loading...</div>
  }

  return (
    <StackProvider app={stackApp as any}>
      {children}
    </StackProvider>
  )
}