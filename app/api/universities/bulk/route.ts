import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

function checkAuth(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  return token === 'siam-secret-token';
}

export async function DELETE(request: Request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No university IDs provided' },
        { status: 400 }
      );
    }

    const res = await query('DELETE FROM universities WHERE id = ANY($1)', [ids]);

    return NextResponse.json({
      success: true,
      message: `Deleted ${res.rowCount} universities`,
      deletedCount: res.rowCount,
    });
  } catch (error: any) {
    console.error('Bulk delete universities error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to execute bulk delete' },
      { status: 500 }
    );
  }
}

