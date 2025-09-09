import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Point Turbopack at THIS project’s root
    root: __dirname,
  },
  // other config options…
};

export default nextConfig;
