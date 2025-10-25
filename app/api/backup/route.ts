import { NextRequest, NextResponse } from 'next/server'
import { createBackup, verifyBackup } from '@/lib/backup'
import { ErrorTracker } from '@/lib/monitoring'

export async function GET() {
  try {
    const backup = await createBackup()
    
    if (!backup.success) {
      return NextResponse.json(
        { error: 'Backup failed', details: backup.error },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Backup created successfully',
      timestamp: backup.timestamp,
      size: backup.size,
      tables: backup.tables
    })
  } catch (error) {
    ErrorTracker.recordError(error as Error, { endpoint: '/api/backup' })
    return NextResponse.json(
      { error: 'Backup creation failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()
    
    if (action === 'verify') {
      const isValid = await verifyBackup(data)
      return NextResponse.json({ valid: isValid })
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    ErrorTracker.recordError(error as Error, { endpoint: '/api/backup', action: 'POST' })
    return NextResponse.json(
      { error: 'Backup verification failed' },
      { status: 500 }
    )
  }
}
