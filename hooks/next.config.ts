import { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb", // Example value
      allowedOrigins: ["*"], // Example value
    },
  },
};

export default nextConfig;
