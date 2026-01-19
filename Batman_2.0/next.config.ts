import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // 👈 Allow Clerk images
      },
    ],
  },
};

export default nextConfig;