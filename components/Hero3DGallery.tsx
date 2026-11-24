'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import CountryFlag from '@/components/CountryFlag';
import { DESTINATIONS } from '@/lib/destinations';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const GALLERY_DESTINATIONS = DESTINATIONS.slice(0, 5);
const FALLBACK_IMAGE = '/images/malaysia-campus.jpg';

export default function Hero3DGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCardFocusPaused, setIsCardFocusPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const count = GALLERY_DESTINATIONS.length;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Auto-loop continuously every 2.8 seconds (resets cleanly after any manual click)
  useEffect(() => {
    if (isCardFocusPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, 2800);
    return () => clearInterval(timer);
  }, [isCardFocusPaused, activeIndex, count]);

  const handleStep = useCallback(
    (delta: number) => {
      setActiveIndex((prev) => (prev + delta + count) % count);
    },
    [count]
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType === 'touch' || !stageRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      if (!stageRef.current) return;
      stageRef.current.style.setProperty('--tilt-x', `${(-ny * 7).toFixed(2)}deg`);
      stageRef.current.style.setProperty('--tilt-y', `${(nx * 10).toFixed(2)}deg`);
    });
  };

  const resetTilt = () => {
    if (!stageRef.current) return;
    stageRef.current.style.setProperty('--tilt-x', '0deg');
    stageRef.current.style.setProperty('--tilt-y', '0deg');
  };

  const getSignedOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    return diff;
  };

  const activeDest = GALLERY_DESTINATIONS[activeIndex];

  return (
    <div
      className="relative w-full select-none"
      onMouseLeave={resetTilt}
      onPointerMove={handlePointerMove}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') handleStep(-1);
        if (e.key === 'ArrowRight') handleStep(1);
      }}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Study destination campus gallery"
    >
      {/* 3D Perspective Stage */}
      <div
        className="relative h-[340px] sm:h-[410px] lg:h-[440px] w-full flex items-center justify-center"
        style={{ perspective: '1400px' }}
      >
        <div
          ref={stageRef}
          className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))',
          }}
        >
          {/* Architectural Backplate in Deep Z-Plane */}
          <div
            aria-hidden="true"
            className="hidden sm:block absolute w-[76%] h-[82%] bg-[#F5F5F5] rounded-lg border border-[#144272]/10"
            style={{
              transform: 'translate3d(0px, 6px, -110px)',
            }}
          >
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#3FC1C9] rounded-none" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#FFD749] rounded-none" />
          </div>

          {GALLERY_DESTINATIONS.map((dest, idx) => {
            const offset = getSignedOffset(idx);
            const isCenter = offset === 0;

            let transformValue = 'translate3d(0px, 0px, -120px) scale(0.55)';
            let zIndex = 10;
            let opacityClass = 'opacity-0 pointer-events-none';
            let visibilityClass = '';

            if (isCenter) {
              transformValue = 'translate3d(0px, -4px, 75px) rotateY(0deg) rotateZ(0deg) scale(1)';
              zIndex = 40;
              opacityClass = 'opacity-100';
            } else if (offset === -1) {
              transformValue = 'translate3d(-38%, 10px, -15px) rotateY(22deg) rotateZ(-3deg) scale(0.8)';
              zIndex = 30;
              opacityClass = 'opacity-90 hover:opacity-100';
            } else if (offset === 1) {
              transformValue = 'translate3d(38%, 10px, -15px) rotateY(-22deg) rotateZ(3deg) scale(0.8)';
              zIndex = 30;
              opacityClass = 'opacity-90 hover:opacity-100';
            } else if (offset === -2) {
              transformValue = 'translate3d(-66%, 22px, -95px) rotateY(32deg) rotateZ(-5.5deg) scale(0.64)';
              zIndex = 20;
              opacityClass = 'opacity-65 hover:opacity-90';
              visibilityClass = 'hidden sm:block';
            } else if (offset === 2) {
              transformValue = 'translate3d(66%, 22px, -95px) rotateY(-32deg) rotateZ(5.5deg) scale(0.64)';
              zIndex = 20;
              opacityClass = 'opacity-65 hover:opacity-90';
              visibilityClass = 'hidden sm:block';
            }

            return (
              <div
                key={dest.name}
                onClick={() => {
                  if (!isCenter) setActiveIndex(idx);
                }}
                onMouseEnter={() => {
                  if (isCenter) setIsCardFocusPaused(true);
                }}
                onMouseLeave={() => {
                  if (isCenter) setIsCardFocusPaused(false);
                }}
                role={isCenter ? undefined : 'button'}
                tabIndex={isCenter ? -1 : 0}
                aria-label={isCenter ? undefined : `Bring ${dest.name} campus forward`}
                onKeyDown={(e) => {
                  if (!isCenter && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    setActiveIndex(idx);
                  }
                }}
                className={`absolute w-[78%] sm:w-[68%] lg:w-[66%] transition-all duration-700 ${opacityClass} ${visibilityClass} ${
                  isCenter ? '' : 'cursor-pointer'
                }`}
                style={{
                  transform: transformValue,
                  zIndex,
                  transformStyle: 'preserve-3d',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  className={`bg-white p-2 rounded-lg transition-shadow duration-500 ${
                    isCenter
                      ? 'shadow-[0_28px_56px_-14px_rgba(20,66,114,0.28)]'
                      : 'shadow-[0_16px_32px_-12px_rgba(20,66,114,0.18)]'
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#F5F5F5]">
                    <img
                      src={dest.image}
                      alt={`${dest.name} university campus`}
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src.indexOf(FALLBACK_IMAGE) === -1) {
                          img.src = FALLBACK_IMAGE;
                        }
                      }}
                    />
                  </div>

                  {/* Crisp Solid Gallery Plaque Footer */}
                  <div className="pt-2.5 pb-1 px-1.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CountryFlag country={dest.name} size={isCenter ? 'md' : 'sm'} />
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base font-black text-[#144272] leading-tight truncate">
                          {dest.name}
                        </p>
                        {isCenter && (
                          <p className="text-[11px] font-medium text-[#144272]/70 truncate">
                            {dest.tuition} · {dest.postStudyWork}
                          </p>
                        )}
                      </div>
                    </div>

                    {isCenter && (
                      <Link
                        href={`/universities?country=${encodeURIComponent(dest.name)}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFD749] hover:bg-[#f5cb35] text-[#144272] text-[11px] font-black uppercase tracking-wider flex-shrink-0 transition-colors"
                      >
                        <span>Explore</span>
                        <FaArrowRight className="h-2.5 w-2.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Minimal Spatial Navigation Strip */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => handleStep(-1)}
          aria-label="Previous study destination"
          className="w-8 h-8 rounded-lg bg-[#F5F5F5] hover:bg-[#144272] text-[#144272] hover:text-white flex items-center justify-center transition-colors"
        >
          <FaChevronLeft className="h-3 w-3" />
        </button>

        <div className="flex items-center gap-1.5" role="tablist" aria-label="Select destination">
          {GALLERY_DESTINATIONS.map((dest, idx) => {
            const active = idx === activeIndex;
            return (
              <button
                key={dest.code}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`View ${dest.name}`}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-lg transition-all duration-300 ${
                  active
                    ? 'w-8 bg-[#144272]'
                    : 'w-2.5 bg-[#144272]/20 hover:bg-[#3FC1C9]'
                }`}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handleStep(1)}
          aria-label="Next study destination"
          className="w-8 h-8 rounded-lg bg-[#F5F5F5] hover:bg-[#144272] text-[#144272] hover:text-white flex items-center justify-center transition-colors"
        >
          <FaChevronRight className="h-3 w-3" />
        </button>

        <span className="hidden sm:inline-block text-[11px] font-bold text-[#144272]/60 ml-2 tabular-nums">
          {activeDest.shortName}
        </span>
      </div>
    </div>
  );
}
