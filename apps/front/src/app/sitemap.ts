import type { MetadataRoute } from "next";
import { fetchPublishedExpressions } from "./_utils/fetchPublishedExpressions";
import { fetchAllUsers } from "./_utils/fetchAllUsers";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const [expressions, users] = await Promise.all([
    fetchPublishedExpressions(),
    fetchAllUsers(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl!, changeFrequency: "daily", priority: 1 },
  ];

  const expressionRoutes: MetadataRoute.Sitemap = expressions.map(
    (expression) => ({
      url: `${siteUrl}/exp/${expression.id}`,
      lastModified: expression.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const profileRoutes: MetadataRoute.Sitemap = users.map((user) => ({
    url: `${siteUrl}/@${user.username}`,
    lastModified: user.updatedAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...expressionRoutes, ...profileRoutes];
};

export default sitemap;
