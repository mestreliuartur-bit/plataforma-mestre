import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "bcryptjs", "@auth/prisma-adapter"],

  images: {
    // Gera AVIF e WebP automaticamente — reduz 30-50% do tamanho vs JPEG
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Thumbnails do YouTube para a facade de vídeo (evita carregar o iframe diretamente)
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
