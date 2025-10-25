import { getCanvasByShareToken } from '@/lib/actions'
import { CanvasSection } from '@/components/CanvasSection'
import Link from 'next/link'

interface SharePageProps {
  params: {
    token: string
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const canvas = await getCanvasByShareToken(params.token)

  if (!canvas) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Canvas Not Found</h1>
          <p className="text-gray-600 mb-6">This canvas may have been deleted or the link is invalid.</p>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Your Own Canvas
          </Link>
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
              <p className="text-gray-600">Shared canvas - read only</p>
            </div>
            <Link 
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Your Own
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="business-model-canvas">
          <CanvasSection
            title="Key Partners"
            content={canvas.key_partners || ''}
            onUpdate={() => {}} // Read-only
            className="read-only"
          />
          <CanvasSection
            title="Key Activities"
            content={canvas.key_activities || ''}
            onUpdate={() => {}} // Read-only
            className="read-only"
          />
          <CanvasSection
            title="Value Propositions"
            content={canvas.value_propositions || ''}
            onUpdate={() => {}} // Read-only
            className="read-only"
          />
          <CanvasSection
            title="Customer Relationships"
            content={canvas.customer_relationships || ''}
            onUpdate={() => {}} // Read-only
            className="read-only"
          />
          <CanvasSection
            title="Customer Segments"
            content={canvas.customer_segments || ''}
            onUpdate={() => {}} // Read-only
            className="read-only"
          />
          <CanvasSection
            title="Key Resources"
            content={canvas.key_resources || ''}
            onUpdate={() => {}} // Read-only
            className="read-only"
          />
          <CanvasSection
            title="Channels"
            content={canvas.channels || ''}
            onUpdate={() => {}} // Read-only
            className="read-only"
          />
          <CanvasSection
            title="Cost Structure"
            content={canvas.cost_structure || ''}
            onUpdate={() => {}} // Read-only
            className="read-only"
          />
          <CanvasSection
            title="Revenue Streams"
            content={canvas.revenue_streams || ''}
            onUpdate={() => {}} // Read-only
            className="read-only"
          />
        </div>
      </main>

      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            Business Model Canvas Tool - Shared View
          </p>
        </div>
      </footer>
    </div>
  )
}
