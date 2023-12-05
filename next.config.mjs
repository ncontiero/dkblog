await import("./src/env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_IMG_DOMAINS?.split(",").map((d) => {
      return {
        protocol: "https",
        hostname: d,
      };
    }),
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    });
    return config;
  },
};

export default nextConfig;
