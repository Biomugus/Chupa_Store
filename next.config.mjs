/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    qualities: [75, 80]
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'your-ui-library'], 
  }
};

export default nextConfig;