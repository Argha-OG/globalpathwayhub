import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(request) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: 'No expense IDs provided' }, { status: 400 });
    }

    const res = await query('DELETE FROM expenses WHERE id = ANY($1)', [ids]);

    return NextResponse.json({
      success: true,
      message: `Deleted ${res.rowCount} expense entries`,
      deletedCount: res.rowCount,
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete expenses' }, { status: 500 });
  }
}
