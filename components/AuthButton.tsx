'use client'

import { useState, useEffect } from 'react'
import { AuthModal } from './AuthModal'

interface User {
  id: string
  email: string
  name?: string
}

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    // Check if user is signed in
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setUser(data.user)
        setIsLoading(false)
      })
      .catch(() => {
        setUser(null)
        setIsLoading(false)
      })
  }, [])

  const handleSignInSuccess = (userData: User) => {
    setUser(userData)
    setShowAuthModal(false)
    window.location.reload() // Refresh to update the page
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      setUser(null)
      window.location.reload() // Refresh to update the page
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-2 text-sm text-gray-500">
        Loading...
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Welcome, {user.name || user.email}
        </span>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        Sign In
      </button>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleSignInSuccess}
      />
    </>
  )
}