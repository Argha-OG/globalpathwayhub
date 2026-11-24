import { unstable_cache } from 'next/cache';
import { query, formatUniversity, formatCourse, formatGuide } from '@/lib/db';
import { GuideArticle, STARTER_GUIDES } from '@/lib/guides';
import { ensureGuidesTable, getAllGuidesFromDb } from '@/lib/guides-server';

const COURSE_JOIN_SELECT = `
  SELECT c.*,
         u.name as u_name,
         u.country as u_country,
         u.location as u_location,
         u.website as u_website,
         u.description as u_description,
         u.logo as u_logo,
         u.created_at as u_created_at
  FROM courses c
  LEFT JOIN universities u ON c.university_id = u.id
`;

export const getCachedUniversities = unstable_cache(
  async (): Promise<any[]> => {
    try {
      const res = await query('SELECT * FROM universities ORDER BY name ASC');
      return res.rows.map(formatUniversity).filter(Boolean);
    } catch (err) {
      console.warn('[PublicData] Failed to fetch universities:', err);
      return [];
    }
  },
  ['public-universities-all'],
  { revalidate: 60, tags: ['universities'] }
);

export const getCachedFeaturedUniversities = unstable_cache(
  async (limit = 6): Promise<any[]> => {
    try {
      const res = await query('SELECT * FROM universities ORDER BY name ASC LIMIT $1', [limit]);
      return res.rows.map(formatUniversity).filter(Boolean);
    } catch (err) {
      console.warn('[PublicData] Failed to fetch featured universities:', err);
      return [];
    }
  },
  ['public-universities-featured'],
  { revalidate: 60, tags: ['universities'] }
);

export const getCachedUniversityById = unstable_cache(
  async (idOrName: string): Promise<any | null> => {
    try {
      const key = decodeURIComponent(idOrName);
      const resById = await query('SELECT * FROM universities WHERE id = $1 LIMIT 1', [key]);
      if (resById.rows.length > 0) return formatUniversity(resById.rows[0]);

      const resByName = await query('SELECT * FROM universities WHERE name ILIKE $1 LIMIT 1', [key]);
      if (resByName.rows.length > 0) return formatUniversity(resByName.rows[0]);

      return null;
    } catch (err) {
      console.warn('[PublicData] Failed to fetch university by id:', err);
      return null;
    }
  },
  ['public-university-detail'],
  { revalidate: 60, tags: ['universities'] }
);

export const getCachedCourses = unstable_cache(
  async (): Promise<any[]> => {
    try {
      const res = await query(`${COURSE_JOIN_SELECT} ORDER BY c.created_at DESC`);
      return res.rows.map((row) => formatCourse(row)).filter(Boolean);
    } catch (err) {
      console.warn('[PublicData] Failed to fetch courses:', err);
      return [];
    }
  },
  ['public-courses-all'],
  { revalidate: 60, tags: ['courses', 'universities'] }
);

export const getCachedCoursesByUniversityId = unstable_cache(
  async (universityId: string): Promise<any[]> => {
    try {
      const key = decodeURIComponent(universityId);
      const res = await query(
        `${COURSE_JOIN_SELECT} WHERE c.university_id = $1 ORDER BY c.created_at DESC`,
        [key]
      );
      return res.rows.map((row) => formatCourse(row)).filter(Boolean);
    } catch (err) {
      console.warn('[PublicData] Failed to fetch university courses:', err);
      return [];
    }
  },
  ['public-courses-by-uni'],
  { revalidate: 60, tags: ['courses', 'universities'] }
);

export const getCachedCourseById = unstable_cache(
  async (idOrName: string): Promise<any | null> => {
    try {
      const key = decodeURIComponent(idOrName);
      const res = await query(
        `${COURSE_JOIN_SELECT} WHERE c.id = $1 OR c.name ILIKE $1 LIMIT 1`,
        [key]
      );
      return res.rows.length > 0 ? formatCourse(res.rows[0]) : null;
    } catch (err) {
      console.warn('[PublicData] Failed to fetch course by id:', err);
      return null;
    }
  },
  ['public-course-detail'],
  { revalidate: 60, tags: ['courses', 'universities'] }
);

export const getCachedSimilarCourses = unstable_cache(
  async (level: string, excludeId: string): Promise<any[]> => {
    try {
      const params: any[] = [excludeId];
      let where = 'WHERE c.id != $1';
      if (level && level.toLowerCase() !== 'all') {
        params.push(`%${level}%`);
        where += ` AND c.level ILIKE $2`;
      }
      const res = await query(
        `${COURSE_JOIN_SELECT} ${where} ORDER BY c.created_at DESC LIMIT 6`,
        params
      );
      return res.rows.map((row) => formatCourse(row)).filter(Boolean);
    } catch (err) {
      console.warn('[PublicData] Failed to fetch similar courses:', err);
      return [];
    }
  },
  ['public-similar-courses'],
  { revalidate: 60, tags: ['courses', 'universities'] }
);

export const getCachedUniversitiesDirectory = unstable_cache(
  async (): Promise<any[]> => {
    const [uniList, courseList] = await Promise.all([
      getCachedUniversities(),
      getCachedCourses(),
    ]);

    return uniList.map((u: any) => {
      const uniCourses = courseList.filter(
        (c: any) =>
          c.universityId === u._id ||
          c.university?._id === u._id ||
          c.university === u._id
      );

      const programs = uniCourses.map((c: any) => {
        const feeString = c.tuitionFee || '0';
        const feeMatch = feeString.match(/[\d,]+/);
        const fee = feeMatch ? parseInt(feeMatch[0].replace(/,/g, ''), 10) : 0;
        return { title: c.name, category: c.level, fee, feeString: c.tuitionFee };
      });

      const levelSet = new Set<string>();
      uniCourses.forEach((c: any) => {
        if (c.level) levelSet.add(c.level);
      });
      if (u.details?.degree_types && Array.isArray(u.details.degree_types)) {
        u.details.degree_types.forEach((d: string) => levelSet.add(d));
      }

      const offerLetterFee =
        u.offerLetterFee ||
        u.details?.offer_letter_fee ||
        (u.country === 'Malaysia' ? 'Free' : 'Paid');

      return {
        ...u,
        programs,
        levels: Array.from(levelSet),
        courseCount: uniCourses.length,
        offerLetterFee,
      };
    });
  },
  ['public-universities-directory'],
  { revalidate: 60, tags: ['universities', 'courses'] }
);

export const getCachedPublishedGuides = unstable_cache(
  async (): Promise<GuideArticle[]> => {
    return getAllGuidesFromDb({ includeDrafts: false });
  },
  ['public-guides-all'],
  { revalidate: 60, tags: ['guides'] }
);

export const getCachedGuideBySlug = unstable_cache(
  async (slugOrId: string): Promise<GuideArticle | null> => {
    const key = decodeURIComponent(slugOrId);
    try {
      await ensureGuidesTable();
      const res = await query(
        "SELECT * FROM guides WHERE (id = $1 OR slug = $1) AND status = 'published' LIMIT 1",
        [key]
      );
      if (res.rows[0]) {
        return formatGuide(res.rows[0]) as GuideArticle;
      }
    } catch (err) {
      console.warn('[PublicData] DB lookup failed for guide, checking starter guides:', err);
    }

    return STARTER_GUIDES.find((g) => g.id === key || g.slug === key) || null;
  },
  ['public-guide-detail'],
  { revalidate: 60, tags: ['guides'] }
);
