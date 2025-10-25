/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimized for Vercel deployment with server-side rendering
  images: {
    unoptimized: true
  },
  // Database connection optimization
  serverExternalPackages: ['@neondatabase/serverless', 'bcryptjs'],
  // Disable static export for Vercel
  output: undefined
}

module.exports = nextConfig
