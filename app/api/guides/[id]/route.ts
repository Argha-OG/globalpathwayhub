import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { query, formatGuide } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { deleteFromR2 } from '@/lib/r2';
import { slugifyGuideTitle, STARTER_GUIDES } from '@/lib/guides';
import { ensureGuidesTable } from '@/lib/guides-server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const key = decodeURIComponent(params.id);
    await ensureGuidesTable();

    const res = await query(
      'SELECT * FROM guides WHERE id = $1 OR slug = $1 LIMIT 1',
      [key]
    );

    const row = res.rows[0];
    if (!row) {
      const starter = STARTER_GUIDES.find((g) => g.id === key || g.slug === key);
      if (starter) return NextResponse.json(starter);
      return NextResponse.json({ message: 'Guide article not found' }, { status: 404 });
    }

    if (row.status !== 'published') {
      const user = await getCurrentUser(request);
      if (!user) {
        return NextResponse.json({ message: 'Guide article not found' }, { status: 404 });
      }
    }

    return NextResponse.json(formatGuide(row), {
      headers:
        row.status === 'published'
          ? { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
          : { 'Cache-Control': 'no-store' },
    });
  } catch (err: any) {
    const key = decodeURIComponent(params.id);
    const starter = STARTER_GUIDES.find((g) => g.id === key || g.slug === key);
    if (starter) return NextResponse.json(starter);
    return NextResponse.json({ message: err.message || 'Failed to fetch guide' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await ensureGuidesTable();
    const id = decodeURIComponent(params.id);

    const existing = await query('SELECT * FROM guides WHERE id = $1 OR slug = $1 LIMIT 1', [id]);
    if (!existing.rows[0]) {
      return NextResponse.json({ message: 'Guide article not found' }, { status: 404 });
    }

    const current = existing.rows[0];
    const body = await request.json();

    const title = body.title !== undefined ? String(body.title).trim() : current.title;
    const content = body.content !== undefined ? String(body.content).trim() : current.content;
    const category = body.category !== undefined ? String(body.category).trim() : current.category;
    const country = body.country !== undefined ? String(body.country).trim() : current.country;
    const excerpt = body.excerpt !== undefined ? String(body.excerpt).trim() : current.excerpt;
    const coverImage =
      body.coverImage !== undefined
        ? body.coverImage && String(body.coverImage).trim()
          ? String(body.coverImage).trim()
          : null
        : current.cover_image;
    const coverR2Key =
      body.coverImage === null || body.coverImage === ''
        ? null
        : body.coverR2Key !== undefined
          ? body.coverR2Key
          : current.cover_r2_key;
    const images =
      body.images !== undefined
        ? Array.isArray(body.images)
          ? body.images
          : []
        : current.images || [];
    const authorName =
      body.authorName !== undefined ? String(body.authorName).trim() : current.author_name;
    const authorRole =
      body.authorRole !== undefined ? String(body.authorRole).trim() : current.author_role;
    const readTime =
      body.readTime !== undefined
        ? String(body.readTime).trim()
        : `${Math.max(2, Math.ceil(content.split(/\s+/).filter(Boolean).length / 180))} min read`;
    const featured = body.featured !== undefined ? Boolean(body.featured) : current.featured;
    const status =
      body.status !== undefined
        ? body.status === 'draft'
          ? 'draft'
          : 'published'
        : current.status;

    let slug = current.slug;
    if (body.slug && String(body.slug).trim() !== current.slug) {
      const candidate = slugifyGuideTitle(String(body.slug));
      const dup = await query('SELECT id FROM guides WHERE slug = $1 AND id != $2', [
        candidate,
        current.id,
      ]);
      slug = dup.rows.length > 0 ? `${candidate}-${Date.now().toString(36)}` : candidate;
    }

    const updated = await query(
      `UPDATE guides SET
        slug = $1,
        title = $2,
        category = $3,
        country = $4,
        excerpt = $5,
        content = $6,
        cover_image = $7,
        cover_r2_key = $8,
        images = $9::jsonb,
        author_name = $10,
        author_role = $11,
        read_time = $12,
        featured = $13,
        status = $14,
        updated_at = NOW()
      WHERE id = $15
      RETURNING *`,
      [
        slug,
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
        current.id,
      ]
    );

    revalidateTag('guides');
    revalidatePath('/guide');
    revalidatePath(`/guide/${slug}`);
    return NextResponse.json(formatGuide(updated.rows[0]));
  } catch (err: any) {
    console.error('Error in PATCH /api/guides/[id]:', err);
    return NextResponse.json({ message: err.message || 'Failed to update guide' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await ensureGuidesTable();
    const id = decodeURIComponent(params.id);

    const res = await query('SELECT id, cover_r2_key FROM guides WHERE id = $1 OR slug = $1', [id]);
    if (!res.rows[0]) {
      return NextResponse.json({ message: 'Guide article not found' }, { status: 404 });
    }

    if (res.rows[0].cover_r2_key) {
      await deleteFromR2(res.rows[0].cover_r2_key);
    }

    await query('DELETE FROM guides WHERE id = $1', [res.rows[0].id]);
    revalidateTag('guides');
    revalidatePath('/guide');
    return NextResponse.json({ success: true, message: 'Guide article deleted' });
  } catch (err: any) {
    console.error('Error in DELETE /api/guides/[id]:', err);
    return NextResponse.json({ message: err.message || 'Failed to delete guide' }, { status: 500 });
  }
}
