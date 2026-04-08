import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Adicione aqui os domínios de imagens externas (CDN, S3, etc.)
      // { protocol: "https", hostname: "seu-bucket.s3.amazonaws.com" },
    ],
  },
};

export default nextConfig;
