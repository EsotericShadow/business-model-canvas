'use client'

import { useState, useEffect } from 'react'
import { getCanvasVersions, restoreVersion, CanvasVersion } from '@/lib/actions'

interface VersionHistoryProps {
  canvasId: string
  onVersionRestored: () => void
}

export function VersionHistory({ canvasId, onVersionRestored }: VersionHistoryProps) {
  const [versions, setVersions] = useState<CanvasVersion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRestoring, setIsRestoring] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && canvasId) {
      loadVersions()
    }
  }, [isOpen, canvasId])

  const loadVersions = async () => {
    setIsLoading(true)
    try {
      const versionList = await getCanvasVersions(canvasId)
      setVersions(versionList as CanvasVersion[])
    } catch (error) {
      console.error('Error loading versions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async (versionId: string) => {
    if (!confirm('Are you sure you want to restore this version? This will overwrite your current canvas.')) {
      return
    }

    setIsRestoring(versionId)
    try {
      await restoreVersion(canvasId, versionId)
      onVersionRestored()
      setIsOpen(false)
    } catch (error) {
      console.error('Error restoring version:', error)
      alert('Failed to restore version. Please try again.')
    } finally {
      setIsRestoring(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2"
      >
        📚 History
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 border max-h-96 overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">Version History</h3>
            <p className="text-sm text-gray-600">Restore a previous version of your canvas</p>
          </div>
          
          <div className="p-2">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading versions...</p>
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600">No saved versions yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {versions.map((version) => (
                  <div key={version.id} className="p-3 border rounded hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(version.saved_at)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {version.value_propositions?.substring(0, 50)}...
                        </p>
                      </div>
                      <button
                        onClick={() => handleRestore(version.id)}
                        disabled={isRestoring === version.id}
                        className="ml-2 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isRestoring === version.id ? 'Restoring...' : 'Restore'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
