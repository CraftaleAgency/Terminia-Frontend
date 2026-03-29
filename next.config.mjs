/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/nemoclaw/:path*',
        destination: `${process.env.NEMOCLAW_API_URL || 'https://nemoclaw.pezserv.org'}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
