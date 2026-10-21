import { NextResponse } from 'next/server';
import { query, formatUniversity } from '@/lib/db';

export const dynamic = 'force-dynamic';

function checkAuth(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  return token === 'siam-secret-token';
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const search = searchParams.get('search');

    let sql = 'SELECT * FROM universities';
    const params = [];
    const conditions = [];

    if (country) {
      params.push(country);
      conditions.push(`country = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`name ILIKE $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY name ASC';

    const result = await query(sql, params);
    const formatted = result.rows.map(formatUniversity);
    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Error in GET /api/universities:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let country = '';
    let location = '';
    let website = null;
    let description = null;
    let logo = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = formData.get('name') || '';
      country = formData.get('country') || '';
      location = formData.get('location') || '';
      website = formData.get('website') || null;
      description = formData.get('description') || null;
      logo = formData.get('logo') || null;

      const file = formData.get('image');
      if (file && typeof file === 'object' && file.name) {
        const { uploadToR2 } = await import('@/lib/r2');
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = file.name.split('.').pop();
        const key = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        logo = await uploadToR2(buffer, key, file.type || 'image/jpeg');
      }
    } else {
      const body = await request.json();
      name = body.name || '';
      country = body.country || '';
      location = body.location || '';
      website = body.website || null;
      description = body.description || null;
      logo = body.logo || null;
    }

    if (!name || !country || !location) {
      return NextResponse.json(
        { message: 'Name, country, and location are required' },
        { status: 400 }
      );
    }

    const id = Date.now().toString() + Math.random().toString(36).substring(2, 8);
    const insertSql = `
      INSERT INTO universities (id, name, country, location, website, description, logo, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;

    const result = await query(insertSql, [id, name, country, location, website, description, logo]);
    return NextResponse.json(formatUniversity(result.rows[0]), { status: 201 });
  } catch (err) {
    console.error('Error in POST /api/universities:', err);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
