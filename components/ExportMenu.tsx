'use client'

export function ExportMenu({ canvasData }: { canvasData: any }) {
  return (
    <div className="relative">
      <button className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
        Export
      </button>
    </div>
  )
}