import { MetadataRoute } from 'next';
import { query } from '@/lib/db';
import { TEAM_LIST } from '@/lib/team';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Core static marketing and directory routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/universities`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/courses`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/guide`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/support`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/profile`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Leadership profile pages
  const teamRoutes: MetadataRoute.Sitemap = TEAM_LIST.map((member) => ({
    url: `${SITE_URL}/profile/${member.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  let universityRoutes: MetadataRoute.Sitemap = [];
  let courseRoutes: MetadataRoute.Sitemap = [];
  let guideRoutes: MetadataRoute.Sitemap = [];

  try {
    // Fetch partner universities from Neon PostgreSQL
    const uniRes = await query(
      'SELECT id, updated_at, created_at FROM universities ORDER BY created_at DESC LIMIT 5000'
    );
    if (uniRes && uniRes.rows) {
      const rows = uniRes.rows as Array<{ id: string; updated_at?: string; created_at?: string }>;
      universityRoutes = rows.map((u) => ({
        url: `${SITE_URL}/universities/${u.id}`,
        lastModified: u.updated_at ? new Date(u.updated_at) : currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error('Sitemap: Failed to fetch dynamic universities:', err);
  }

  try {
    // Fetch courses from Neon PostgreSQL
    const courseRes = await query(
      'SELECT id, updated_at, created_at FROM courses ORDER BY created_at DESC LIMIT 5000'
    );
    if (courseRes && courseRes.rows) {
      const rows = courseRes.rows as Array<{ id: string; updated_at?: string; created_at?: string }>;
      courseRoutes = rows.map((c) => ({
        url: `${SITE_URL}/courses/${c.id}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error('Sitemap: Failed to fetch dynamic courses:', err);
  }

  try {
    const guideRes = await query(
      "SELECT slug, updated_at, created_at FROM guides WHERE status = 'published' ORDER BY created_at DESC LIMIT 2000"
    );
    if (guideRes && guideRes.rows) {
      const rows = guideRes.rows as Array<{ slug: string; updated_at?: string; created_at?: string }>;
      guideRoutes = rows.map((g) => ({
        url: `${SITE_URL}/guide/${encodeURIComponent(g.slug)}`,
        lastModified: g.updated_at ? new Date(g.updated_at) : currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error('Sitemap: Failed to fetch dynamic guides:', err);
  }

  return [...staticRoutes, ...teamRoutes, ...universityRoutes, ...courseRoutes, ...guideRoutes];
}
