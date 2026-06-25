import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // INTENT: standalone output creates minimal server.js with only necessary
  // dependencies, reducing Docker image size by ~10x
  output: "standalone",
  // Keep MSW out of the server bundle so msw/node loads from node_modules at
  // runtime (started from src/instrumentation.ts).
  serverExternalPackages: ["msw"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
