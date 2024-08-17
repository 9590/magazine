/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '8.138.8.7',
                port: '3001',
                pathname: '/wp-content/uploads/**',
            },
            {
                protocol: 'https',
                hostname: 'fyrre-magazine.vercel.app',
                port: '80',
                pathname: '/_next/**',
            },
            {
                protocol: 'http',
                hostname: '2.gravatar.com',
                pathname: '/avatar/**',
            },
            {
                protocol: 'https',
                hostname: 'secure.gravatar.com',
                pathname: '/avatar/**',
            },
        ],
    },
};

module.exports = nextConfig;
