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

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const sql = `${COURSE_JOIN_SELECT} WHERE c.id = $1`;
    const result = await query(sql, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(formatCourse(result.rows[0]));
  } catch (err) {
    console.error('Error in GET /api/courses/[id]:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const checkRes = await query('SELECT * FROM courses WHERE id = $1', [id]);
    if (checkRes.rows.length === 0) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    const existing = checkRes.rows[0];
    const body = await request.json();

    const updatedName = body.name !== undefined ? body.name : existing.name;
    const updatedUniId = body.universityId || body.university || existing.university_id;
    const updatedLevel = body.level !== undefined ? body.level : existing.level;
    const updatedDuration = body.duration !== undefined ? body.duration : existing.duration;
    const updatedTuitionFee = body.tuitionFee !== undefined ? body.tuitionFee : existing.tuition_fee;
    const updatedDescription = body.description !== undefined ? body.description : existing.description;

    const updateSql = `
      UPDATE courses
      SET name = $1, university_id = $2, level = $3, duration = $4, tuition_fee = $5, description = $6
      WHERE id = $7
      RETURNING *
    `;

    await query(updateSql, [
      updatedName,
      updatedUniId,
      updatedLevel,
      updatedDuration,
      updatedTuitionFee,
      updatedDescription,
      id,
    ]);

    const fetchSql = `${COURSE_JOIN_SELECT} WHERE c.id = $1`;
    const fetchRes = await query(fetchSql, [id]);

    return NextResponse.json(formatCourse(fetchRes.rows[0]));
  } catch (err) {
    console.error('Error in PUT /api/courses/[id]:', err);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const result = await query('DELETE FROM courses WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Course deleted' });
  } catch (err) {
    console.error('Error in DELETE /api/courses/[id]:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
