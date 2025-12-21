/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'main-cdn.sbermegamarket.ru',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
