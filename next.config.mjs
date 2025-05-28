/** @type {import('next').NextConfig} */
const hostname = process.env.NEXT_PUBLIC_USE_STAGING_DB === 'true'
  ? "zxthwmdhjqppkqzpdsea.supabase.co"  // Staging
  : "whsjxbfbzjnfmuerpvkt.supabase.co"; // Production

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;