'use client'

import { exportToJSON, exportToPNG, exportToPDF } from '@/lib/export'

interface ExportMenuProps {
  canvasData: {
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
}

export function ExportMenu({ canvasData }: ExportMenuProps) {
  const handleExportJSON = () => {
    exportToJSON(canvasData)
  }

  const handleExportPNG = async () => {
    try {
      await exportToPNG()
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  const handleExportPDF = async () => {
    try {
      await exportToPDF()
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  return (
    <div className="relative group">
      <button className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
        Export
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <button
          onClick={handleExportJSON}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
        >
          Export to JSON
        </button>
        <button
          onClick={handleExportPNG}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Export to PNG
        </button>
        <button
          onClick={handleExportPDF}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md"
        >
          Export to PDF
        </button>
      </div>
    </div>
  )
}