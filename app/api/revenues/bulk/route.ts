import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request) {
  try {
    const { ids, status } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0 || !status) {
      return NextResponse.json({ success: false, message: 'IDs and status required' }, { status: 400 });
    }

    const res = await query('UPDATE revenues SET status = $1 WHERE id = ANY($2) RETURNING id', [status, ids]);

    return NextResponse.json({
      success: true,
      message: `Updated status for ${res.rowCount} invoices`,
      updatedCount: res.rowCount,
    });
  } catch (error) {
    console.error('Bulk revenue error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update revenues' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: 'No invoice IDs provided' }, { status: 400 });
    }

    await query('DELETE FROM agent_payouts WHERE revenue_id = ANY($1)', [ids]);
    const res = await query('DELETE FROM revenues WHERE id = ANY($1)', [ids]);

    return NextResponse.json({
      success: true,
      message: `Deleted ${res.rowCount} revenue records`,
      deletedCount: res.rowCount,
    });
  } catch (error) {
    console.error('Bulk delete revenue error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete revenue records' }, { status: 500 });
  }
}
