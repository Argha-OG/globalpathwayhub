import React from 'react';
import CoursesClient from '@/components/CoursesClient';
import { getCachedCourses } from '@/lib/public-data';

export const revalidate = 60;

export default async function CoursesPage() {
  const courses = await getCachedCourses();
  return <CoursesClient initialCourses={courses} />;
}
