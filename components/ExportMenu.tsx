'use client'

import { useState } from 'react'
import { exportToJSON, exportToPNG, exportToPDF, CanvasExportData } from '@/lib/export'

interface ExportMenuProps {
  canvasData: CanvasExportData
}

export function ExportMenu({ canvasData }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (type: 'json' | 'png' | 'pdf') => {
    setIsExporting(true)
    try {
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `business-model-canvas-${timestamp}`
      
      switch (type) {
        case 'json':
          exportToJSON(canvasData, `${filename}.json`)
          break
        case 'png':
          await exportToPNG(`${filename}.png`)
          break
        case 'pdf':
          await exportToPDF(`${filename}.pdf`)
          break
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
      >
        {isExporting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Exporting...
          </>
        ) : (
          <>
            📄 Export
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
          <div className="py-1">
            <button
              onClick={() => handleExport('json')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              📄 JSON
            </button>
            <button
              onClick={() => handleExport('png')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              🖼️ PNG
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              📋 PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
