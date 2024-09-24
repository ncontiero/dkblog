await import("./src/env.js");

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
};

export default nextConfig;
