/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['example.com', 'randomuser.me', 'images.unsplash.com', 'res.cloudinary.com', 'i.pravatar.cc', 'placehold.co', 'lh3.googleusercontent.com'], // Add your image domains here
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
            {
                protocol: 'https',
                hostname: 'placehold.co',
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
                            ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:* https://*.ngrok-free.dev wss://*.ngrok-free.dev https://naibrly-backend.onrender.com wss://naibrly-backend.onrender.com https://naibrly-backend-main.onrender.com wss://naibrly-backend-main.onrender.com https://naibrly-backend-main-1.onrender.com wss://naibrly-backend-main-1.onrender.com https://fcm.googleapis.com https://fcmregistrations.googleapis.com https://firebaseinstallations.googleapis.com https://www.googleapis.com https://firebaselogging.googleapis.com;"
                            : "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://naibrly-backend.onrender.com wss://naibrly-backend.onrender.com https://naibrly-backend-main.onrender.com wss://naibrly-backend-main.onrender.com https://naibrly-backend-main-1.onrender.com wss://naibrly-backend-main-1.onrender.com https://fcm.googleapis.com https://fcmregistrations.googleapis.com https://firebaseinstallations.googleapis.com https://www.googleapis.com https://firebaselogging.googleapis.com;"
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
