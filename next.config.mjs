/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['example.com', 'randomuser.me', 'images.unsplash.com'], // Add your image domains here
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
