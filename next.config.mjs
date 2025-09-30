/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Performance optimizations
    swcMinify: true,
    experimental: {
        optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react', '@heroicons/react'],
    },
    // Reduce memory usage
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'whsjxbfbzjnfmuerpvkt.supabase.co', // Production
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
            {
                protocol: 'https',
                hostname: 'zxthwmdhjqppkqzpdsea.supabase.co', // Staging
                port: '',
                pathname: '/storage/v1/object/public/**',
            }
        ],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "connect-src 'self' https://whsjxbfbzjnfmuerpvkt.supabase.co wss://whsjxbfbzjnfmuerpvkt.supabase.co https://zxthwmdhjqppkqzpdsea.supabase.co wss://zxthwmdhjqppkqzpdsea.supabase.co"
                    }
                ]
            }
        ]
    }
};

export default nextConfig;