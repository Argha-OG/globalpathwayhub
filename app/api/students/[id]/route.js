import { NextResponse } from 'next/server';
import { query, formatStudent } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const res = await query(
      `SELECT s.*, u.name as agent_name 
       FROM students s 
       LEFT JOIN users u ON s.assigned_agent_id = u.id 
       WHERE s.id = $1`,
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    }

    const docsRes = await query(
      `SELECT * FROM student_documents WHERE student_id = $1 ORDER BY uploaded_at DESC`,
      [id]
    );

    return NextResponse.json({
      success: true,
      student: formatStudent(res.rows[0]),
      documents: docsRes.rows,
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const fields = [
      'full_name', 'email', 'phone', 'date_of_birth', 'nationality',
      'passport_number', 'highest_education', 'gpa', 'english_test',
      'english_score', 'target_country', 'target_university', 'target_course',
      'target_intake', 'status', 'assigned_agent_id', 'notes'
    ];

    const setClauses = [];
    const values = [];

    const fieldMap = {
      fullName: 'full_name',
      email: 'email',
      phone: 'phone',
      dateOfBirth: 'date_of_birth',
      nationality: 'nationality',
      passportNumber: 'passport_number',
      highestEducation: 'highest_education',
      gpa: 'gpa',
      englishTest: 'english_test',
      englishScore: 'english_score',
      targetCountry: 'target_country',
      targetUniversity: 'target_university',
      targetCourse: 'target_course',
      targetIntake: 'target_intake',
      status: 'status',
      assignedAgentId: 'assigned_agent_id',
      notes: 'notes'
    };

    Object.entries(fieldMap).forEach(([camelKey, dbCol]) => {
      if (body[camelKey] !== undefined) {
        values.push(body[camelKey]);
        setClauses.push(`${dbCol} = $${values.length}`);
      }
    });

    if (setClauses.length === 0) {
      return NextResponse.json({ success: true, message: 'No updates provided' });
    }

    values.push(id);
    const sql = `UPDATE students SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
    const res = await query(sql, values);

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, student: formatStudent(res.rows[0]) });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ success: false, message: 'Failed to update student' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await query('DELETE FROM students WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Student file deleted' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete student' }, { status: 500 });
  }
}
