import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request) {
  try {
    const { ids, status, assignedAgentId } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: 'No student IDs provided' }, { status: 400 });
    }

    const setClauses = [];
    const values = [];

    if (status) {
      values.push(status);
      setClauses.push(`status = $${values.length}`);
    }

    if (assignedAgentId !== undefined) {
      values.push(assignedAgentId);
      setClauses.push(`assigned_agent_id = $${values.length}`);
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ success: false, message: 'No updates specified' }, { status: 400 });
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(ids);
    const sql = `UPDATE students SET ${setClauses.join(', ')} WHERE id = ANY($${values.length}) RETURNING id`;
    const res = await query(sql, values);

    return NextResponse.json({
      success: true,
      message: `Updated ${res.rowCount} student dossiers successfully`,
      updatedCount: res.rowCount,
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    return NextResponse.json({ success: false, message: 'Failed to execute bulk update' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: 'No student IDs provided' }, { status: 400 });
    }

    const res = await query('DELETE FROM students WHERE id = ANY($1)', [ids]);

    return NextResponse.json({
      success: true,
      message: `Deleted ${res.rowCount} student dossiers`,
      deletedCount: res.rowCount,
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json({ success: false, message: 'Failed to execute bulk delete' }, { status: 500 });
  }
}
