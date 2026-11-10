import { NextResponse } from 'next/server';
import { query, formatCourse } from '@/lib/db';

export const dynamic = 'force-dynamic';

function checkAuth(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  return token === 'siam-secret-token';
}

const COURSE_JOIN_SELECT = `
  SELECT c.*,
         u.name as u_name,
         u.country as u_country,
         u.location as u_location,
         u.website as u_website,
         u.description as u_description,
         u.logo as u_logo,
         u.created_at as u_created_at
  FROM courses c
  LEFT JOIN universities u ON c.university_id = u.id
`;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const universityId = searchParams.get('universityId');
    const search = searchParams.get('search');

    let sql = COURSE_JOIN_SELECT;
    const params = [];
    const conditions = [];

    if (universityId) {
      params.push(universityId);
      conditions.push(`c.university_id = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`c.name ILIKE $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY c.created_at DESC';

    const result = await query(sql, params);
    const formatted = result.rows.map((row) => formatCourse(row));
    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Error in GET /api/courses:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const uniId = body.universityId || body.university;
    if (!uniId) {
      return NextResponse.json({ message: 'universityId is required' }, { status: 400 });
    }

    const id = Date.now().toString() + Math.random().toString(36).substring(2, 8);
    const name = body.name;
    const level = body.level || 'Bachelors';
    const duration = body.duration || '3 years';
    const tuitionFee = body.tuitionFee || null;
    const description = body.description || null;

    const insertSql = `
      INSERT INTO courses (id, name, university_id, level, duration, tuition_fee, description, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;

    await query(insertSql, [id, name, uniId, level, duration, tuitionFee, description]);

    const fetchSql = `${COURSE_JOIN_SELECT} WHERE c.id = $1`;
    const fetchRes = await query(fetchSql, [id]);

    return NextResponse.json(formatCourse(fetchRes.rows[0]), { status: 201 });
  } catch (err) {
    console.error('Error in POST /api/courses:', err);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
