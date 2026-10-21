import { NextResponse } from 'next/server';
import { query, formatExpense } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let sql = `
      SELECT e.*, u.name as recorded_by_name 
      FROM expenses e 
      LEFT JOIN users u ON e.recorded_by = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      sql += ` AND e.category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      sql += ` AND (LOWER(e.title) LIKE $${params.length} OR LOWER(e.paid_to) LIKE $${params.length})`;
    }

    sql += ` ORDER BY e.expense_date DESC, e.created_at DESC`;

    const res = await query(sql, params);
    const expenses = res.rows.map(formatExpense);

    return NextResponse.json({ success: true, expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      category,
      amount,
      currency = 'USD',
      expenseDate = new Date().toISOString().split('T')[0],
      paidTo,
      paymentMethod = 'bank_transfer',
      receiptUrl,
      notes,
      recordedBy,
    } = body;

    if (!title || !category || !amount) {
      return NextResponse.json({ success: false, message: 'Title, category, and amount are required' }, { status: 400 });
    }

    const id = 'exp_' + Date.now();
    const res = await query(
      `INSERT INTO expenses (
        id, title, category, amount, currency, expense_date, paid_to, 
        payment_method, receipt_url, notes, recorded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        id,
        title,
        category,
        Number(amount),
        currency,
        expenseDate,
        paidTo || null,
        paymentMethod,
        receiptUrl || null,
        notes || null,
        recordedBy || null,
      ]
    );

    return NextResponse.json({ success: true, expense: formatExpense(res.rows[0]) });
  } catch (error) {
    console.error('Error recording expense:', error);
    return NextResponse.json({ success: false, message: 'Failed to record expense' }, { status: 500 });
  }
}
