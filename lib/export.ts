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
    const canvas = document.querySelector('.business-model-canvas') as HTMLElement
    if (!canvas) throw new Error('Canvas not found')
    
    // Use html2canvas for better rendering
    const { default: html2canvas } = await import('html2canvas')
    
    const canvasElement = await html2canvas(canvas, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true
    })
    
    const link = document.createElement('a')
    link.download = filename
    link.href = canvasElement.toDataURL('image/png')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error exporting to PNG:', error)
    throw error
  }
}

// Export to PDF
export async function exportToPDF(filename: string = 'business-model-canvas.pdf') {
  try {
    const canvas = document.querySelector('.business-model-canvas') as HTMLElement
    if (!canvas) throw new Error('Canvas not found')
    
    // Use html2canvas + jsPDF for PDF generation
    const { default: html2canvas } = await import('html2canvas')
    const { default: jsPDF } = await import('jspdf')
    
    const canvasElement = await html2canvas(canvas, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true
    })
    
    const imgData = canvasElement.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })
    
    const imgWidth = 297 // A4 landscape width
    const imgHeight = (canvasElement.height * imgWidth) / canvasElement.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(filename)
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    throw error
  }
}
