import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X } from 'lucide-react';
import { BRAND_ASSETS } from '../assets/media';
import {
  VERIFIED_BRAND,
  WORKMANSHIP_GALLERY,
  type PageRoute,
  type ShowcaseItem,
} from '../data/brandData';
import { BorderlessCta } from '../components/BorderlessCta';
import { ResilientImage } from '../components/ResilientImage';

gsap.registerPlugin(ScrollTrigger);

interface AboutWorkPageProps {
  onNavigate: (route: PageRoute, hash?: string) => void;
}

export const AboutWorkPage: React.FC<AboutWorkPageProps> = ({ onNavigate }) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<ShowcaseItem | null>(null);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(WORKMANSHIP_GALLERY.map((item) => item.category)))],
    []
  );

  const filteredItems = useMemo(
    () =>
      activeFilter === 'All'
        ? WORKMANSHIP_GALLERY
        : WORKMANSHIP_GALLERY.filter((item) => item.category === activeFilter),
    [activeFilter]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.from('.about-hero-reveal', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      gsap.utils.toArray<HTMLElement>('.work-reveal').forEach((el) => {
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="w-full overflow-x-hidden">
      {/* 1. SPLIT-SCREEN STORY HERO (WARM IVORY) */}
      <section className="bg-[#FFFDF7] text-[#303B43] pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between py-2">
              <div>
                <p className="about-hero-reveal text-xs font-semibold uppercase tracking-[0.2em] text-[#2457F5] mb-4">
                  About {VERIFIED_BRAND.name}
                </p>
                <h1 className="about-hero-reveal font-display font-extrabold text-4xl sm:text-6xl leading-[1.03] tracking-tight mb-7">
                  Plumber by trade. Father of four. Faith over fear.
                </h1>
                <p className="about-hero-reveal text-lg text-[#303B43]/85 leading-relaxed mb-6">
                  Every detail published here stays true to the verified identity behind{' '}
                  <a
                    href={VERIFIED_BRAND.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#2457F5] underline underline-offset-4"
                  >
                    {VERIFIED_BRAND.instagramHandle}
                  </a>
                  —real blue-collar grit, respect for the craft, and pride in doing the job cleanly
                  the first time.
                </p>
                <p className="about-hero-reveal text-base text-[#303B43]/75 leading-relaxed mb-8">
                  We never fabricate awards, invented client testimonials, or inflated company
                  timelines. What you see is straightforward trade craftsmanship grounded in family
                  values and hands-on field work.
                </p>
              </div>

              <div className="about-hero-reveal border-t border-[#303B43]/15 pt-6 flex flex-wrap items-center gap-8">
                <BorderlessCta
                  label="EXPLORE OUR WORK"
                  onClick={() =>
                    document.getElementById('our-work')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  tone="blue"
                  size="md"
                />
                <BorderlessCta
                  label="FOLLOW ON INSTAGRAM"
                  href={VERIFIED_BRAND.instagramUrl}
                  external
                  tone="dark"
                  size="md"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="w-full h-full min-h-[380px] lg:min-h-[560px] overflow-hidden">
                <ResilientImage
                  src={BRAND_ASSETS.storyTradesmanPortrait}
                  alt="Plumber inspecting copper framing lines on a residential site"
                  loading="eager"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VIBRANT AQUA PHILOSOPHY BAND */}
      <section className="work-reveal bg-[#18B9B0] text-white py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D7F34A] mb-4">
              Philosophy & Brotherhood
            </p>
            <blockquote className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-[1.06] tracking-tight mb-8">
              “{VERIFIED_BRAND.packQuote}”
            </blockquote>
            <p className="text-white/90 text-lg leading-relaxed max-w-2xl">
              From rough-in framing to final valve testing, reliable plumbing comes from looking out
              for homeowners, fellow tradespeople, and the family behind every day on the tools.
            </p>
          </div>
        </div>
      </section>

      {/* 3. OUR WORK — OPEN ASYMMETRIC PHOTOGRAPHY SHOWCASE */}
      <section
        id="our-work"
        className="bg-[#E6F2FF] text-[#303B43] py-20 md:py-28 scroll-mt-20"
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#303B43]/15">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2457F5] mb-3">
                Our Work & Craftsmanship
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-none">
                Field Craft & Installation Showcase
              </h2>
            </div>

            {/* Interactive Filter Tabs (zero pills, clean underline/segmented bar) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4" role="tablist" aria-label="Filter craftsmanship showcase">
              {categories.map((category) => {
                const active = activeFilter === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveFilter(category)}
                    className={`px-3 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer border-0 border-b-2 bg-transparent ${
                      active
                        ? 'border-[#2457F5] text-[#2457F5]'
                        : 'border-transparent text-[#303B43]/70 hover:text-[#303B43]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#303B43]/70 py-5 border-b border-[#303B43]/10">
            {VERIFIED_BRAND.mediaNotice}
          </p>

          {/* Open Asymmetric Editorial Grid — Zero Card Boxes */}
          <div className="pt-12 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-16">
            {filteredItems.map((item, index) => {
              const spanClass =
                item.aspect === 'wide' || index === 0
                  ? 'lg:col-span-7'
                  : item.aspect === 'portrait'
                    ? 'lg:col-span-5'
                    : 'lg:col-span-6';
              const heightClass =
                item.aspect === 'portrait'
                  ? 'aspect-[3/4] max-h-[580px]'
                  : 'aspect-[16/10]';

              return (
                <article key={item.id} className={`${spanClass} group`}>
                  <button
                    type="button"
                    onClick={() => setLightboxItem(item)}
                    className="w-full text-left bg-transparent border-0 p-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2457F5]"
                    aria-label={`Inspect ${item.title} photograph`}
                  >
                    <div className={`w-full overflow-hidden bg-[#FFFDF7] ${heightClass}`}>
                      <ResilientImage
                        src={item.image}
                        alt={item.imageAlt}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      />
                    </div>
                  </button>

                  <div className="pt-4 border-b border-[#303B43]/15 pb-5">
                    <div className="flex items-baseline justify-between gap-4 mb-1.5">
                      <span className="text-xs font-semibold text-[#18B9B0] uppercase tracking-wider">
                        {item.index} · {item.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => setLightboxItem(item)}
                        className="text-xs font-bold text-[#2457F5] hover:underline bg-transparent border-0 cursor-pointer p-0"
                      >
                        Inspect Full View
                      </button>
                    </div>
                    <h3 className="font-display font-bold text-2xl tracking-tight mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#303B43]/80 leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-16 pt-10 border-t border-[#303B43]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <p className="text-base sm:text-lg font-medium text-[#303B43]/85">
              See daily field updates and trade moments directly on Instagram.
            </p>
            <div className="flex flex-wrap items-center gap-8">
              <BorderlessCta
                label="OPEN @THE_AMERICAN_PLUMBER"
                href={VERIFIED_BRAND.instagramUrl}
                external
                tone="blue"
                size="md"
              />
              <BorderlessCta
                label="REQUEST A SERVICE"
                onClick={() => onNavigate('/contact')}
                tone="dark"
                size="md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Clean Fullscreen Lightbox */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-[#18222a]/95 flex items-center justify-center p-4 sm:p-10"
        >
          <button
            type="button"
            onClick={() => setLightboxItem(null)}
            aria-label="Close lightbox"
            className="fixed top-6 right-6 z-50 text-white hover:text-[#F2C45C] p-3 bg-transparent border-0 cursor-pointer"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full flex flex-col gap-4"
          >
            <img
              src={lightboxItem.image}
              alt={lightboxItem.imageAlt}
              className="w-full max-h-[78vh] object-contain"
            />
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-white pt-2 border-t border-white/20">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#F2C45C]">
                  {lightboxItem.category}
                </p>
                <p className="font-display font-bold text-2xl">{lightboxItem.title}</p>
              </div>
              <p className="text-sm text-white/80 max-w-md">{lightboxItem.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
