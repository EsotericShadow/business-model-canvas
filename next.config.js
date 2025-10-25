/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server-side rendering for Stack Auth integration
  images: {
    unoptimized: true
  },
  // Ensure proper server-side rendering for authentication
  serverExternalPackages: ['@neondatabase/serverless'],
  // Disable static export for server-side rendering
  output: undefined
}

module.exports = nextConfig
