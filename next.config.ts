import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pacotes que precisam de Node.js runtime — não devem ser bundlados para Edge
  serverExternalPackages: ["@prisma/client", "bcryptjs", "@auth/prisma-adapter"],

  images: {
    remotePatterns: [
      // Cloudinary CDN
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Unsplash (seed / desenvolvimento)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
