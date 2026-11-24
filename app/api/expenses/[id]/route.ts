import { NextResponse } from 'next/server';
import { query, formatExpense } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
    }

    const { id } = params;
    await query('DELETE FROM expenses WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete expense' }, { status: 500 });
  }
}
