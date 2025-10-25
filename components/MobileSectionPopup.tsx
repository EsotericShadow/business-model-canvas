'use client'

import { useState, useEffect } from 'react'

interface MobileSectionPopupProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
  onUpdate: (value: string) => void
  icon: string
  description: string
}

export function MobileSectionPopup({ 
  isOpen, 
  onClose, 
  title, 
  content, 
  onUpdate, 
  icon, 
  description 
}: MobileSectionPopupProps) {
  const [localContent, setLocalContent] = useState(content)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setLocalContent(content)
    setHasChanges(false)
  }, [content, isOpen])

  const handleSave = () => {
    onUpdate(localContent)
    setHasChanges(false)
    onClose()
  }

  const handleCancel = () => {
    setLocalContent(content)
    setHasChanges(false)
    onClose()
  }

  const handleContentChange = (value: string) => {
    setLocalContent(value)
    setHasChanges(value !== content)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <textarea
            value={localContent}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full h-full resize-none border-none outline-none text-base leading-relaxed"
            placeholder={`Enter your ${title.toLowerCase()}...`}
            autoFocus
            style={{ minHeight: '300px' }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="text-sm text-gray-500">
            {localContent.length} characters
            {hasChanges && <span className="ml-2 text-amber-600">• Unsaved changes</span>}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={!hasChanges}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
