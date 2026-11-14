import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND_ASSETS } from '../assets/media';
import { PLUMBING_SERVICES, type PageRoute } from '../data/brandData';
import { BorderlessCta } from '../components/BorderlessCta';
import { ResilientImage } from '../components/ResilientImage';

gsap.registerPlugin(ScrollTrigger);

interface ServicesPageProps {
  onNavigate: (route: PageRoute, hash?: string, servicePreselect?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.from('.svc-hero-item', {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      gsap.utils.toArray<HTMLElement>('.svc-band').forEach((section) => {
        gsap.from(section, {
          y: 32,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: section,
            start: 'top 84%',
            once: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const surfaceStyles: Record<'ivory' | 'sky' | 'blue' | 'mint', string> = {
    ivory: 'bg-[#FFFDF7] text-[#303B43]',
    sky: 'bg-[#E6F2FF] text-[#303B43]',
    blue: 'bg-[#2457F5] text-white',
    mint: 'bg-[#E6F5EF] text-[#303B43]',
  };

  return (
    <div ref={containerRef} className="w-full overflow-x-hidden">
      {/* Services Hero */}
      <section className="relative min-h-[68vh] w-full flex items-end pb-16 pt-36 overflow-hidden">
        <div className="absolute inset-0">
          <ResilientImage
            src={BRAND_ASSETS.serviceWaterHeaterSystem}
            alt="Precision residential water heater and copper manifold installation"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#18222a]/76 via-[#18222a]/42 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent"
          />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-5 sm:px-8 lg:px-12">
          <p className="svc-hero-item text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#F2C45C] mb-4">
            Plumbing Services
          </p>
          <h1 className="svc-hero-item font-display font-extrabold text-white text-4xl sm:text-6xl lg:text-[4.5rem] leading-[1.0] tracking-tight max-w-3xl mb-6">
            Practical, durable plumbing executed to trade standards.
          </h1>
          <p className="svc-hero-item text-white/90 text-lg max-w-2xl leading-relaxed mb-8">
            Core residential and commercial plumbing scopes built around copper supply systems,
            water heating installations, finish fixtures, and honest diagnostics.
          </p>
          <div className="svc-hero-item">
            <BorderlessCta
              label="REQUEST SERVICE ESTIMATE"
              onClick={() => onNavigate('/contact')}
              tone="lime"
              size="lg"
            />
          </div>
        </div>
      </section>

      {/* Quick Anchor Bar — Clean Typography, Zero Pills */}
      <div className="bg-[#FFFDF7] border-b border-[#303B43]/12">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-5 flex flex-wrap items-center gap-x-8 gap-y-3">
          {PLUMBING_SERVICES.map((svc) => (
            <a
              key={svc.id}
              href={`#${svc.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(svc.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-semibold text-[#303B43]/80 hover:text-[#2457F5] transition-colors whitespace-nowrap"
            >
              <span className="tabular-nums text-[#18B9B0] mr-1.5">{svc.number}.</span>
              {svc.title}
            </a>
          ))}
        </div>
      </div>

      {/* Individual Full-Width Editorial Sections per Service */}
      {PLUMBING_SERVICES.map((service, idx) => {
        const isDarkSurface = service.surfaceTheme === 'blue';
        const imageFirst = idx % 2 === 1;

        return (
          <section
            key={service.id}
            id={service.id}
            className={`svc-band py-20 md:py-28 scroll-mt-24 ${surfaceStyles[service.surfaceTheme]}`}
          >
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
                {/* Visual Column */}
                <div
                  className={`lg:col-span-6 ${
                    imageFirst ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="w-full h-full min-h-[300px] sm:min-h-[420px] overflow-hidden">
                    <ResilientImage
                      src={service.image}
                      alt={service.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Editorial Copy Column */}
                <div
                  className={`lg:col-span-6 flex flex-col justify-between py-2 ${
                    imageFirst ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div>
                    <div className="flex items-baseline gap-4 mb-4">
                      <span
                        className={`font-display font-extrabold text-3xl sm:text-4xl tabular-nums ${
                          isDarkSurface ? 'text-[#F2C45C]' : 'text-[#2457F5]'
                        }`}
                      >
                        {service.number}.
                      </span>
                      <span
                        className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                          isDarkSurface ? 'text-white/75' : 'text-[#18B9B0]'
                        }`}
                      >
                        {service.subtitle}
                      </span>
                    </div>

                    <h2 className="font-display font-extrabold text-3xl sm:text-5xl leading-[1.06] tracking-tight mb-6">
                      {service.title}
                    </h2>

                    <p
                      className={`text-base sm:text-lg leading-relaxed mb-8 ${
                        isDarkSurface ? 'text-white/90' : 'text-[#303B43]/85'
                      }`}
                    >
                      {service.description}
                    </p>

                    <div
                      className={`border-t ${
                        isDarkSurface ? 'border-white/20' : 'border-[#303B43]/15'
                      }`}
                    >
                      {service.scopePoints.map((point) => (
                        <div
                          key={point}
                          className={`py-3.5 border-b text-sm sm:text-base ${
                            isDarkSurface
                              ? 'border-white/20 text-white/90'
                              : 'border-[#303B43]/15 text-[#303B43]/85'
                          }`}
                        >
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 flex flex-wrap items-center gap-8">
                    <BorderlessCta
                      label="INQUIRE ABOUT THIS SERVICE"
                      onClick={() => onNavigate('/contact', undefined, service.title)}
                      tone={isDarkSurface ? 'lime' : 'blue'}
                      size="md"
                    />
                    <BorderlessCta
                      label="VIEW WORKMANSHIP"
                      onClick={() => onNavigate('/about', 'our-work')}
                      tone={isDarkSurface ? 'light' : 'dark'}
                      size="md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
