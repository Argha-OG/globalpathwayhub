import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function checkAuth(req: Request) {
  const user = await getCurrentUser(req);
  if (user) return true;
  const authHeader = req.headers?.get ? req.headers.get('authorization') : null;
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  return token === 'siam-secret-token';
}

export async function DELETE(request: Request) {
  try {
    if (!(await checkAuth(request))) {
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
    revalidateTag('universities');
    revalidateTag('courses');
    revalidatePath('/');
    revalidatePath('/universities');

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

