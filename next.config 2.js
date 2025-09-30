/** @type {import('next').NextConfig} */
const nextConfig = {
    // FIXED: Removed workerThreads that caused DataCloneError
    generateEtags: true,
    poweredByHeader: false,
    experimental: {
        optimizePackageImports: ['@supabase/supabase-js'],
        // workerThreads: true, // REMOVED: Causes DataCloneError
    },
    serverExternalPackages: ['use-sync-external-store'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'whsjxbfbzjnfmuerpvkt.supabase.co',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

module.exports = nextConfig;