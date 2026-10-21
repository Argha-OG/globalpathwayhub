import { NextResponse } from 'next/server';
import { query, formatLead } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const res = await query(
      `SELECT l.*, u.name as agent_name 
       FROM leads l 
       LEFT JOIN users u ON l.assigned_agent_id = u.id 
       WHERE l.id = $1`,
      [id]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: formatLead(res.rows[0]) });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const fieldMap = {
      fullName: 'full_name',
      email: 'email',
      phone: 'phone',
      city: 'city',
      preferredCountry: 'preferred_country',
      preferredDegree: 'preferred_degree',
      leadSource: 'lead_source',
      status: 'status',
      priority: 'priority',
      assignedAgentId: 'assigned_agent_id',
      estimatedCommission: 'estimated_commission',
      notes: 'notes'
    };

    const setClauses = [];
    const values = [];

    Object.entries(fieldMap).forEach(([camelKey, dbCol]) => {
      if (body[camelKey] !== undefined) {
        values.push(body[camelKey]);
        setClauses.push(`${dbCol} = $${values.length}`);
      }
    });

    if (setClauses.length === 0) {
      return NextResponse.json({ success: true, message: 'No changes provided' });
    }

    values.push(id);
    const sql = `UPDATE leads SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
    const res = await query(sql, values);

    if (res.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: formatLead(res.rows[0]) });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ success: false, message: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await query('DELETE FROM leads WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Lead removed' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete lead' }, { status: 500 });
  }
}
