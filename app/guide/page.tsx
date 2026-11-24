import React from 'react';
import GuideClient from '@/components/GuideClient';
import { getCachedPublishedGuides } from '@/lib/public-data';

export const revalidate = 60;

export default async function GuidePage() {
  const guides = await getCachedPublishedGuides();
  return <GuideClient initialGuides={guides} />;
}
