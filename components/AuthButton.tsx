'use client'

import { useUser, useStackApp } from '@stackframe/stack'

export function AuthButton() {
  const user = useUser()
  const app = useStackApp()

  const handleSignIn = () => {
    app.redirectToSignIn()
  }

  const handleSignOut = async () => {
    await user?.signOut()
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Welcome, {user.displayName || user.primaryEmail || 'User'}
        </span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      Sign In
    </button>
  )
}