import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // DISABLE ESLINT AND TYPESCRIPT CHECKS DURING BUILD
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Performance optimizations
  reactStrictMode: true,
  
  // Compression
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react', '@radix-ui/react-dropdown-menu'],
  },
};

export default nextConfig;