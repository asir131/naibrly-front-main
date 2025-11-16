/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['example.com', 'randomuser.me', 'images.unsplash.com', 'res.cloudinary.com', 'i.pravatar.cc'], // Add your image domains here
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                // pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                // pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'i.pravatar.cc',
                // pathname: '/**',
            },
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: process.env.NODE_ENV === 'development'
                            ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://naibrly-backend.onrender.com;"
                            : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://naibrly-backend.onrender.com;"
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
