import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const { ids, status, branch, role } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No agent IDs provided' },
        { status: 400 }
      );
    }

    const setClauses: string[] = [];
    const values: any[] = [];

    if (status) {
      values.push(status);
      setClauses.push(`status = $${values.length}`);
    }

    if (branch) {
      values.push(branch);
      setClauses.push(`branch = $${values.length}`);
    }

    if (role) {
      values.push(role);
      setClauses.push(`role = $${values.length}`);
    }

    if (setClauses.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No updates specified' },
        { status: 400 }
      );
    }

    values.push(ids);
    const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE id = ANY($${values.length}) RETURNING id`;
    const res = await query(sql, values);

    return NextResponse.json({
      success: true,
      message: `Updated ${res.rowCount} agents successfully`,
      updatedCount: res.rowCount,
    });
  } catch (error: any) {
    console.error('Bulk update agents error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update agents' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No agent IDs provided' },
        { status: 400 }
      );
    }

    // Set to inactive or delete
    const res = await query("UPDATE users SET status = 'inactive' WHERE id = ANY($1)", [ids]);

    return NextResponse.json({
      success: true,
      message: `Deactivated ${res.rowCount} agents`,
      deletedCount: res.rowCount,
    });
  } catch (error: any) {
    console.error('Bulk delete agents error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to deactivate agents' },
      { status: 500 }
    );
  }
}

