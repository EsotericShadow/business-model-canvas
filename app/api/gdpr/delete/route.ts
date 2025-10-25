import { NextRequest, NextResponse } from 'next/server'
import { deleteUserData } from '@/lib/backup'
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
    
    const success = await deleteUserData(userId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Data deletion failed' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'User data deleted successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    ErrorTracker.recordError(error as Error, { endpoint: '/api/gdpr/delete' })
    return NextResponse.json(
      { error: 'Data deletion failed' },
      { status: 500 }
    )
  }
}
