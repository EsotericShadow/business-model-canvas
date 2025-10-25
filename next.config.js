/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimized for Vercel deployment
  images: {
    unoptimized: true
  },
  // Database connection optimization
  serverExternalPackages: ['@neondatabase/serverless']
}

module.exports = nextConfig
