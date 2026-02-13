/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { 
    unoptimized: true 
  },
  // Optimize build performance
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Reduce build time
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

module.exports = nextConfig;
