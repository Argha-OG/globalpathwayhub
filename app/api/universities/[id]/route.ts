import { NextResponse } from 'next/server';
import { query, formatUniversity } from '@/lib/db';

export const dynamic = 'force-dynamic';

function checkAuth(req) {
  const authHeader = req.headers.get('authorization');
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
      return NextResponse.json(formatUniversity(dbUni));
    }

    // 2. Fallback to API-Ninjas Global University Registry
    const apiKey = process.env.API_NINJAS_KEY || '6j5g1y06W28zsTpVD6BJm5YlhVD4o2vgcn9hJGtt';
    const targetUrl = new URL('https://api.api-ninjas.com/v1/university');
    const isNumeric = /^\d+$/.test(decodedId);

    if (isNumeric) {
      targetUrl.searchParams.set('id', decodedId);
    } else {
      targetUrl.searchParams.set('name', decodedId);
    }

    const apiRes = await fetch(targetUrl.toString(), {
      headers: { 'X-Api-Key': apiKey },
      next: { revalidate: 3600 },
    });

    if (apiRes.ok) {
      const list = await apiRes.json();
      if (Array.isArray(list) && list.length > 0) {
        // Find best match
        const uni = list.find((u: any) => u.name.toLowerCase() === decodedId.toLowerCase()) || list[0];
        const formatted = {
          _id: uni.id ? String(uni.id) : decodedId,
          name: uni.name,
          country: uni.country || '',
          location: [uni.address, uni.city, uni.state, uni.country].filter(Boolean).join(', ') || uni.country || '',
          website: uni.website || '',
          description: `${uni.name} is an accredited ${uni.level || 'university'} (${uni.institution_type || uni.control || 'higher education institution'}) located in ${[uni.city, uni.state, uni.country].filter(Boolean).join(', ')}, established in ${uni.founded || 'established institution'}.`,
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(uni.name)}&size=200&background=2563eb&color=fff&bold=true`,
          details: uni,
          programs: (uni.degree_types || []).map((deg: string) => ({
            title: deg,
            category: deg,
            fee: uni.tuition || uni.tuition_out_of_state || 0,
            feeString: uni.tuition ? `$${Number(uni.tuition).toLocaleString()}/yr` : 'Consult Counselor',
            duration: uni.years || '3-4 years',
          })),
        };
        return NextResponse.json(formatted);
      }
    }

    return NextResponse.json({ message: 'University not found' }, { status: 404 });
  } catch (err: any) {
    console.error('Error in GET /api/universities/[id]:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!checkAuth(request)) {
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

    return NextResponse.json(formatUniversity(result.rows[0]));
  } catch (err) {
    console.error('Error in PUT /api/universities/[id]:', err);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!checkAuth(request)) {
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
    return NextResponse.json({ message: 'University deleted' });
  } catch (err) {
    console.error('Error in DELETE /api/universities/[id]:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
