'use client'

export function VersionHistory({ canvasId, onVersionRestored }: { canvasId: string, onVersionRestored: () => void }) {
  return (
    <button className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
      Version History
    </button>
  )
}