'use client'

interface CanvasSectionProps {
  title: string
  content: string
  onUpdate: (value: string) => void
  className?: string
}

export function CanvasSection({ title, content, onUpdate, className }: CanvasSectionProps) {
  const isReadOnly = className?.includes('read-only')
  
  return (
    <div className={`canvas-section ${className || ''}`}>
      <div className="canvas-section-title">{title}</div>
      {isReadOnly ? (
        <div className="canvas-content-readonly">
          {content || `No ${title.toLowerCase()} provided`}
        </div>
      ) : (
        <textarea
          className="canvas-textarea"
          value={content}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder={`Enter your ${title.toLowerCase()}...`}
        />
      )}
    </div>
  )
}
