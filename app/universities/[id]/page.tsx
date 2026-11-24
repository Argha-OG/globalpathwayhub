import React from 'react';
import type { Metadata } from 'next';
import UniversityDetailClient from '@/components/UniversityDetailClient';
import { getCachedUniversityById, getCachedCoursesByUniversityId } from '@/lib/public-data';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const university = await getCachedUniversityById(params.id);
  if (!university) {
    return { title: 'University Not Found' };
  }
  return {
    title: `${university.name} | Study in ${university.country}`,
    description:
      university.description ||
      `Explore courses, admissions criteria, and direct enrollment support for ${university.name} (${university.country}).`,
    alternates: {
      canonical: `${SITE_URL}/universities/${encodeURIComponent(university._id || university.id || params.id)}`,
    },
  };
}

export default async function UniversityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const university = await getCachedUniversityById(params.id);
  const resolvedUniId = university?._id || university?.id || params.id;
  const courses = university
    ? await getCachedCoursesByUniversityId(resolvedUniId)
    : [];

  return (
    <UniversityDetailClient
      university={university}
      courses={courses}
      id={params.id}
    />
  );
}
