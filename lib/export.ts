// Export utilities for Business Model Canvas

export interface CanvasExportData {
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

// Export to JSON
export function exportToJSON(data: CanvasExportData, filename: string = 'business-model-canvas.json') {
  const jsonData = {
    title: 'Business Model Canvas',
    exportedAt: new Date().toISOString(),
    data
  }
  
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export to PNG
export async function exportToPNG(filename: string = 'business-model-canvas.png') {
  try {
    // Find the canvas container
    const canvas = document.querySelector('.business-model-canvas') as HTMLElement
    if (!canvas) {
      console.error('Canvas element not found')
      throw new Error('Canvas not found')
    }
    
    // Use html2canvas for better rendering
    const { default: html2canvas } = await import('html2canvas')
    
    const canvasElement = await html2canvas(canvas, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: canvas.offsetWidth,
      height: canvas.offsetHeight,
      scrollX: 0,
      scrollY: 0
    })
    
    const link = document.createElement('a')
    link.download = filename
    link.href = canvasElement.toDataURL('image/png', 1.0)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error exporting to PNG:', error)
    throw error
  }
}

// Export to PDF with proper text wrapping
export async function exportToPDF(canvasData?: CanvasExportData, filename: string = 'business-model-canvas.pdf') {
  try {
    const { default: jsPDF } = await import('jspdf')
    
    // Create PDF in landscape A4
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })
    
    // A4 landscape dimensions
    const pageWidth = 297
    const pageHeight = 210
    const margin = 10
    const contentWidth = pageWidth - (margin * 2)
    const contentHeight = pageHeight - (margin * 2)
    
    // Add title
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Business Model Canvas', pageWidth / 2, 15, { align: 'center' })
    
    // Add date
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Exported: ${new Date().toLocaleDateString()}`, pageWidth / 2, 22, { align: 'center' })
    
    // Define grid layout (5 columns, 3 rows)
    const cellWidth = contentWidth / 5
    const cellHeight = contentHeight / 3
    const cellPadding = 2
    
    // Define sections layout
    const sections = [
      { key: 'key-partners', title: 'Key Partners', position: { x: 0, y: 0, width: 1, height: 2 } },
      { key: 'key-activities', title: 'Key Activities', position: { x: 1, y: 0, width: 1, height: 1 } },
      { key: 'key-resources', title: 'Key Resources', position: { x: 1, y: 1, width: 1, height: 1 } },
      { key: 'value-propositions', title: 'Value Propositions', position: { x: 2, y: 0, width: 1, height: 2 } },
      { key: 'customer-relationships', title: 'Customer Relationships', position: { x: 3, y: 0, width: 1, height: 1 } },
      { key: 'channels', title: 'Channels', position: { x: 3, y: 1, width: 1, height: 1 } },
      { key: 'customer-segments', title: 'Customer Segments', position: { x: 4, y: 0, width: 1, height: 2 } },
      { key: 'cost-structure', title: 'Cost Structure', position: { x: 0, y: 2, width: 2, height: 1 } },
      { key: 'revenue-streams', title: 'Revenue Streams', position: { x: 2, y: 2, width: 3, height: 1 } }
    ]
    
    // Use provided canvas data or fallback to DOM
    let data: Record<string, string> = {}
    
    if (canvasData) {
      // Use provided canvas data
      data = {
        key_partners: canvasData.keyPartners,
        key_activities: canvasData.keyActivities,
        key_resources: canvasData.keyResources,
        value_propositions: canvasData.valuePropositions,
        customer_relationships: canvasData.customerRelationships,
        channels: canvasData.channels,
        customer_segments: canvasData.customerSegments,
        cost_structure: canvasData.costStructure,
        revenue_streams: canvasData.revenueStreams
      }
    } else {
      // Fallback to DOM extraction
      sections.forEach(section => {
        const element = document.querySelector(`#${section.key}`) || 
                       document.querySelector(`.${section.key}`) ||
                       document.querySelector(`[id="${section.key}"]`) as HTMLElement
        
        if (element) {
          const textarea = element.querySelector('textarea') as HTMLTextAreaElement
          const readonly = element.querySelector('.canvas-content-readonly') as HTMLElement
          const content = textarea?.value || readonly?.textContent || ''
          
          const fieldMapping: Record<string, string> = {
            'key-partners': 'key_partners',
            'key-activities': 'key_activities', 
            'key-resources': 'key_resources',
            'value-propositions': 'value_propositions',
            'customer-relationships': 'customer_relationships',
            'channels': 'channels',
            'customer-segments': 'customer_segments',
            'cost-structure': 'cost_structure',
            'revenue-streams': 'revenue_streams'
          }
          
          const dbFieldName = fieldMapping[section.key] || section.key
          data[dbFieldName] = content
        }
      })
    }
    
    // Helper function to wrap text
    const wrapText = (text: string, maxWidth: number, maxHeight: number, fontSize: number = 8) => {
      if (!text.trim()) return []
      
      pdf.setFontSize(fontSize)
      const words = text.split(' ')
      const lines: string[] = []
      let currentLine = ''
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word
        const textWidth = pdf.getTextWidth(testLine)
        
        if (textWidth <= maxWidth) {
          currentLine = testLine
        } else {
          if (currentLine) {
            lines.push(currentLine)
            currentLine = word
          } else {
            // Word is too long, split it
            lines.push(word)
          }
        }
      }
      
      if (currentLine) {
        lines.push(currentLine)
      }
      
      return lines.slice(0, Math.floor(maxHeight / (fontSize * 1.2)))
    }
    
    // Draw grid and content
    sections.forEach(section => {
      const x = margin + (section.position.x * cellWidth)
      const y = margin + 30 + (section.position.y * cellHeight) // 30mm offset for title
      const width = section.position.width * cellWidth
      const height = section.position.height * cellHeight
      
      // Draw border
      pdf.setDrawColor(0, 0, 0)
      pdf.setLineWidth(0.5)
      pdf.rect(x, y, width, height)
      
      // Add title
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text(section.title, x + cellPadding, y + 5)
      
      // Add content with text wrapping
      const content = data[section.key] || ''
      const textX = x + cellPadding
      const textY = y + 8
      const textWidth = width - (cellPadding * 2)
      const textHeight = height - 10
      
      const lines = wrapText(content, textWidth, textHeight, 7)
      
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'normal')
      
      lines.forEach((line, index) => {
        const lineY = textY + (index * 4)
        if (lineY < y + height - 2) {
          pdf.text(line, textX, lineY)
        }
      })
    })
    
    pdf.save(filename)
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    throw error
  }
}
