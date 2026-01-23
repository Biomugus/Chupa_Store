/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'main-cdn.sbermegamarket.ru',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sun9-33.userapi.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sun9-66.userapi.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sun9-41.userapi.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sun9-15.userapi.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sun9-36.userapi.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sun9-74.userapi.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sun9-57.userapi.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;