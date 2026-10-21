import { NextResponse } from 'next/server';
import { query, formatApplication } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 8);
    const body = await request.json();
    const { fullName, email, phone, country, universityId, courseId } = body;

    const insertSql = `
      INSERT INTO applications (id, full_name, email, phone, country, university_id, course_id, status, data, submitted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *
    `;

    const result = await query(insertSql, [
      id,
      fullName || null,
      email || null,
      phone || null,
      country || null,
      universityId || null,
      courseId || null,
      'pending',
      JSON.stringify(body),
    ]);

    const newApplication = formatApplication(result.rows[0]);

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        data: newApplication,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Error in POST /api/applications:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const result = await query('SELECT * FROM applications ORDER BY submitted_at DESC');
    const formatted = result.rows.map(formatApplication);
    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Error in GET /api/applications:', err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
