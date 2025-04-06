import type { NextConfig } from "next";
import "./src/env";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com", protocol: "https" },
      { hostname: "storage.googleapis.com", protocol: "https" },
    ],
  },
};

export default nextConfig;
