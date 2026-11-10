import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const res = await query('SELECT id, name, email, role, phone, branch, commission_rate, status, created_at FROM users WHERE id = $1', [id]);
    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Agent not found' }, { status: 404 });
    }

    const agent = res.rows[0];

    const [studentsRes, leadsRes, payoutsRes] = await Promise.all([
      query('SELECT * FROM students WHERE assigned_agent_id = $1 ORDER BY created_at DESC', [id]),
      query('SELECT * FROM leads WHERE assigned_agent_id = $1 ORDER BY created_at DESC', [id]),
      query('SELECT * FROM agent_payouts WHERE agent_id = $1 ORDER BY payout_date DESC', [id]),
    ]);

    return NextResponse.json({
      success: true,
      agent: {
        ...agent,
        commissionRate: Number(agent.commission_rate || 0),
      },
      students: studentsRes.rows,
      leads: leadsRes.rows,
      payouts: payoutsRes.rows,
    });
  } catch (error) {
    console.error('Error fetching agent details:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const setClauses = [];
    const values = [];

    if (body.name !== undefined) {
      values.push(body.name);
      setClauses.push(`name = $${values.length}`);
    }
    if (body.phone !== undefined) {
      values.push(body.phone);
      setClauses.push(`phone = $${values.length}`);
    }
    if (body.branch !== undefined) {
      values.push(body.branch);
      setClauses.push(`branch = $${values.length}`);
    }
    if (body.commissionRate !== undefined) {
      values.push(body.commissionRate);
      setClauses.push(`commission_rate = $${values.length}`);
    }
    if (body.status !== undefined) {
      values.push(body.status);
      setClauses.push(`status = $${values.length}`);
    }
    if (body.password) {
      values.push(hashPassword(body.password));
      setClauses.push(`password_hash = $${values.length}`);
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ success: true, message: 'No updates provided' });
    }

    values.push(id);
    const sql = `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING id, name, email, role, phone, branch, commission_rate, status`;
    const res = await query(sql, values);

    return NextResponse.json({ success: true, agent: res.rows[0] });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json({ success: false, message: 'Failed to update agent' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await query("UPDATE users SET status = 'inactive' WHERE id = $1", [id]);
    return NextResponse.json({ success: true, message: 'Agent deactivated' });
  } catch (error) {
    console.error('Error deactivating agent:', error);
    return NextResponse.json({ success: false, message: 'Failed to deactivate agent' }, { status: 500 });
  }
}
