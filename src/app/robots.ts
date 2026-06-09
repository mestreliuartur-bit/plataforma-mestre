import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/cursos", "/cursos/", "/eventos", "/eventos/"],
        disallow: [
          "/admin/",
          "/dashboard/",
          "/login",
          "/register",
          "/campanha/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://www.mestreliuartur.com/sitemap.xml",
  };
}
