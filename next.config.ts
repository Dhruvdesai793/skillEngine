import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure that the custom Socket.io path is not handled by the Next.js router
  // This prevents the 404 errors you were seeing earlier.
  async rewrites() {
    return [
      {
        source: '/api/socket/io',
        destination: '/api/socket/io',
      },
    ];
  },
  // If you are using images from Google (for profile pictures) or other external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google Profile Images
      },
    ],
  },
};

export default nextConfig;