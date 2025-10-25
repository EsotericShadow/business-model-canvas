import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Redirect to Stack Auth hosted pages
  const url = new URL(request.url)
  const path = url.pathname.replace('/handler', '')
  const searchParams = url.searchParams.toString()
  
  // Redirect to Stack Auth hosted handler
  const stackAuthUrl = `https://auth.stack-auth.com/handler${path}${searchParams ? `?${searchParams}` : ''}`
  
  return NextResponse.redirect(stackAuthUrl)
}

export async function POST(request: NextRequest) {
  // Redirect to Stack Auth hosted pages
  const url = new URL(request.url)
  const path = url.pathname.replace('/handler', '')
  const searchParams = url.searchParams.toString()
  
  // Redirect to Stack Auth hosted handler
  const stackAuthUrl = `https://auth.stack-auth.com/handler${path}${searchParams ? `?${searchParams}` : ''}`
  
  return NextResponse.redirect(stackAuthUrl)
}
