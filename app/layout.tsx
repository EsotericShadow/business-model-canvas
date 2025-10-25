import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { StackAuthProvider } from '@/components/StackAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Business Model Canvas - Evergreen Web Solutions',
  description: 'Interactive digital Business Model Canvas for strategic planning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StackAuthProvider>
          {children}
        </StackAuthProvider>
      </body>
    </html>
  )
}
