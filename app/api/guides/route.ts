import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { query, formatGuide } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import {
  slugifyGuideTitle,
  STARTER_GUIDES,
} from '@/lib/guides';
import {
  ensureGuidesTable,
  getAllGuidesFromDb,
} from '@/lib/guides-server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';
    const category = searchParams.get('category');
    const country = searchParams.get('country');
    const search = searchParams.get('search');

    let isAuthed = false;
    if (includeAll) {
      const user = await getCurrentUser(request);
      isAuthed = Boolean(user);
    }

    let guides = await getAllGuidesFromDb({ includeDrafts: isAuthed });

    if (category && category.toLowerCase() !== 'all') {
      const cat = category.toLowerCase();
      guides = guides.filter((g) => g.category.toLowerCase() === cat);
    }

    if (country && country.toLowerCase() !== 'all') {
      const c = country.toLowerCase();
      guides = guides.filter((g) => (g.country || '').toLowerCase() === c);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      guides = guides.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.excerpt.toLowerCase().includes(q) ||
          g.content.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          (g.country || '').toLowerCase().includes(q)
      );
    }

    return NextResponse.json(
      guides,
      includeAll
        ? { headers: { 'Cache-Control': 'no-store' } }
        : { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (err: any) {
    console.error('Error in GET /api/guides:', err);
    return NextResponse.json(STARTER_GUIDES);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await ensureGuidesTable();

    const body = await request.json();
    const title = (body.title || '').trim();
    const content = (body.content || '').trim();

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Article title and content are required' },
        { status: 400 }
      );
    }

    const baseSlug = slugifyGuideTitle(body.slug || title);
    const existingRes = await query('SELECT id FROM guides WHERE slug = $1', [baseSlug]);
    const finalSlug =
      existingRes.rows.length > 0 ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

    const words = content.split(/\s+/).filter(Boolean).length;
    const computedReadTime = `${Math.max(2, Math.ceil(words / 180))} min read`;

    const id = `guide_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const category = (body.category || 'Survival Guide').trim();
    const country = (body.country || 'Global').trim();
    const plainSnippet = content
      .replace(/[#>*`!-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 175);
    const excerpt = (body.excerpt || '').trim() || (plainSnippet ? `${plainSnippet}...` : title);
    const coverImage = body.coverImage && String(body.coverImage).trim() ? String(body.coverImage).trim() : null;
    const coverR2Key = body.coverR2Key || null;
    const images = Array.isArray(body.images) ? body.images : [];
    const authorName = (body.authorName || user.name || 'GlobalPathwayHub Advisory').trim();
    const authorRole = (body.authorRole || (user.role === 'admin' ? 'Executive Editorial Desk' : 'Admissions Counselor')).trim();
    const readTime = (body.readTime || '').trim() || computedReadTime;
    const featured = Boolean(body.featured);
    const status = body.status === 'draft' ? 'draft' : 'published';

    const res = await query(
      `INSERT INTO guides (
        id, slug, title, category, country, excerpt, content,
        cover_image, cover_r2_key, images, author_name, author_role,
        read_time, featured, status, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10::jsonb, $11, $12,
        $13, $14, $15, NOW(), NOW()
      ) RETURNING *`,
      [
        id,
        finalSlug,
        title,
        category,
        country,
        excerpt,
        content,
        coverImage,
        coverR2Key,
        JSON.stringify(images),
        authorName,
        authorRole,
        readTime,
        featured,
        status,
      ]
    );

    revalidateTag('guides');
    revalidatePath('/guide');
    return NextResponse.json(formatGuide(res.rows[0]), { status: 201 });
  } catch (err: any) {
    console.error('Error in POST /api/guides:', err);
    return NextResponse.json({ message: err.message || 'Failed to publish guide' }, { status: 500 });
  }
}
