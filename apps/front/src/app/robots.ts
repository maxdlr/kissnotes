import type { MetadataRoute } from "next";

/**
 * Blocks crawling of auth pages and authenticated-only sections, which have no
 * unique indexable content and would otherwise waste crawl budget.
 */
const robots = (): MetadataRoute.Robots => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/signup", "/form", "/admin"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
};

export default robots;
