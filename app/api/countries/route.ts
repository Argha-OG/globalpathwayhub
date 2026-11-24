import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query('SELECT DISTINCT country as name FROM universities WHERE country IS NOT NULL ORDER BY country ASC');
    if (res.rows.length > 0) {
      return NextResponse.json(res.rows);
    }
  } catch (e) {
    console.error('Error fetching countries:', e);
  }

  // Fallback default destinations
  return NextResponse.json([
    { name: 'Malaysia' },
    { name: 'Canada' },
    { name: 'Australia' },
    { name: 'United Kingdom' },
    { name: 'France' },
    { name: 'United States' },
    { name: 'Germany' },
    { name: 'Ireland' },
    { name: 'New Zealand' },
  ]);
}
