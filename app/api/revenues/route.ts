import { NextResponse } from 'next/server';
import { query, formatRevenue } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const agentId = searchParams.get('agentId');

    let sql = `
      SELECT r.*, u.name as agent_name, s.full_name as student_name
      FROM revenues r
      LEFT JOIN users u ON r.agent_id = u.id
      LEFT JOIN students s ON r.student_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      sql += ` AND r.category = $${params.length}`;
    }

    if (status && status !== 'all') {
      params.push(status);
      sql += ` AND r.status = $${params.length}`;
    }

    if (agentId) {
      params.push(agentId);
      sql += ` AND r.agent_id = $${params.length}`;
    }

    sql += ` ORDER BY r.payment_date DESC, r.created_at DESC`;

    const res = await query(sql, params);
    const revenues = res.rows.map(formatRevenue);

    return NextResponse.json({ success: true, revenues });
  } catch (error) {
    console.error('Error fetching revenues:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch revenues' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      category,
      totalAmount,
      currency = 'USD',
      studentId,
      agentId,
      status = 'received',
      paymentDate = new Date().toISOString().split('T')[0],
      paymentMethod = 'wire_transfer',
      notes,
    } = body;

    if (!title || !category || !totalAmount) {
      return NextResponse.json({ success: false, message: 'Title, category, and total amount required' }, { status: 400 });
    }

    const parsedTotal = Number(totalAmount);
    let agentCommission = 0;

    // Calculate agent commission if assigned
    if (agentId) {
      const agentRes = await query('SELECT commission_rate FROM users WHERE id = $1', [agentId]);
      if (agentRes.rows.length > 0) {
        const rate = Number(agentRes.rows[0].commission_rate || 0);
        agentCommission = Number(((parsedTotal * rate) / 100).toFixed(2));
      }
    }

    const netCompanyAmount = Number((parsedTotal - agentCommission).toFixed(2));
    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const id = 'rev_' + Date.now();

    const res = await query(
      `INSERT INTO revenues (
        id, invoice_number, title, category, total_amount, net_company_amount, 
        agent_commission_amount, currency, student_id, agent_id, status, 
        payment_date, payment_method, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [
        id,
        invoiceNumber,
        title,
        category,
        parsedTotal,
        netCompanyAmount,
        agentCommission,
        currency,
        studentId || null,
        agentId || null,
        status,
        paymentDate,
        paymentMethod,
        notes || null,
      ]
    );

    // If agent commission exists, also create a record in agent_payouts
    if (agentId && agentCommission > 0) {
      const payoutId = 'pay_' + Date.now();
      await query(
        `INSERT INTO agent_payouts (id, agent_id, revenue_id, student_id, amount, currency, status, payout_date, notes)
         VALUES ($1, $2, $3, $4, $5, $6, 'approved', $7, $8)`,
        [payoutId, agentId, id, studentId || null, agentCommission, currency, paymentDate, `Commission for invoice ${invoiceNumber}`]
      );
    }

    return NextResponse.json({ success: true, revenue: formatRevenue(res.rows[0]) });
  } catch (error) {
    console.error('Error creating revenue:', error);
    return NextResponse.json({ success: false, message: 'Failed to record revenue' }, { status: 500 });
  }
}
