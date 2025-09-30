import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ⚠️ This allows production builds even if ESLint has errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
