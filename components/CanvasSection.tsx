'use client'

interface CanvasSectionProps {
  title: string
  content: string
  onUpdate: (value: string) => void
  className?: string
}

export function CanvasSection({ title, content, onUpdate, className }: CanvasSectionProps) {
  const isReadOnly = className?.includes('read-only')
  const sectionId = `canvas-${title.toLowerCase().replace(/\s+/g, '-')}`
  
  return (
    <div 
      className={`canvas-section ${className || ''}`}
      role="region"
      aria-labelledby={`${sectionId}-title`}
    >
      <div 
        id={`${sectionId}-title`}
        className="canvas-section-title"
        role="heading"
        aria-level={2}
      >
        {title}
      </div>
      {isReadOnly ? (
        <div 
          className="canvas-content-readonly"
          role="textbox"
          aria-readonly="true"
          aria-label={`${title} content`}
          tabIndex={0}
        >
          {content || `No ${title.toLowerCase()} provided`}
        </div>
      ) : (
        <textarea
          id={sectionId}
          className="canvas-textarea"
          value={content}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder={`Enter your ${title.toLowerCase()}...`}
          aria-label={`${title} input field`}
          aria-describedby={`${sectionId}-help`}
          maxLength={10000}
        />
      )}
      {!isReadOnly && (
        <div 
          id={`${sectionId}-help`}
          className="sr-only"
          aria-live="polite"
        >
          Character count: {content.length}/10000. Auto-saves as you type.
        </div>
      )}
    </div>
  )
}
