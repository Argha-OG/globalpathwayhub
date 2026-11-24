import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { query, formatUniversity } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function checkAuth(req) {
  const user = await getCurrentUser(req);
  if (user) return true;
  const authHeader = req.headers?.get ? req.headers.get('authorization') : null;
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  return token === 'siam-secret-token';
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const decodedId = decodeURIComponent(id);

    // 1. Try querying PostgreSQL database
    let dbUni: any = null;

    // First check by direct ID (which is TEXT in PostgreSQL)
    const resultById = await query('SELECT * FROM universities WHERE id = $1', [decodedId]);
    if (resultById.rows.length > 0) {
      dbUni = resultById.rows[0];
    }

    // Then check by institution name
    if (!dbUni) {
      const resultByName = await query('SELECT * FROM universities WHERE name ILIKE $1', [decodedId]);
      if (resultByName.rows.length > 0) {
        dbUni = resultByName.rows[0];
      }
    }

    if (dbUni) {
      return NextResponse.json(formatUniversity(dbUni), {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
      });
    }

    return NextResponse.json({ message: 'University not found' }, { status: 404 });
  } catch (err: any) {
    console.error('Error in GET /api/universities/[id]:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const checkRes = await query('SELECT * FROM universities WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return NextResponse.json({ message: 'University not found' }, { status: 404 });
    }

    const existing = checkRes.rows[0];
    const contentType = request.headers.get('content-type') || '';
    let updatedName = existing.name;
    let updatedCountry = existing.country;
    let updatedLocation = existing.location;
    let updatedWebsite = existing.website;
    let updatedDescription = existing.description;
    let updatedLogo = existing.logo;
    let updatedDetails = existing.details || {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('name')) updatedName = formData.get('name');
      if (formData.has('country')) updatedCountry = formData.get('country');
      if (formData.has('location')) updatedLocation = formData.get('location');
      if (formData.has('website')) updatedWebsite = formData.get('website');
      if (formData.has('description')) updatedDescription = formData.get('description');
      if (formData.has('logo')) updatedLogo = formData.get('logo');
      if (formData.has('details')) {
        try {
          const d = formData.get('details');
          updatedDetails = typeof d === 'string' ? JSON.parse(d) : d;
        } catch {}
      }

      const file = formData.get('image');
      if (file && typeof file === 'object' && file.name) {
        const { uploadToR2, deleteFromR2, getKeyFromUrl } = await import('@/lib/r2');

        // Delete the old logo from R2 if it was stored there
        const oldKey = getKeyFromUrl(existing.logo);
        if (oldKey) await deleteFromR2(oldKey);

        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = file.name.split('.').pop();
        const key = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        updatedLogo = await uploadToR2(buffer, key, file.type || 'image/jpeg');
      }
    } else {
      const body = await request.json();
      if (body.name !== undefined) updatedName = body.name;
      if (body.country !== undefined) updatedCountry = body.country;
      if (body.location !== undefined) updatedLocation = body.location;
      if (body.website !== undefined) updatedWebsite = body.website;
      if (body.description !== undefined) updatedDescription = body.description;
      if (body.logo !== undefined) updatedLogo = body.logo;
      if (body.details !== undefined) updatedDetails = body.details;
    }

    const updateSql = `
      UPDATE universities
      SET name = $1, country = $2, location = $3, website = $4, description = $5, logo = $6, details = $7
      WHERE id = $8
      RETURNING *
    `;

    const result = await query(updateSql, [
      updatedName,
      updatedCountry,
      updatedLocation,
      updatedWebsite,
      updatedDescription,
      updatedLogo,
      JSON.stringify(updatedDetails),
      id,
    ]);

    revalidateTag('universities');
    revalidateTag('courses');
    revalidatePath('/');
    revalidatePath('/universities');
    return NextResponse.json(formatUniversity(result.rows[0]));
  } catch (err) {
    console.error('Error in PUT /api/universities/[id]:', err);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await checkAuth(request))) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Delete the logo from R2 if it was stored there
    const checkRes = await query('SELECT logo FROM universities WHERE id = $1', [id]);
    if (checkRes.rows.length > 0 && checkRes.rows[0].logo) {
      const { deleteFromR2, getKeyFromUrl } = await import('@/lib/r2');
      const oldKey = getKeyFromUrl(checkRes.rows[0].logo);
      if (oldKey) await deleteFromR2(oldKey);
    }

    const result = await query('DELETE FROM universities WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'University not found' }, { status: 404 });
    }
    revalidateTag('universities');
    revalidateTag('courses');
    revalidatePath('/');
    revalidatePath('/universities');
    return NextResponse.json({ message: 'University deleted' });
  } catch (err) {
    console.error('Error in DELETE /api/universities/[id]:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
