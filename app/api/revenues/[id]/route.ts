import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    const { id } = params;
    const { status } = await request.json();

    const res = await query('UPDATE revenues SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Revenue record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, revenue: res.rows[0] });
  } catch (error) {
    console.error('Error updating revenue status:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    const { id } = params;
    await query('DELETE FROM agent_payouts WHERE revenue_id = $1', [id]);
    await query('DELETE FROM revenues WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Revenue record deleted' });
  } catch (error) {
    console.error('Error deleting revenue:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete revenue' }, { status: 500 });
  }
}
