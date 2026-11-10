import { NextResponse } from 'next/server';
import { query, formatStudent } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const agentId = searchParams.get('agentId');

    let sql = `
      SELECT s.*, u.name as agent_name 
      FROM students s 
      LEFT JOIN users u ON s.assigned_agent_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      sql += ` AND (LOWER(s.full_name) LIKE $${params.length} OR LOWER(s.email) LIKE $${params.length} OR LOWER(s.student_code) LIKE $${params.length})`;
    }

    if (status && status !== 'all') {
      params.push(status);
      sql += ` AND s.status = $${params.length}`;
    }

    if (agentId) {
      params.push(agentId);
      sql += ` AND s.assigned_agent_id = $${params.length}`;
    }

    sql += ` ORDER BY s.created_at DESC`;

    const res = await query(sql, params);
    const students = res.rows.map(formatStudent);

    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      nationality = 'Bangladeshi',
      passportNumber,
      highestEducation,
      gpa,
      englishTest = 'IELTS',
      englishScore,
      targetCountry,
      targetUniversity,
      targetCourse,
      targetIntake,
      status = 'counseling',
      assignedAgentId,
      notes,
    } = body;

    if (!fullName || !email) {
      return NextResponse.json({ success: false, message: 'Full name and email are required' }, { status: 400 });
    }

    const id = 'stu_' + Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const studentCode = `GPH-2026-${randomSuffix}`;

    const res = await query(
      `INSERT INTO students (
        id, student_code, full_name, email, phone, date_of_birth, nationality, 
        passport_number, highest_education, gpa, english_test, english_score, 
        target_country, target_university, target_course, target_intake, 
        status, assigned_agent_id, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`,
      [
        id,
        studentCode,
        fullName,
        email,
        phone || null,
        dateOfBirth || null,
        nationality,
        passportNumber || null,
        highestEducation || null,
        gpa || null,
        englishTest || null,
        englishScore || null,
        targetCountry || null,
        targetUniversity || null,
        targetCourse || null,
        targetIntake || null,
        status,
        assignedAgentId || null,
        notes || null,
      ]
    );

    return NextResponse.json({ success: true, student: formatStudent(res.rows[0]) });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ success: false, message: 'Failed to create student dossier' }, { status: 500 });
  }
}
