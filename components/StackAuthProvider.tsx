'use client'

import { StackProvider, StackClientApp } from '@stackframe/stack'
import { useEffect, useState } from 'react'

export function StackAuthProvider({ children }: { children: React.ReactNode }) {
  const [stackApp, setStackApp] = useState<any>(null)

  useEffect(() => {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      const app = new StackClientApp({
        projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
        publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
        tokenStore: 'nextjs-cookie',
      })
      setStackApp(app)
    }
  }, [])

  if (!stackApp) {
    return <>{children}</>
  }

  return (
    <StackProvider app={stackApp as any}>
      {children}
    </StackProvider>
  )
}