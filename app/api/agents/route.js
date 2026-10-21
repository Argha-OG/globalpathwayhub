import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let sql = `
      SELECT 
        u.id, u.name, u.email, u.role, u.phone, u.branch, 
        u.commission_rate, u.status, u.created_at,
        COUNT(DISTINCT s.id) as total_students,
        COUNT(DISTINCT l.id) as total_leads,
        COALESCE(SUM(r.total_amount), 0) as total_revenue_generated,
        COALESCE(SUM(r.agent_commission_amount), 0) as total_commission_accrued
      FROM users u
      LEFT JOIN students s ON s.assigned_agent_id = u.id
      LEFT JOIN leads l ON l.assigned_agent_id = u.id
      LEFT JOIN revenues r ON r.agent_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      params.push(role);
      sql += ` AND u.role = $${params.length}`;
    }

    sql += ` GROUP BY u.id ORDER BY u.created_at ASC`;

    const res = await query(sql, params);

    const agents = res.rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      phone: row.phone,
      branch: row.branch,
      commissionRate: Number(row.commission_rate || 0),
      status: row.status,
      totalStudents: Number(row.total_students || 0),
      totalLeads: Number(row.total_leads || 0),
      totalRevenueGenerated: Number(row.total_revenue_generated || 0),
      totalCommissionAccrued: Number(row.total_commission_accrued || 0),
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({ success: true, agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch agent directory' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password = 'Agent@GPH2026!',
      role = 'agent',
      phone,
      branch = 'Dhaka Office',
      commissionRate = 15.0,
      status = 'active',
    } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, message: 'Name and email are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await query('SELECT id FROM users WHERE LOWER(email) = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, message: 'User with this email already exists' }, { status: 400 });
    }

    const id = (role === 'admin' ? 'usr_admin_' : 'usr_agent_') + Date.now();
    const passwordHash = hashPassword(password);

    const res = await query(
      `INSERT INTO users (id, name, email, password_hash, role, phone, branch, commission_rate, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, name, email, role, phone, branch, commission_rate, status, created_at`,
      [id, name, cleanEmail, passwordHash, role, phone || null, branch, commissionRate, status]
    );

    const u = res.rows[0];
    return NextResponse.json({
      success: true,
      agent: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        branch: u.branch,
        commissionRate: Number(u.commission_rate),
        status: u.status,
        createdAt: u.created_at,
      },
    });
  } catch (error) {
    console.error('Error creating staff/agent:', error);
    return NextResponse.json({ success: false, message: 'Failed to create agent account' }, { status: 500 });
  }
}
