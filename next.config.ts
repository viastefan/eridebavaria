import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "ebuddys.at" },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
