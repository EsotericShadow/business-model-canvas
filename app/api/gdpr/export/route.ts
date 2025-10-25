import { NextRequest, NextResponse } from 'next/server'
import { exportUserData } from '@/lib/backup'
import { ErrorTracker } from '@/lib/monitoring'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    const userData = await exportUserData(userId)
    
    return NextResponse.json({
      message: 'User data exported successfully',
      data: userData
    })
  } catch (error) {
    ErrorTracker.recordError(error as Error, { endpoint: '/api/gdpr/export' })
    return NextResponse.json(
      { error: 'Data export failed' },
      { status: 500 }
    )
  }
}
