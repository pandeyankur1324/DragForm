// const nextConfig: NextConfig = {
//   /* config options here */
//   experimental: {
//     serverActions: {
//       bodySizeLimit: "1mb", // Example value
//       allowedOrigins: ["*"], // Example value
//     },
//   },
// };

// next.config.js

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
      allowedOrigins: ["*"],
    },
  },
};

export default nextConfig;


// export default nextConfig;
