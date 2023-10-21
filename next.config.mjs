await import("./src/env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: process.env.NEXT_PUBLIC_IMG_DOMAINS?.split(","),
  },
};

export default nextConfig;
