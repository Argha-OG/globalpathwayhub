import React from 'react';
import type { Metadata } from 'next';
import CourseDetailClient from '@/components/CourseDetailClient';
import { getCachedCourseById, getCachedSimilarCourses } from '@/lib/public-data';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const course = await getCachedCourseById(params.id);
  if (!course) {
    return { title: 'Course Not Found' };
  }
  const uniName = course.university?.name || 'Global University';
  return {
    title: `${course.name} — ${uniName}`,
    description:
      course.description ||
      `Explore ${course.level || 'accredited'} program ${course.name} at ${uniName}. Check duration, tuition fees, and apply online.`,
    alternates: {
      canonical: `${SITE_URL}/courses/${encodeURIComponent(course._id || params.id)}`,
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const course = await getCachedCourseById(params.id);
  const similarCourses = course
    ? await getCachedSimilarCourses(course.level || 'all', course._id || params.id)
    : [];

  return (
    <CourseDetailClient
      course={course}
      similarCourses={similarCourses}
      id={params.id}
    />
  );
}
