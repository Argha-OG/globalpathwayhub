import { NextResponse } from 'next/server';
import { query, formatLead } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const priority = searchParams.get('priority');

    let sql = `
      SELECT l.*, u.name as agent_name 
      FROM leads l 
      LEFT JOIN users u ON l.assigned_agent_id = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      sql += ` AND (LOWER(l.full_name) LIKE $${params.length} OR LOWER(l.phone) LIKE $${params.length} OR LOWER(l.email) LIKE $${params.length})`;
    }

    if (status && status !== 'all') {
      params.push(status);
      sql += ` AND l.status = $${params.length}`;
    }

    if (source && source !== 'all') {
      params.push(source);
      sql += ` AND l.lead_source = $${params.length}`;
    }

    if (priority && priority !== 'all') {
      params.push(priority);
      sql += ` AND l.priority = $${params.length}`;
    }

    sql += ` ORDER BY l.created_at DESC`;

    const res = await query(sql, params);
    const leads = res.rows.map(formatLead);

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      city,
      preferredCountry,
      preferredDegree,
      leadSource = 'website_inquiry',
      status = 'new',
      priority = 'medium',
      assignedAgentId,
      estimatedCommission = 1500,
      notes,
    } = body;

    if (!fullName || !phone) {
      return NextResponse.json({ success: false, message: 'Name and phone are required' }, { status: 400 });
    }

    const id = 'lead_' + Date.now();
    const res = await query(
      `INSERT INTO leads (
        id, full_name, email, phone, city, preferred_country, preferred_degree, 
        lead_source, status, priority, assigned_agent_id, estimated_commission, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        id,
        fullName,
        email || null,
        phone,
        city || null,
        preferredCountry || null,
        preferredDegree || null,
        leadSource,
        status,
        priority,
        assignedAgentId || null,
        estimatedCommission,
        notes || null,
      ]
    );

    return NextResponse.json({ success: true, lead: formatLead(res.rows[0]) });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ success: false, message: 'Failed to create lead' }, { status: 500 });
  }
}
