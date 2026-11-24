import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import CountryFlag from '@/components/CountryFlag';
import GuideContentRenderer from '@/components/GuideContentRenderer';
import GuideCopyButton from '@/components/GuideCopyButton';
import { STARTER_GUIDES } from '@/lib/guides';
import { getCachedGuideBySlug, getCachedPublishedGuides } from '@/lib/public-data';
import { SITE_URL } from '@/lib/seo';
import { FaArrowLeft, FaArrowRight, FaWhatsapp } from 'react-icons/fa6';

export const revalidate = 60;

export async function generateStaticParams() {
  return STARTER_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const guide = await getCachedGuideBySlug(params.slug);
  if (!guide) {
    return {
      title: 'Guide Article Not Found',
    };
  }
  return {
    title: guide.title,
    description: guide.excerpt || guide.title,
    alternates: {
      canonical: `${SITE_URL}/guide/${encodeURIComponent(guide.slug)}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.excerpt || guide.title,
      url: `${SITE_URL}/guide/${encodeURIComponent(guide.slug)}`,
      type: 'article',
      ...(guide.coverImage ? { images: [{ url: guide.coverImage }] } : {}),
    },
  };
}

function formatGuideDate(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default async function GuideDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [guide, allGuides] = await Promise.all([
    getCachedGuideBySlug(params.slug),
    getCachedPublishedGuides(),
  ]);

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-28 max-w-xl text-center space-y-5">
        <h1 className="text-2xl font-black text-[#144272]">Article Not Found</h1>
        <p className="text-sm text-black/70">
          The requested student guide could not be located.
        </p>
        <Link href="/guide">
          <Button className="bg-[#144272] text-[#FFD749] rounded-lg text-xs font-bold uppercase tracking-wider px-5 h-10">
            Back to All Guides
          </Button>
        </Link>
      </div>
    );
  }

  const related = allGuides
    .filter((g) => g.id !== guide.id && g.slug !== guide.slug)
    .slice(0, 3);

  const canonicalUrl = `${SITE_URL}/guide/${encodeURIComponent(guide.slug)}`;
  const shareHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${guide.title} — ${canonicalUrl}`
  )}`;

  return (
    <div className="container mx-auto px-4 py-10 pt-28 max-w-4xl space-y-8 pb-24" style={{ color: '#000000' }}>
      {/* Navigation Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-[#144272]">
        <Link
          href="/guide"
          className="inline-flex items-center gap-1.5 hover:text-[#3FC1C9] transition-colors"
        >
          <FaArrowLeft className="h-3 w-3" />
          Back to Student Guides
        </Link>

        <div className="flex items-center gap-2">
          <GuideCopyButton title={guide.title} excerpt={guide.excerpt} />

          <a href={shareHref} target="_blank" rel="noopener noreferrer">
            <Button
              type="button"
              className="h-8 px-3 rounded-lg text-xs font-bold bg-[#3FC1C9] hover:bg-[#34b0b8] text-[#144272] gap-1.5"
            >
              <FaWhatsapp className="h-3.5 w-3.5" />
              Share
            </Button>
          </a>
        </div>
      </div>

      {/* Article Container */}
      <article className="bg-white border border-[#144272]/20 rounded-lg overflow-hidden shadow-sm">
        {guide.coverImage ? (
          <div className="relative aspect-[16/9] bg-[#F5F5F5] border-b border-[#144272]/15">
            <img
              src={guide.coverImage}
              alt={guide.title}
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-2 bg-[#144272] w-full" />
        )}

        <div className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-[#FFD749] text-[#144272] text-xs font-black uppercase tracking-wider">
              {guide.category}
            </span>
            {guide.country && guide.country !== 'Global' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F5F5F5] text-[#144272] text-xs font-bold border border-[#144272]/20">
                <CountryFlag country={guide.country} size="xs" />
                <span>{guide.country}</span>
              </span>
            )}
            <span className="text-xs font-mono text-black/55 px-2 py-1 bg-[#F5F5F5] rounded-lg">
              {guide.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#144272] tracking-tight leading-tight">
            {guide.title}
          </h1>

          {guide.excerpt && (
            <p className="text-base sm:text-lg text-black/80 font-medium leading-relaxed border-l-4 border-[#3FC1C9] pl-4">
              {guide.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-y border-[#144272]/15 text-xs">
            <div>
              <span className="font-black text-[#144272]">{guide.authorName}</span>
              {guide.authorRole && (
                <span className="text-black/60 ml-2">• {guide.authorRole}</span>
              )}
            </div>
            <span className="text-black/55 font-mono">
              Published {formatGuideDate(guide.createdAt)}
            </span>
          </div>

          <div className="pt-2">
            <GuideContentRenderer content={guide.content} />
          </div>

          {Array.isArray(guide.images) && guide.images.length > 0 && (
            <div className="pt-6 border-t border-[#144272]/15 space-y-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#144272]">
                Visual Reference Gallery
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {guide.images.map((img, idx) => (
                  <figure
                    key={idx}
                    className="rounded-lg overflow-hidden border border-[#144272]/20 bg-[#F5F5F5]"
                  >
                    <img
                      src={img.url}
                      alt={img.caption || `Guide image ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[16/10] object-cover"
                    />
                    {img.caption && (
                      <figcaption className="px-3 py-2 text-xs text-black/75 font-medium">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Advisory Consultation Box */}
      <div className="bg-[#144272] text-white rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-[#3FC1C9]/30">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-[#FFD749]">
            Need Personalized Help With Your Study Plan?
          </h3>
          <p className="text-xs sm:text-sm text-[#F5F5F5]/85">
            Discuss destination living costs, university shortlisting, and visa preparation directly with our counselors.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 flex-shrink-0">
          <a
            href={`https://api.whatsapp.com/send?phone=8801410555054&text=${encodeURIComponent(
              `Hello GlobalPathwayHub, I just read "${guide.title}" and would like personalized guidance.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-[#FFD749] hover:bg-[#FFD749]/90 text-[#144272] font-black rounded-lg h-10 px-4 text-xs uppercase tracking-wider gap-1.5">
              <FaWhatsapp className="h-4 w-4" />
              Ask on WhatsApp
            </Button>
          </a>
          <Link href="/universities">
            <Button className="bg-[#3FC1C9] hover:bg-[#34b0b8] text-[#144272] font-bold rounded-lg h-10 px-4 text-xs uppercase tracking-wider">
              Browse Universities
            </Button>
          </Link>
        </div>
      </div>

      {/* Related Guides */}
      {related.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[#144272]">More Student Guides</h2>
            <Link
              href="/guide"
              className="text-xs font-bold text-[#144272] hover:text-[#3FC1C9] inline-flex items-center gap-1 uppercase tracking-wider"
            >
              All Guides <FaArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/guide/${encodeURIComponent(item.slug)}`}
                className="bg-white border border-[#144272]/20 hover:border-[#3FC1C9] rounded-lg p-4 flex flex-col justify-between space-y-3 transition-all group"
              >
                <div className="space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded-lg bg-[#F5F5F5] text-[#144272] text-[10px] font-bold uppercase border border-[#144272]/15">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-black text-[#144272] group-hover:text-[#3FC1C9] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-black/55">{item.readTime}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
