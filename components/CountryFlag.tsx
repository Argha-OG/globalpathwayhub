import React from 'react';

export type CountryCode = 'MY' | 'CA' | 'AU' | 'GB' | 'FR' | 'US' | 'DE' | 'IE' | 'NZ' | 'INTL';

export function resolveCountryCode(country?: string): CountryCode {
  if (!country) return 'INTL';
  const normalized = country.trim().toLowerCase();

  if (normalized === 'my' || normalized.includes('malaysia')) return 'MY';
  if (normalized === 'ca' || normalized.includes('canada')) return 'CA';
  if (normalized === 'au' || normalized.includes('australia')) return 'AU';
  if (
    normalized === 'gb' ||
    normalized === 'uk' ||
    normalized.includes('united kingdom') ||
    normalized.includes('england') ||
    normalized.includes('scotland') ||
    normalized.includes('wales') ||
    normalized.includes('britain')
  ) {
    return 'GB';
  }
  if (normalized === 'fr' || normalized.includes('france') || normalized.includes('paris')) return 'FR';
  if (
    normalized === 'us' ||
    normalized === 'usa' ||
    normalized.includes('united states') ||
    normalized.includes('america')
  ) {
    return 'US';
  }
  if (normalized === 'de' || normalized.includes('germany') || normalized.includes('deutschland')) return 'DE';
  if (normalized === 'ie' || normalized.includes('ireland') || normalized.includes('dublin')) return 'IE';
  if (normalized === 'nz' || normalized.includes('new zealand')) return 'NZ';

  return 'INTL';
}

interface CountryFlagProps {
  country?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<CountryFlagProps['size']>, string> = {
  xs: 'w-5 h-3.5',
  sm: 'w-6 h-4',
  md: 'w-8 h-5',
  lg: 'w-11 h-7 rounded-lg',
};

/**
 * Renders crisp cross-platform SVG national flags (works reliably on Windows & mobile where emoji flags fail).
 */
export default function CountryFlag({ country, size = 'sm', className = '' }: CountryFlagProps) {
  const code = resolveCountryCode(country);
  const sizeClass = SIZE_CLASSES[size];
  const baseClass = `inline-block flex-shrink-0 overflow-hidden border border-[#144272]/25 shadow-2xs ${sizeClass} ${className}`;

  if (code === 'FR') {
    return (
      <svg viewBox="0 0 36 24" className={baseClass} aria-label="France Flag" role="img">
        <rect x="0" y="0" width="12" height="24" fill="#0055A4" />
        <rect x="12" y="0" width="12" height="24" fill="#FFFFFF" />
        <rect x="24" y="0" width="12" height="24" fill="#EF4135" />
      </svg>
    );
  }

  if (code === 'IE') {
    return (
      <svg viewBox="0 0 36 24" className={baseClass} aria-label="Ireland Flag" role="img">
        <rect x="0" y="0" width="12" height="24" fill="#169B62" />
        <rect x="12" y="0" width="12" height="24" fill="#FFFFFF" />
        <rect x="24" y="0" width="12" height="24" fill="#FF883E" />
      </svg>
    );
  }

  if (code === 'DE') {
    return (
      <svg viewBox="0 0 36 24" className={baseClass} aria-label="Germany Flag" role="img">
        <rect x="0" y="0" width="36" height="8" fill="#000000" />
        <rect x="0" y="8" width="36" height="8" fill="#DD0000" />
        <rect x="0" y="16" width="36" height="8" fill="#FFCE00" />
      </svg>
    );
  }

  if (code === 'CA') {
    return (
      <svg viewBox="0 0 36 24" className={baseClass} aria-label="Canada Flag" role="img">
        <rect x="0" y="0" width="9" height="24" fill="#D80621" />
        <rect x="9" y="0" width="18" height="24" fill="#FFFFFF" />
        <rect x="27" y="0" width="9" height="24" fill="#D80621" />
        <path
          d="M18 4.2L19.4 8.2L22.2 7.2L20.8 10.6L23.5 11.4L21.8 13.8L22.4 15.2L18.6 14.8L18.6 19.6H17.4L17.4 14.8L13.6 15.2L14.2 13.8L12.5 11.4L15.2 10.6L13.8 7.2L16.6 8.2L18 4.2Z"
          fill="#D80621"
        />
      </svg>
    );
  }

  if (code === 'GB') {
    return (
      <svg viewBox="0 0 36 24" className={baseClass} aria-label="United Kingdom Flag" role="img">
        <rect width="36" height="24" fill="#012169" />
        <path d="M0 0L36 24M36 0L0 24" stroke="#FFFFFF" strokeWidth="4.4" />
        <path d="M0 0L36 24M36 0L0 24" stroke="#C8102E" strokeWidth="2.2" />
        <path d="M18 0V24M0 12H36" stroke="#FFFFFF" strokeWidth="6.4" />
        <path d="M18 0V24M0 12H36" stroke="#C8102E" strokeWidth="3.8" />
      </svg>
    );
  }

  if (code === 'MY') {
    return (
      <svg viewBox="0 0 36 24" className={baseClass} aria-label="Malaysia Flag" role="img">
        <rect width="36" height="24" fill="#FFFFFF" />
        <g fill="#CC0001">
          <rect y="0" width="36" height="1.71" />
          <rect y="3.43" width="36" height="1.71" />
          <rect y="6.86" width="36" height="1.71" />
          <rect y="10.29" width="36" height="1.71" />
          <rect y="13.71" width="36" height="1.71" />
          <rect y="17.14" width="36" height="1.71" />
          <rect y="20.57" width="36" height="1.71" />
        </g>
        <rect x="0" y="0" width="18" height="12" fill="#010066" />
        <circle cx="7.4" cy="6" r="3.6" fill="#FFCC00" />
        <circle cx="8.7" cy="6" r="2.9" fill="#010066" />
        <polygon
          points="12.2,3.4 12.8,5.1 14.6,4.6 13.4,6 14.6,7.4 12.8,6.9 12.2,8.6 11.6,6.9 9.8,7.4 11,6 9.8,4.6 11.6,5.1"
          fill="#FFCC00"
        />
      </svg>
    );
  }

  if (code === 'AU') {
    return (
      <svg viewBox="0 0 36 24" className={baseClass} aria-label="Australia Flag" role="img">
        <rect width="36" height="24" fill="#00008B" />
        {/* Union Jack Canton */}
        <path d="M0 0L18 12M18 0L0 12" stroke="#FFFFFF" strokeWidth="2.4" />
        <path d="M0 0L18 12M18 0L0 12" stroke="#FF0000" strokeWidth="1.2" />
        <path d="M9 0V12M0 6H18" stroke="#FFFFFF" strokeWidth="3.4" />
        <path d="M9 0V12M0 6H18" stroke="#FF0000" strokeWidth="2" />
        {/* Commonwealth Star & Southern Cross */}
        <circle cx="9" cy="18" r="2.2" fill="#FFFFFF" />
        <circle cx="27" cy="5" r="1.2" fill="#FFFFFF" />
        <circle cx="23.5" cy="9.5" r="1.1" fill="#FFFFFF" />
        <circle cx="30.5" cy="8.5" r="1.1" fill="#FFFFFF" />
        <circle cx="27" cy="14" r="1.2" fill="#FFFFFF" />
        <circle cx="27" cy="19" r="1.2" fill="#FFFFFF" />
      </svg>
    );
  }

  if (code === 'NZ') {
    return (
      <svg viewBox="0 0 36 24" className={baseClass} aria-label="New Zealand Flag" role="img">
        <rect width="36" height="24" fill="#00247D" />
        <path d="M0 0L18 12M18 0L0 12" stroke="#FFFFFF" strokeWidth="2.4" />
        <path d="M0 0L18 12M18 0L0 12" stroke="#CC142B" strokeWidth="1.2" />
        <path d="M9 0V12M0 6H18" stroke="#FFFFFF" strokeWidth="3.4" />
        <path d="M9 0V12M0 6H18" stroke="#CC142B" strokeWidth="2" />
        <circle cx="27" cy="5.5" r="1.5" fill="#FFFFFF" />
        <circle cx="27" cy="5.5" r="0.9" fill="#CC142B" />
        <circle cx="23.5" cy="10" r="1.3" fill="#FFFFFF" />
        <circle cx="23.5" cy="10" r="0.7" fill="#CC142B" />
        <circle cx="30.5" cy="9" r="1.3" fill="#FFFFFF" />
        <circle cx="30.5" cy="9" r="0.7" fill="#CC142B" />
        <circle cx="27" cy="17.5" r="1.6" fill="#FFFFFF" />
        <circle cx="27" cy="17.5" r="1" fill="#CC142B" />
      </svg>
    );
  }

  if (code === 'US') {
    return (
      <svg viewBox="0 0 36 24" className={baseClass} aria-label="United States Flag" role="img">
        <rect width="36" height="24" fill="#FFFFFF" />
        <g fill="#B22234">
          <rect y="0" width="36" height="1.85" />
          <rect y="3.7" width="36" height="1.85" />
          <rect y="7.4" width="36" height="1.85" />
          <rect y="11.1" width="36" height="1.85" />
          <rect y="14.8" width="36" height="1.85" />
          <rect y="18.5" width="36" height="1.85" />
          <rect y="22.15" width="36" height="1.85" />
        </g>
        <rect x="0" y="0" width="15.5" height="12.95" fill="#3C3B6E" />
        <g fill="#FFFFFF">
          <circle cx="3" cy="2.6" r="0.8" />
          <circle cx="6.5" cy="2.6" r="0.8" />
          <circle cx="10" cy="2.6" r="0.8" />
          <circle cx="13" cy="2.6" r="0.8" />
          <circle cx="4.8" cy="5.2" r="0.8" />
          <circle cx="8.3" cy="5.2" r="0.8" />
          <circle cx="11.6" cy="5.2" r="0.8" />
          <circle cx="3" cy="7.8" r="0.8" />
          <circle cx="6.5" cy="7.8" r="0.8" />
          <circle cx="10" cy="7.8" r="0.8" />
          <circle cx="13" cy="7.8" r="0.8" />
          <circle cx="4.8" cy="10.4" r="0.8" />
          <circle cx="8.3" cy="10.4" r="0.8" />
          <circle cx="11.6" cy="10.4" r="0.8" />
        </g>
      </svg>
    );
  }

  // Fallback global emblem using strict brand palette
  return (
    <svg viewBox="0 0 36 24" className={baseClass} aria-label={country || 'Global'} role="img">
      <rect width="36" height="24" fill="#144272" />
      <circle cx="18" cy="12" r="7" fill="none" stroke="#3FC1C9" strokeWidth="1.6" />
      <ellipse cx="18" cy="12" rx="3.4" ry="7" fill="none" stroke="#FFD749" strokeWidth="1.2" />
      <line x1="11" y1="12" x2="25" y2="12" stroke="#3FC1C9" strokeWidth="1.2" />
    </svg>
  );
}
