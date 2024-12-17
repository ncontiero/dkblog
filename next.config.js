await import("./src/env.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com", protocol: "https" },
      { hostname: "storage.googleapis.com", protocol: "https" },
    ],
  },
};

export default nextConfig;
