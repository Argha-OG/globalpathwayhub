import React from 'react';
import HomeClient from '@/components/HomeClient';
import { getCachedFeaturedUniversities, getCachedPublishedGuides } from '@/lib/public-data';

export const revalidate = 60;

export default async function HomePage() {
  const [featuredUnis, guides] = await Promise.all([
    getCachedFeaturedUniversities(6),
    getCachedPublishedGuides(),
  ]);

  return (
    <HomeClient
      initialFeaturedUnis={featuredUnis}
      initialGuides={guides.slice(0, 4)}
    />
  );
}
