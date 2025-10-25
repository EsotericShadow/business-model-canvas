import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
    stackProjectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID ? 'Set' : 'Not set',
    stackClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY ? 'Set' : 'Not set',
    stackServerKey: process.env.STACK_SECRET_SERVER_KEY ? 'Set' : 'Not set'
  })
}
