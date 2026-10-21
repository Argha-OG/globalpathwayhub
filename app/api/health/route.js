import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query('SELECT NOW() as db_time');
    return NextResponse.json({
      status: 'ok',
      framework: 'Next.js App Router',
      database: 'Neon Postgres (Connected)',
      timestamp: res.rows[0].db_time,
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: 'error',
        database: 'Neon Postgres (Error)',
        message: err.message,
      },
      { status: 500 }
    );
  }
}
