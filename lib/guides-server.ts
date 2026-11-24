import { query, formatGuide } from '@/lib/db';
import { GuideArticle, STARTER_GUIDES } from '@/lib/guides';

let tableVerified = false;
let initPromise: Promise<void> | null = null;

export async function ensureGuidesTable(): Promise<void> {
  if (tableVerified) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS guides (
          id TEXT PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          category TEXT NOT NULL DEFAULT 'Survival Guide',
          country TEXT DEFAULT 'Global',
          excerpt TEXT,
          content TEXT NOT NULL,
          cover_image TEXT,
          cover_r2_key TEXT,
          images JSONB DEFAULT '[]'::jsonb,
          author_name TEXT DEFAULT 'GlobalPathwayHub Advisory',
          author_role TEXT DEFAULT 'Student Advisory Desk',
          read_time TEXT DEFAULT '5 min read',
          featured BOOLEAN DEFAULT FALSE,
          status TEXT DEFAULT 'published',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);
        CREATE INDEX IF NOT EXISTS idx_guides_status ON guides(status);

        CREATE TABLE IF NOT EXISTS system_seeds (
          key TEXT PRIMARY KEY,
          seeded_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // Seed all starter + Bangla guides once per milestone key so admin edits/deletes remain preserved
      const seedKey = 'bangla_guides_v1';
      const seedRes = await query('SELECT key FROM system_seeds WHERE key = $1', [seedKey]);

      if (seedRes.rows.length === 0) {
        for (const g of STARTER_GUIDES) {
          await query(
            `INSERT INTO guides (
              id, slug, title, category, country, excerpt, content,
              cover_image, images, author_name, author_role, read_time,
              featured, status, created_at, updated_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7,
              $8, $9::jsonb, $10, $11, $12,
              $13, $14, $15, $16
            ) ON CONFLICT (slug) DO NOTHING`,
            [
              g.id,
              g.slug,
              g.title,
              g.category,
              g.country,
              g.excerpt,
              g.content,
              g.coverImage,
              JSON.stringify(g.images || []),
              g.authorName,
              g.authorRole,
              g.readTime,
              g.featured,
              g.status,
              g.createdAt,
              g.updatedAt,
            ]
          );
        }

        await query(
          'INSERT INTO system_seeds (key, seeded_at) VALUES ($1, NOW()) ON CONFLICT (key) DO NOTHING',
          [seedKey]
        );
      }

      await query(
        `UPDATE guides
         SET cover_image = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop'
         WHERE cover_image LIKE '%1523050854058-8df90110c9f1%'`
      );

      tableVerified = true;
    } catch (err: any) {
      console.warn('[Guides] Failed to verify guides table:', err?.message || err);
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

export async function getAllGuidesFromDb(options?: {
  includeDrafts?: boolean;
}): Promise<GuideArticle[]> {
  try {
    await ensureGuidesTable();
    const sql = options?.includeDrafts
      ? 'SELECT * FROM guides ORDER BY featured DESC, created_at DESC'
      : "SELECT * FROM guides WHERE status = 'published' ORDER BY featured DESC, created_at DESC";
    const res = await query(sql);
    return res.rows.map(formatGuide).filter(Boolean) as GuideArticle[];
  } catch (err: any) {
    console.warn('[Guides] Fallback to starter guides due to DB error:', err?.message || err);
    return STARTER_GUIDES;
  }
}
