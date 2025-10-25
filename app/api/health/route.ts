import { NextResponse } from 'next/server'
import { getSystemHealth } from '@/lib/monitoring'
import { PerformanceMonitor, ErrorTracker } from '@/lib/monitoring'

export async function GET() {
  try {
    const startTime = Date.now()
    const health = await getSystemHealth()
    const responseTime = Date.now() - startTime
    
    // Record performance metrics
    PerformanceMonitor.recordMetric('health_check_response_time', responseTime)
    PerformanceMonitor.recordMetric('memory_usage', health.metrics.memoryUsage)
    
    // Get system metrics
    const metrics = PerformanceMonitor.getAllMetrics()
    const errorStats = ErrorTracker.getErrorStats()
    
    const result = {
      ...health,
      performance: metrics,
      errors: errorStats,
      responseTime
    }
    
    return NextResponse.json(result, { 
      status: health.status === 'healthy' ? 200 : 503 
    })
  } catch (error) {
    ErrorTracker.recordError(error as Error, { endpoint: '/api/health' })
    console.error('Health check API error:', error)
    return NextResponse.json({ 
      status: 'unhealthy', 
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    }, { status: 503 })
  }
}
