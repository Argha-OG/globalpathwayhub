import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Frankfurter API: https://github.com/lineofflight/frankfurter.git
// Official public endpoint: https://api.frankfurter.app
const FRANKFURTER_API = 'https://api.frankfurter.app/latest';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const base = (searchParams.get('base') || 'USD').toUpperCase();
    const amount = parseFloat(searchParams.get('amount') || '1') || 1;

    // 1. Fetch official ECB rates from Frankfurter (USD, EUR, MYR)
    let frankfurterRates: Record<string, number> = {
      EUR: 0.893,
      MYR: 4.059,
    };
    let date = new Date().toISOString().split('T')[0];

    try {
      const frankfurterRes = await fetch(`${FRANKFURTER_API}?from=USD&to=EUR,MYR`, {
        next: { revalidate: 3600 },
        headers: { Accept: 'application/json' },
      });

      if (frankfurterRes.ok) {
        const data = await frankfurterRes.json();
        if (data.rates) {
          frankfurterRates = {
            ...frankfurterRates,
            ...data.rates,
          };
        }
        if (data.date) {
          date = data.date;
        }
      }
    } catch (e: any) {
      console.warn('Frankfurter fetch warning:', e.message);
    }

    // 2. Frankfurter / ECB does not track BDT; fetch live BDT market rate with resilient fallback
    let bdtRate = 124.25;
    try {
      const bdtRes = await fetch('https://open.er-api.com/v6/latest/USD', {
        next: { revalidate: 3600 },
        headers: { Accept: 'application/json' },
      });
      if (bdtRes.ok) {
        const bdtData = await bdtRes.json();
        if (bdtData.rates && typeof bdtData.rates.BDT === 'number') {
          bdtRate = bdtData.rates.BDT;
        }
      }
    } catch (e: any) {
      console.warn('BDT secondary fetch warning:', e.message);
    }

    // Full rate table relative to USD (1 USD = X)
    const usdRates: Record<string, number> = {
      USD: 1,
      EUR: Number(frankfurterRates.EUR) || 0.893,
      MYR: Number(frankfurterRates.MYR) || 4.059,
      BDT: Number(bdtRate) || 124.25,
    };

    // If requested with a different base (EUR, MYR, BDT):
    const baseRateToUsd = usdRates[base] || 1;
    const finalRates: Record<string, number> = {
      USD: 1 / baseRateToUsd,
      EUR: usdRates.EUR / baseRateToUsd,
      MYR: usdRates.MYR / baseRateToUsd,
      BDT: usdRates.BDT / baseRateToUsd,
    };

    const conversions: Record<string, number> = {
      USD: Number(((amount / baseRateToUsd) * 1).toFixed(4)),
      EUR: Number((amount * finalRates.EUR).toFixed(4)),
      MYR: Number((amount * finalRates.MYR).toFixed(4)),
      BDT: Number((amount * finalRates.BDT).toFixed(4)),
    };

    return NextResponse.json(
      {
        base,
        amount,
        date,
        rates: finalRates,
        conversions,
        currencies: {
          USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
          EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
          MYR: { name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
          BDT: { name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩' },
        },
        source: 'Frankfurter (ECB)',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
        },
      }
    );
  } catch (err: any) {
    console.error('Currency API error:', err);
    return NextResponse.json(
      {
        error: 'Failed to process currency conversion',
        rates: { USD: 1, EUR: 0.893, MYR: 4.059, BDT: 124.25 },
        base: 'USD',
        date: new Date().toISOString().split('T')[0],
      },
      { status: 200 }
    );
  }
}
