/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
  devIndicators: false,
  images: {
    domains: ['storage.googleapis.com'], // For production GCS
  },
};

module.exports = nextConfig;