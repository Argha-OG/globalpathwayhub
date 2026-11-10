'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track public-facing routes, skip admin routes
    if (pathname && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname,
            referrer: typeof document !== 'undefined' ? document.referrer : '',
            utmSource: urlParams.get('utm_source'),
            utmMedium: urlParams.get('utm_medium'),
            utmCampaign: urlParams.get('utm_campaign'),
          }),
        }).catch(() => {});
      } catch {}
    }
  }, [pathname]);

  return null;
}
