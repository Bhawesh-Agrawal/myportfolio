import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                pathname: "/**", // Allow all paths under res.cloudinary.com
            },
        ],
    },
    // Enable React Strict Mode for better error detection
    reactStrictMode: true,
    // Optional: Environment variables for Convex (ensure these are set in .env.local)
    env: {
        CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
        NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    },
    // Optional: Enable TypeScript build-time checks
    typescript: {
        ignoreBuildErrors: false, // Enforce type safety
    },
    // Optional: Enable ESLint during builds
    eslint: {
        ignoreDuringBuilds: false, // Enforce linting
    },
};

export default nextConfig;