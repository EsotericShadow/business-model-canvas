// Production monitoring and alerting system
import { sql } from './database'

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  checks: {
    database: boolean
    auth: boolean
    environment: boolean
    memory: boolean
    disk: boolean
  }
  metrics: {
    responseTime: number
    memoryUsage: number
    uptime: number
  }
}

// Comprehensive health check
export async function getSystemHealth(): Promise<HealthStatus> {
  const startTime = Date.now()
  const checks = {
    database: false,
    auth: false,
    environment: false,
    memory: false,
    disk: false
  }

  try {
    // Database health check
    try {
      await sql`SELECT 1 as health_check`
      checks.database = true
    } catch (error) {
      console.error('Database health check failed:', error)
    }

    // Auth health check
    try {
      const requiredEnvVars = [
        'NEXT_PUBLIC_STACK_PROJECT_ID',
        'NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY',
        'STACK_SECRET_SERVER_KEY'
      ]
      checks.auth = requiredEnvVars.every(envVar => !!process.env[envVar])
    } catch (error) {
      console.error('Auth health check failed:', error)
    }

    // Environment health check
    try {
      checks.environment = !!process.env.DATABASE_URL
    } catch (error) {
      console.error('Environment health check failed:', error)
    }

    // Memory health check
    try {
      const memUsage = process.memoryUsage()
      const memUsageMB = memUsage.heapUsed / 1024 / 1024
      checks.memory = memUsageMB < 500 // Less than 500MB
    } catch (error) {
      console.error('Memory health check failed:', error)
    }

    // Disk health check (simplified)
    try {
      checks.disk = true // Assume disk is healthy for serverless
    } catch (error) {
      console.error('Disk health check failed:', error)
    }

    const responseTime = Date.now() - startTime
    const memUsage = process.memoryUsage()
    
    const healthyChecks = Object.values(checks).filter(Boolean).length
    const totalChecks = Object.keys(checks).length
    
    let status: 'healthy' | 'degraded' | 'unhealthy'
    if (healthyChecks === totalChecks) {
      status = 'healthy'
    } else if (healthyChecks >= totalChecks * 0.7) {
      status = 'degraded'
    } else {
      status = 'unhealthy'
    }

    return {
      status,
      timestamp: new Date().toISOString(),
      checks,
      metrics: {
        responseTime,
        memoryUsage: memUsage.heapUsed / 1024 / 1024,
        uptime: process.uptime()
      }
    }
  } catch (error) {
    console.error('System health check failed:', error)
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
      metrics: {
        responseTime: Date.now() - startTime,
        memoryUsage: 0,
        uptime: 0
      }
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map()

  static recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    const values = this.metrics.get(name)!
    values.push(value)
    
    // Keep only last 100 values
    if (values.length > 100) {
      values.shift()
    }
  }

  static getMetricStats(name: string) {
    const values = this.metrics.get(name) || []
    if (values.length === 0) return null

    const sorted = [...values].sort((a, b) => a - b)
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const p50 = sorted[Math.floor(sorted.length * 0.5)]
    const p95 = sorted[Math.floor(sorted.length * 0.95)]
    const p99 = sorted[Math.floor(sorted.length * 0.99)]

    return { avg, p50, p95, p99, count: values.length }
  }

  static getAllMetrics() {
    const result: Record<string, any> = {}
    this.metrics.forEach((_, name) => {
      result[name] = this.getMetricStats(name)
    })
    return result
  }
}

// Error tracking
export class ErrorTracker {
  private static errors: Array<{
    timestamp: string
    error: string
    stack?: string
    context?: Record<string, any>
  }> = []

  static recordError(error: Error, context?: Record<string, any>) {
    this.errors.push({
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      context
    })

    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors.shift()
    }

    console.error('Error tracked:', error.message, context)
  }

  static getRecentErrors(limit = 10) {
    return this.errors.slice(-limit)
  }

  static getErrorStats() {
    const last24h = this.errors.filter(
      e => Date.now() - new Date(e.timestamp).getTime() < 24 * 60 * 60 * 1000
    )
    
    return {
      total: this.errors.length,
      last24h: last24h.length,
      recent: this.getRecentErrors(5)
    }
  }
}
