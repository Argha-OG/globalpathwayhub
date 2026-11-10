import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const [totalRes, sourceRes, pathRes, countryRes] = await Promise.all([
      query(`
        SELECT 
          COUNT(*) as total_hits,
          COUNT(DISTINCT ip_hash) as unique_visitors,
          COUNT(CASE WHEN visited_at >= NOW() - INTERVAL '24 HOURS' THEN 1 END) as last_24h_visitors
        FROM visitors
      `),
      query(`
        SELECT 
          COALESCE(utm_source, 'direct') as source,
          COUNT(*) as count
        FROM visitors
        GROUP BY COALESCE(utm_source, 'direct')
        ORDER BY count DESC
        LIMIT 6
      `),
      query(`
        SELECT path, COUNT(*) as count 
        FROM visitors 
        GROUP BY path 
        ORDER BY count DESC 
        LIMIT 6
      `),
      query(`
        SELECT COALESCE(country, 'Bangladesh') as country, COUNT(*) as count 
        FROM visitors 
        GROUP BY COALESCE(country, 'Bangladesh') 
        ORDER BY count DESC 
        LIMIT 6
      `),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalHits: Number(totalRes.rows[0].total_hits || 0),
        uniqueVisitors: Number(totalRes.rows[0].unique_visitors || 0),
        last24hVisitors: Number(totalRes.rows[0].last_24h_visitors || 0),
        bySource: sourceRes.rows,
        byPath: pathRes.rows,
        byCountry: countryRes.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching visitor stats:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch visitor analytics' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { path, referrer, utmSource, utmMedium, utmCampaign } = body;

    const forwarded = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const ipHash = crypto.createHash('sha256').update(forwarded + userAgent).digest('hex').slice(0, 16);
    const device = userAgent.includes('Mobile') ? 'Mobile' : 'Desktop';

    const id = 'vis_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    await query(
      `INSERT INTO visitors (id, ip_hash, path, referrer, country, city, device, utm_source, utm_medium, utm_campaign)
       VALUES ($1, $2, $3, $4, 'Bangladesh', 'Dhaka', $5, $6, $7, $8)`,
      [id, ipHash, path || '/', referrer || null, device, utmSource || 'direct', utmMedium || null, utmCampaign || null]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    // Visitor logging should never crash the frontend
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
