import React from 'react';
import UniversitiesClient from '@/components/UniversitiesClient';
import { getCachedUniversitiesDirectory } from '@/lib/public-data';

export const revalidate = 60;

export default async function UniversitiesPage() {
  const universities = await getCachedUniversitiesDirectory();
  return <UniversitiesClient initialUniversities={universities} />;
}
