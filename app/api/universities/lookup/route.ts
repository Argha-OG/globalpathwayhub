import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Filter parameters supported by API-Ninjas University API
    const supportedParams = [
      'name',
      'country',
      'city',
      'state',
      'region',
      'domain',
      'level',
      'control',
      'recognition',
      'status',
      'id',
      'min_faculty_ratio',
      'max_faculty_ratio',
      'min_enrolled',
      'max_enrolled',
      'min_tuition',
      'max_tuition',
      'offset',
      'limit',
    ];

    const apiKey = process.env.API_NINJAS_KEY || '6j5g1y06W28zsTpVD6BJm5YlhVD4o2vgcn9hJGtt';
    const targetUrl = new URL('https://api.api-ninjas.com/v1/university');

    let hasFilter = false;
    for (const key of supportedParams) {
      const val = searchParams.get(key);
      if (val !== null && val.trim() !== '') {
        targetUrl.searchParams.set(key, val.trim());
        if (key !== 'offset' && key !== 'limit') {
          hasFilter = true;
        }
      }
    }

    // Default to at least one filter if none provided
    if (!hasFilter) {
      targetUrl.searchParams.set('country', 'USA');
    }

    const res = await fetch(targetUrl.toString(), {
      headers: {
        'X-Api-Key': apiKey,
      },
      next: { revalidate: 3600 }, // Cache responses for 1 hour
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: 'API Ninjas request failed', details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in university lookup API:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
