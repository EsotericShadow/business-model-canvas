'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@stackframe/stack'
import { CanvasSection } from '@/components/CanvasSection'
import { AuthButton } from '@/components/AuthButton'
import { ExportMenu } from '@/components/ExportMenu'
import { VersionHistory } from '@/components/VersionHistory'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Toast } from '@/components/Toast'
import { getUserCanvas, saveCanvas, createOrUpdateUser, CanvasData } from '@/lib/actions'

interface CanvasDataState {
  keyPartners: string
  keyActivities: string
  valuePropositions: string
  customerRelationships: string
  customerSegments: string
  keyResources: string
  channels: string
  costStructure: string
  revenueStreams: string
}

export default function BusinessModelCanvas() {
  const user = useUser()
  const [canvasData, setCanvasData] = useState<CanvasDataState>({
    keyPartners: '',
    keyActivities: '',
    valuePropositions: '',
    customerRelationships: '',
    customerSegments: '',
    keyResources: '',
    channels: '',
    costStructure: '',
    revenueStreams: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [currentCanvasId, setCurrentCanvasId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'warning' | 'info' }>>([])

  // Toast notification functions
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 5000)
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Load canvas data when user changes
  useEffect(() => {
    const loadCanvas = async () => {
      if (user) {
        try {
          setIsLoading(true)
          // Create or update user in database
          await createOrUpdateUser({
            id: user.id,
            email: user.primaryEmail || '',
            name: user.displayName || ''
          })
          
          // Load user's canvas
          const userCanvas = await getUserCanvas(user.id)
          if (userCanvas) {
            setCanvasData({
              keyPartners: userCanvas.key_partners || '',
              keyActivities: userCanvas.key_activities || '',
              valuePropositions: userCanvas.value_propositions || '',
              customerRelationships: userCanvas.customer_relationships || '',
              customerSegments: userCanvas.customer_segments || '',
              keyResources: userCanvas.key_resources || '',
              channels: userCanvas.channels || '',
              costStructure: userCanvas.cost_structure || '',
              revenueStreams: userCanvas.revenue_streams || ''
            })
            setCurrentCanvasId(userCanvas.id)
          }
        } catch (error) {
          console.error('Error loading canvas:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        // Load demo canvas for non-authenticated users
        try {
          setIsLoading(true)
          const demoCanvas = await getUserCanvas('demo')
          if (demoCanvas) {
            setCanvasData({
              keyPartners: demoCanvas.key_partners || '',
              keyActivities: demoCanvas.key_activities || '',
              valuePropositions: demoCanvas.value_propositions || '',
              customerRelationships: demoCanvas.customer_relationships || '',
              customerSegments: demoCanvas.customer_segments || '',
              keyResources: demoCanvas.key_resources || '',
              channels: demoCanvas.channels || '',
              costStructure: demoCanvas.cost_structure || '',
              revenueStreams: demoCanvas.revenue_streams || ''
            })
            setCurrentCanvasId(demoCanvas.id)
          }
        } catch (error) {
          console.error('Error loading demo canvas:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadCanvas()
  }, [user])

  // Auto-save with debouncing
  const debouncedSave = useCallback(
    (data: CanvasDataState) => {
      if (!user) return
      
      const timeoutId = setTimeout(async () => {
        try {
          setIsSaving(true)
          await saveCanvas(user.id, {
            key_partners: data.keyPartners,
            key_activities: data.keyActivities,
            value_propositions: data.valuePropositions,
            customer_relationships: data.customerRelationships,
            customer_segments: data.customerSegments,
            key_resources: data.keyResources,
            channels: data.channels,
            cost_structure: data.costStructure,
            revenue_streams: data.revenueStreams
          })
          setLastSaved(new Date())
          showToast('Canvas saved successfully!', 'success')
        } catch (error) {
          console.error('Error saving canvas:', error)
          showToast('Failed to save canvas. Please try again.', 'error')
        } finally {
          setIsSaving(false)
        }
      }, 2000) // 2 second debounce
      
      return () => clearTimeout(timeoutId)
    },
    [user, showToast]
  )

  const updateCanvasData = (section: keyof CanvasDataState, value: string) => {
    const newData = {
      ...canvasData,
      [section]: value
    }
    setCanvasData(newData)
    debouncedSave(newData)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your canvas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Business Model Canvas</h1>
              <p className="text-gray-600">Plan and visualize your business model</p>
              {user && (
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  {isSaving && <span>💾 Saving...</span>}
                  {lastSaved && !isSaving && (
                    <span>✅ Saved {lastSaved.toLocaleTimeString()}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {user && currentCanvasId && (
                <>
                  <ExportMenu canvasData={canvasData} />
                  <VersionHistory 
                    canvasId={currentCanvasId} 
                    onVersionRestored={() => {
                      // Reload canvas data after version restore
                      window.location.reload()
                    }}
                  />
                </>
              )}
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="business-model-canvas">
          <CanvasSection
            title="Key Partners"
            content={canvasData.keyPartners}
            onUpdate={(value) => updateCanvasData('keyPartners', value)}
          />
          <CanvasSection
            title="Key Activities"
            content={canvasData.keyActivities}
            onUpdate={(value) => updateCanvasData('keyActivities', value)}
          />
          <CanvasSection
            title="Value Propositions"
            content={canvasData.valuePropositions}
            onUpdate={(value) => updateCanvasData('valuePropositions', value)}
          />
          <CanvasSection
            title="Customer Relationships"
            content={canvasData.customerRelationships}
            onUpdate={(value) => updateCanvasData('customerRelationships', value)}
          />
          <CanvasSection
            title="Customer Segments"
            content={canvasData.customerSegments}
            onUpdate={(value) => updateCanvasData('customerSegments', value)}
          />
          <CanvasSection
            title="Key Resources"
            content={canvasData.keyResources}
            onUpdate={(value) => updateCanvasData('keyResources', value)}
          />
          <CanvasSection
            title="Channels"
            content={canvasData.channels}
            onUpdate={(value) => updateCanvasData('channels', value)}
          />
          <CanvasSection
            title="Cost Structure"
            content={canvasData.costStructure}
            onUpdate={(value) => updateCanvasData('costStructure', value)}
          />
          <CanvasSection
            title="Revenue Streams"
            content={canvasData.revenueStreams}
            onUpdate={(value) => updateCanvasData('revenueStreams', value)}
          />
        </div>
          </main>

          <footer className="bg-white border-t mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <p className="text-center text-gray-500 text-sm">
                Business Model Canvas Tool
              </p>
            </div>
          </footer>

          {/* Toast Notifications */}
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      )
    }