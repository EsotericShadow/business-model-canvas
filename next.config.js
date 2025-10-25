/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export configuration for server-side rendering
  images: {
    unoptimized: true
  },
  // Ensure proper server-side rendering for authentication
  serverExternalPackages: ['@neondatabase/serverless']
}

module.exports = nextConfig
