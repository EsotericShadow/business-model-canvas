'use client'

import { useState } from 'react'
import { MobileSectionPopup } from './MobileSectionPopup'

interface CanvasData {
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

interface MobileCanvasOverviewProps {
  canvasData: CanvasData
  onUpdate: (section: keyof CanvasData, value: string) => void
}

export function MobileCanvasOverview({ canvasData, onUpdate }: MobileCanvasOverviewProps) {
  const [activePopup, setActivePopup] = useState<keyof CanvasData | null>(null)

  const sections = [
    {
      key: 'keyPartners' as keyof CanvasData,
      title: 'Key Partners',
      icon: '🤝',
      description: 'Who are your key partners?',
      content: canvasData.keyPartners,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      key: 'keyActivities' as keyof CanvasData,
      title: 'Key Activities',
      icon: '⚡',
      description: 'What key activities do you perform?',
      content: canvasData.keyActivities,
      color: 'bg-green-50 border-green-200'
    },
    {
      key: 'keyResources' as keyof CanvasData,
      title: 'Key Resources',
      icon: '💎',
      description: 'What key resources do you need?',
      content: canvasData.keyResources,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      key: 'valuePropositions' as keyof CanvasData,
      title: 'Value Propositions',
      icon: '💡',
      description: 'What value do you deliver?',
      content: canvasData.valuePropositions,
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      key: 'customerRelationships' as keyof CanvasData,
      title: 'Customer Relationships',
      icon: '❤️',
      description: 'How do you interact with customers?',
      content: canvasData.customerRelationships,
      color: 'bg-pink-50 border-pink-200'
    },
    {
      key: 'channels' as keyof CanvasData,
      title: 'Channels',
      icon: '📢',
      description: 'How do you reach customers?',
      content: canvasData.channels,
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      key: 'customerSegments' as keyof CanvasData,
      title: 'Customer Segments',
      icon: '👥',
      description: 'Who are your customers?',
      content: canvasData.customerSegments,
      color: 'bg-orange-50 border-orange-200'
    },
    {
      key: 'costStructure' as keyof CanvasData,
      title: 'Cost Structure',
      icon: '💰',
      description: 'What are your major costs?',
      content: canvasData.costStructure,
      color: 'bg-red-50 border-red-200'
    },
    {
      key: 'revenueStreams' as keyof CanvasData,
      title: 'Revenue Streams',
      icon: '💵',
      description: 'How do you make money?',
      content: canvasData.revenueStreams,
      color: 'bg-emerald-50 border-emerald-200'
    }
  ]

  const handleSectionClick = (sectionKey: keyof CanvasData) => {
    setActivePopup(sectionKey)
  }

  const handleUpdate = (section: keyof CanvasData, value: string) => {
    onUpdate(section, value)
    setActivePopup(null)
  }

  const activeSection = sections.find(s => s.key === activePopup)

  return (
    <>
      {/* Mobile Canvas Overview */}
      <div className="md:hidden p-4 space-y-3">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Business Model Canvas</h1>
          <p className="text-gray-600">Tap any section to edit</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => handleSectionClick(section.key)}
              className={`p-4 rounded-lg border-2 ${section.color} hover:shadow-md transition-all text-left bg-white`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{section.icon}</span>
                <h3 className="font-semibold text-black">{section.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{section.description}</p>
              <div className="text-sm text-black line-clamp-2">
                {section.content || `Tap to add ${section.title.toLowerCase()}...`}
              </div>
              {section.content && (
                <div className="mt-2 text-xs text-gray-500">
                  {section.content.length} characters
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Tap any section above to open a full-screen editor
          </p>
        </div>
      </div>

      {/* Mobile Section Popup */}
      {activeSection && (
        <MobileSectionPopup
          isOpen={true}
          onClose={() => setActivePopup(null)}
          title={activeSection.title}
          content={activeSection.content}
          onUpdate={(value) => handleUpdate(activeSection.key, value)}
          icon={activeSection.icon}
          description={activeSection.description}
        />
      )}
    </>
  )
}
