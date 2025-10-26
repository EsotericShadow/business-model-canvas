// Export utilities for Business Model Canvas
import html2canvas from 'html2canvas'

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

// Generate PDF as Blob for PNG conversion
async function generatePDFBlob(canvasData: CanvasExportData): Promise<Blob> {
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
  
  // Define sections layout with correct data keys
  const sections = [
    { key: 'keyPartners', dataKey: 'keyPartners', title: 'Key Partners', position: { x: 0, y: 0, width: 1, height: 2 } },
    { key: 'keyActivities', dataKey: 'keyActivities', title: 'Key Activities', position: { x: 1, y: 0, width: 1, height: 1 } },
    { key: 'keyResources', dataKey: 'keyResources', title: 'Key Resources', position: { x: 1, y: 1, width: 1, height: 1 } },
    { key: 'valuePropositions', dataKey: 'valuePropositions', title: 'Value Propositions', position: { x: 2, y: 0, width: 1, height: 2 } },
    { key: 'customerRelationships', dataKey: 'customerRelationships', title: 'Customer Relationships', position: { x: 3, y: 0, width: 1, height: 1 } },
    { key: 'channels', dataKey: 'channels', title: 'Channels', position: { x: 3, y: 1, width: 1, height: 1 } },
    { key: 'customerSegments', dataKey: 'customerSegments', title: 'Customer Segments', position: { x: 4, y: 0, width: 1, height: 2 } },
    { key: 'costStructure', dataKey: 'costStructure', title: 'Cost Structure', position: { x: 0, y: 2, width: 2, height: 1 } },
    { key: 'revenueStreams', dataKey: 'revenueStreams', title: 'Revenue Streams', position: { x: 2, y: 2, width: 3, height: 1 } }
  ]
  
  // Adaptive text rendering function
  const renderTextWithAdaptiveSize = (
    text: string, 
    x: number, 
    y: number, 
    maxWidth: number, 
    maxHeight: number, 
    startFontSize: number = 8
  ) => {
    if (!text.trim()) return
    
    let fontSize = startFontSize
    let lines: string[] = []
    const minFontSize = 5 // Minimum readable font size
    const lineHeightFactor = 0.35 // mm per point
    
    // Iterate to find optimal font size
    while (fontSize >= minFontSize) {
      pdf.setFontSize(fontSize)
      
      // Use jsPDF's built-in text wrapping
      const wrappedText = pdf.splitTextToSize(text, maxWidth)
      const textHeight = wrappedText.length * (fontSize * lineHeightFactor * 1.2)
      
      if (textHeight <= maxHeight) {
        lines = wrappedText
        break
      }
      
      fontSize -= 0.5
    }
    
    // Render the text
    if (lines.length > 0) {
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', 'normal')
      
      lines.forEach((line, index) => {
        const lineY = y + (index * fontSize * lineHeightFactor * 1.2)
        if (lineY < y + maxHeight - 2) {
          pdf.text(line, x, lineY)
        }
      })
    }
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
    
    // Add content with adaptive text sizing
    const content = canvasData[section.dataKey as keyof CanvasExportData] || ''
    const textX = x + cellPadding
    const textY = y + 8
    const textWidth = width - (cellPadding * 2)
    const textHeight = height - 12 // Reserve space for title
    
    renderTextWithAdaptiveSize(content, textX, textY, textWidth, textHeight, 8)
  })
  
  return pdf.output('blob')
}

// Export to PNG using html2canvas
export async function exportToPNG(canvasData: CanvasExportData, filename: string = 'business-model-canvas.png') {
  try {
    const canvas = document.querySelector('.business-model-canvas') as HTMLElement
    if (!canvas) {
      console.error('Canvas element not found')
      throw new Error('Canvas not found')
    }
    
    // Use html2canvas for reliable rendering
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
    if (!canvasData) {
      throw new Error('Canvas data is required for PDF export')
    }
    
    const pdfBlob = await generatePDFBlob(canvasData)
    
    // Convert blob to URL and trigger download
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    throw error
  }
}
