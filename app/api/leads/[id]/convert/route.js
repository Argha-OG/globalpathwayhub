import { NextResponse } from 'next/server';
import { query, formatStudent } from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const { id: leadId } = params;

    const leadRes = await query('SELECT * FROM leads WHERE id = $1', [leadId]);
    if (leadRes.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    const lead = leadRes.rows[0];

    // Check if student already created
    const existingStudent = await query('SELECT * FROM students WHERE email = $1', [lead.email]);
    if (existingStudent.rows.length > 0 && lead.email) {
      await query("UPDATE leads SET status = 'converted_to_student' WHERE id = $1", [leadId]);
      return NextResponse.json({
        success: true,
        message: 'Lead was already converted to student dossier',
        student: formatStudent(existingStudent.rows[0]),
      });
    }

    const studentId = 'stu_' + Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const studentCode = `GPH-2026-${randomSuffix}`;

    const newStudentRes = await query(
      `INSERT INTO students (
        id, student_code, full_name, email, phone, target_country, 
        target_course, status, assigned_agent_id, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'counseling', $8, $9)
      RETURNING *`,
      [
        studentId,
        studentCode,
        lead.full_name,
        lead.email || `${lead.phone.replace(/[^0-9]/g, '')}@lead.placeholder`,
        lead.phone,
        lead.preferred_country,
        lead.preferred_degree,
        lead.assigned_agent_id,
        `Converted from Lead [${leadId}]. Source: ${lead.lead_source}. Notes: ${lead.notes || 'None'}`
      ]
    );

    // Update lead status to converted
    await query("UPDATE leads SET status = 'converted_to_student', updated_at = NOW() WHERE id = $1", [leadId]);

    return NextResponse.json({
      success: true,
      message: 'Lead successfully converted to Student File',
      student: formatStudent(newStudentRes.rows[0]),
    });
  } catch (error) {
    console.error('Error converting lead to student:', error);
    return NextResponse.json({ success: false, message: 'Failed to convert lead' }, { status: 500 });
  }
}
