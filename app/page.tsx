'use client'

import { useState } from 'react'
import { 
  Users, 
  Activity, 
  Gift, 
  Heart, 
  Wrench, 
  Truck, 
  DollarSign, 
  Factory,
  Link
} from 'lucide-react'

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

export default function BusinessModelCanvas() {
  const [canvasData, setCanvasData] = useState<CanvasData>({
    keyPartners: 'HostPapa\nOpenAI\nVercel\nCursor\nMy consultant\nAccountant / Bookkeeper\nChamber of Commerce\nEvent venues\nWave',
    keyActivities: 'Discovery:\n• Understand business\n• Paper / online processes\n• Bottlenecks\n• Assets\n• Define scope\n\nEstablish clear expectations:\n• What are we building?\n• Why are we building it?\n• Who are we building it for?\n• Where are we building it? (Domain, host)',
    valuePropositions: 'Evergreen Web Solutions exists to move the North forward.\n\nWe build real tools — not trends — that help local businesses work smarter, grow faster, and stay independent in a world that\'s getting automated, whether we like it or not.\n\nWe believe technology should serve people, not replace them.\nOur mission is to bridge that gap — bringing small-town grit and modern systems together so the next generation of Northern businesses can compete on a global level without losing what makes them real.\n\nWe see a North where every business feels at home in the digital world — confident in their systems, clear on their direction, and proud of what they\'ve built.\n\nWe help Northern businesses run smarter — from websites, apps, to automation and AI.\nEverything we build is meant to save time, cut confusion, and keep your systems working the way they should.',
    customerRelationships: 'Personalized consultation and long-term partnership model\n\nContinuous support through automation monitoring and optimization\n\nEducational approach — guiding clients through digital maturity\n\nRelationship built on trust, transparency, and measurable progress',
    customerSegments: '🐇 RABBITS - Small/New Businesses\n• 1-20 employees, $100K-$500K revenue\n• Pain: No web presence, options unclear\n• Gain: Clear digital strategy, saves time\n\n🦌 DEER - Growing SMBs\n• 20-100 employees, $500K-$5M revenue\n• Pain: No digital direction, inefficient processes\n• Gain: More productive, efficient, profitable\n\n🐘 ELEPHANTS - Large Organizations\n• 100+ employees, $5M+ revenue\n• Pain: Pressure to adopt, messy systems\n• Gain: Stakeholder peace of mind, 40% more productive',
    keyResources: 'Fixed Costs:\nMonthly:\n• Vercel\n• Cursor\n• XAI ChatGPT\n• Canva (~$250/month)\n\nYearly:\n• Domain ($25)\n• Chamber membership\n• Insurance\n\nOther Resources:\n• Address\n• Business cards\n• Filing cabinet\n• Desk\n• Socials / Website\n• Laptop / Desktop\n• 30-second pitch\n• Vehicle\n• Phone\n• Insurance\n• Google Reviews\n• Bank account\n• Business license',
    channels: 'Facebook / LinkedIn\nPrint media (newspaper)\nChamber of Commerce\nWord of mouth\nCommunity organizations',
    costStructure: 'Fixed Costs (Monthly):\n• Vercel, Cursor, Canva: ~$250/month\n• XAI chatbot: Monthly subscription\n• Domain: Yearly renewal\n• Chamber membership: Annual fee\n• Insurance: Annual premium\n\nVariable Costs:\n• Project expenses: Development time, third-party services\n• Event costs: Venue rental, catering, marketing\n• Travel: Client meetings, conferences, networking\n• Materials: Business cards, marketing materials',
    revenueStreams: 'Service hourly rate – $95\nConsultation rate – $250\nBase website – $1,000\nSupport package – $50/month\nCollecting payment: Wave, accounting, crypto/cash'
  })

  const updateCanvasData = (section: keyof CanvasData, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      [section]: value
    }))
  }

  const CanvasSection = ({ 
    title, 
    icon: Icon, 
    section, 
    subtitle, 
    placeholder,
    className
  }: { 
    title: string
    icon: any
    section: keyof CanvasData
    subtitle?: string
    placeholder?: string
    className?: string
  }) => (
    <div className={`canvas-section ${className}`}>
      <div className="canvas-section-title">
        <Icon className="canvas-section-icon" />
        {title}
      </div>
      {subtitle && <div className="canvas-section-subtitle">{subtitle}</div>}
      <textarea
        className="canvas-textarea"
        value={canvasData[section]}
        onChange={(e) => updateCanvasData(section, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )

  return (
    <div className="business-model-canvas">
      {/* Header */}
      <div className="canvas-header">
        <h1 className="canvas-title">The Business Model Canvas</h1>
        <div className="canvas-metadata">
          <div>
            <span>Designed for:</span>
            <input type="text" placeholder="Evergreen Web Solutions" />
          </div>
          <div>
            <span>Designed by:</span>
            <input type="text" placeholder="Gabriel Lacroix" />
          </div>
          <div>
            <span>Date:</span>
            <input type="text" placeholder={new Date().toLocaleDateString()} />
          </div>
          <div>
            <span>Version:</span>
            <input type="text" placeholder="1.0" />
          </div>
        </div>
      </div>

      {/* Canvas Grid - Exact Layout from Image */}
      <CanvasSection
        title="Key Partners"
        icon={Link}
        section="keyPartners"
        subtitle="Who are our Key Partners?"
        placeholder="List your key partners, suppliers, and strategic alliances..."
        className="key-partners"
      />
      
      <CanvasSection
        title="Key Activities"
        icon={Activity}
        section="keyActivities"
        subtitle="What Key Activities do our Value Propositions require?"
        placeholder="List your core business activities..."
        className="key-activities"
      />
      
      <CanvasSection
        title="Value Propositions"
        icon={Gift}
        section="valuePropositions"
        subtitle="What value do we deliver to the customer?"
        placeholder="Describe your unique value propositions..."
        className="value-propositions"
      />
      
      <CanvasSection
        title="Customer Relationships"
        icon={Heart}
        section="customerRelationships"
        subtitle="What type of relationship does each Customer Segment expect?"
        placeholder="Describe how you build and maintain customer relationships..."
        className="customer-relationships"
      />
      
      <CanvasSection
        title="Customer Segments"
        icon={Users}
        section="customerSegments"
        subtitle="For whom are we creating value?"
        placeholder="List your target customer segments..."
        className="customer-segments"
      />

      <CanvasSection
        title="Key Resources"
        icon={Wrench}
        section="keyResources"
        subtitle="What Key Resources do our Value Propositions require?"
        placeholder="List your key resources and assets..."
        className="key-resources"
      />
      
      <CanvasSection
        title="Channels"
        icon={Truck}
        section="channels"
        subtitle="Through which Channels do our Customer Segments want to be reached?"
        placeholder="List your distribution and communication channels..."
        className="channels"
      />
      
      <CanvasSection
        title="Cost Structure"
        icon={Factory}
        section="costStructure"
        subtitle="What are the most important costs inherent in our business model?"
        placeholder="List your key cost categories..."
        className="cost-structure"
      />
      
      <CanvasSection
        title="Revenue Streams"
        icon={DollarSign}
        section="revenueStreams"
        subtitle="For what value are our customers really willing to pay?"
        placeholder="List your revenue sources and pricing models..."
        className="revenue-streams"
      />

      {/* Footer */}
      <div className="canvas-footer">
        <p>This work is licensed under the Creative Commons Attribution-Share Alike 3.0 Unported License. To view a copy of this license, visit: http://creativecommons.org/licenses/by-sa/3.0/ or send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.</p>
        <p>DESIGNED BY: Business Model Foundry AG The makers of Business Model Generation</p>
      </div>
    </div>
  )
}
