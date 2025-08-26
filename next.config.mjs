/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  experimental: {
    staleTimes: {
      static: 0,
      dynamic: 0,
    },
  },
}

export default nextConfig
