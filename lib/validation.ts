// Input validation and sanitization for production safety

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  sanitizedData: any
}

// Sanitize text input to prevent XSS
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 10000) // Limit length to prevent DoS
}

// Validate canvas data
export function validateCanvasData(data: any): ValidationResult {
  const errors: ValidationError[] = []
  const sanitizedData: any = {}

  // Required fields validation
  const requiredFields = [
    'keyPartners', 'keyActivities', 'valuePropositions',
    'customerRelationships', 'customerSegments', 'keyResources',
    'channels', 'costStructure', 'revenueStreams'
  ]

  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== 'string') {
      errors.push({
        field,
        message: `${field} is required and must be a string`
      })
    } else {
      // Sanitize the input
      sanitizedData[field] = sanitizeText(data[field])
      
      // Check length limits
      if (sanitizedData[field].length > 10000) {
        errors.push({
          field,
          message: `${field} is too long (max 10,000 characters)`
        })
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  }
}

// Validate user ID format
export function validateUserId(userId: string): boolean {
  if (!userId || typeof userId !== 'string') return false
  if (userId.length < 10 || userId.length > 100) return false
  // Basic format validation (adjust based on your auth provider)
  return /^[a-zA-Z0-9_-]+$/.test(userId)
}

// Validate share token format
export function validateShareToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false
  // UUID format validation
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token) ||
         /^[a-zA-Z0-9_-]+$/.test(token) // Allow custom tokens like 'demo-canvas'
}

// Rate limiting helper
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    // Add current request
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    
    return true
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter(5, 60000) // 5 requests per minute
