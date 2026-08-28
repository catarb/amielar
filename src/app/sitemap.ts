import type { MetadataRoute } from "next";

const SITE_URL = "https://amielarargentina.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/aire-de-colmena`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/nuestra-historia`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/tu-centro-amielar`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
