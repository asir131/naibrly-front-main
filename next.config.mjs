/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['example.com', 'randomuser.me'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                // pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
