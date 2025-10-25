'use client'

import React, { useState, useEffect } from 'react'

interface CookieConsentProps {
  onAccept: () => void
  onDecline: () => void
}

export function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
    onAccept()
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setIsVisible(false)
    onDecline()
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cookie Consent
            </h3>
            <p className="text-sm text-gray-600 mb-4 sm:mb-0">
              We use cookies to enhance your experience, analyze site traffic, and personalize content. 
              By clicking &quot;Accept All&quot;, you consent to our use of cookies. You can manage your preferences 
              or learn more in our{' '}
              <a 
                href="/privacy" 
                className="text-blue-600 hover:text-blue-800 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Cookie consent provider
export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<string | null>(null)

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie-consent')
    setConsent(storedConsent)
  }, [])

  const handleAccept = () => {
    setConsent('accepted')
    // Enable analytics and other tracking
    console.log('Cookies accepted - analytics enabled')
  }

  const handleDecline = () => {
    setConsent('declined')
    // Disable analytics and tracking
    console.log('Cookies declined - analytics disabled')
  }

  return (
    <>
      {children}
      <CookieConsent onAccept={handleAccept} onDecline={handleDecline} />
    </>
  )
}
