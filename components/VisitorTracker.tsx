'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    const sendVisit = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            path: pathname,
            referrer: typeof document !== 'undefined' ? document.referrer : '',
            utmSource: urlParams.get('utm_source'),
            utmMedium: urlParams.get('utm_medium'),
            utmCampaign: urlParams.get('utm_campaign'),
          }),
        }).catch(() => {});
      } catch {}
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = (window as any).requestIdleCallback(sendVisit, { timeout: 1500 });
      return () => (window as any).cancelIdleCallback(idleId);
    }

    const timer = setTimeout(sendVisit, 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
