import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BRAND_ASSETS } from '../assets/media';
import {
  PLUMBING_SERVICES,
  VERIFIED_BRAND,
  type PageRoute,
} from '../data/brandData';
import { BorderlessCta } from '../components/BorderlessCta';
import { ResilientImage } from '../components/ResilientImage';
import type { PublicBusinessConfig } from '../components/Footer';

gsap.registerPlugin(ScrollTrigger);

interface HomePageProps {
  onNavigate: (route: PageRoute, hash?: string, servicePreselect?: string) => void;
  config: PublicBusinessConfig | null;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, config }) => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      gsap.from('.hero-stagger', {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      gsap.to('.hero-parallax-img', {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>('.reveal-band').forEach((band) => {
        gsap.from(band, {
          y: 32,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: band,
            start: 'top 84%',
            once: true,
          },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="w-full overflow-x-hidden">
      {/* 1. CINEMATIC FULL-SCREEN HERO */}
      <section className="hero-section relative min-h-[92vh] lg:min-h-screen w-full flex items-end pb-16 sm:pb-24 pt-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <ResilientImage
            src={BRAND_ASSETS.heroCopperPlumbing}
            alt="Precision copper manifold piping and brass valve assembly installed by THE AMERICAN PLUMBER"
            loading="eager"
            className="hero-parallax-img w-full h-[115%] -top-[7%] relative object-cover object-center"
          />
          {/* Local directional contrast scrim only behind typography zone — keeps photo bright and natural */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#18222a]/72 via-[#18222a]/32 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/40 to-transparent"
          />
        </div>

        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <p className="hero-stagger text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#F2C45C] mb-4">
              {VERIFIED_BRAND.instagramHandle} · Plumber by Trade
            </p>
            <h1 className="hero-stagger font-display font-extrabold text-white text-5xl sm:text-6xl lg:text-[5.25rem] leading-[0.98] tracking-tight mb-6">
              Expert Plumbing.
              <br />
              Done Right.
            </h1>
            <p className="hero-stagger text-white/90 text-lg sm:text-xl leading-relaxed max-w-xl mb-9">
              Professional residential and commercial plumbing craftsmanship delivered with
              integrity, precision piping, and steady attention to every fitting.
            </p>

            <div className="hero-stagger flex flex-wrap items-center gap-8 sm:gap-10">
              <BorderlessCta
                label="REQUEST A SERVICE"
                onClick={() => onNavigate('/contact')}
                tone="lime"
                size="lg"
              />
              <BorderlessCta
                label="GET IN TOUCH"
                onClick={() => onNavigate('/contact')}
                tone="light"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND INTRODUCTION & VERIFIED ETHOS (WARM IVORY) */}
      <section className="reveal-band bg-[#FFFDF7] text-[#303B43] py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 flex flex-col items-start gap-8">
              <img
                src={BRAND_ASSETS.logo}
                alt="THE AMERICAN PLUMBER Original Brand Emblem"
                className="h-28 sm:h-36 w-auto object-contain"
              />
              <div className="border-t border-[#303B43]/15 pt-6 w-full max-w-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#18B9B0] mb-2">
                  Verified Trade Identity
                </p>
                <p className="text-sm text-[#303B43]/80 leading-relaxed">
                  {VERIFIED_BRAND.bioHighlights.join(' · ')}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2457F5] mb-4">
                Built on Honest Work
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl leading-[1.06] tracking-tight mb-6">
                Clean lines behind every wall. Real accountability on every job.
              </h2>
              <p className="text-lg text-[#303B43]/80 leading-relaxed max-w-2xl mb-8">
                THE AMERICAN PLUMBER stands for pride in the trades—from straight copper runs and
                well-balanced brass manifolds to crisp kitchen and bath fixture finishes. Guided by
                “faith over fear” and the belief that “{VERIFIED_BRAND.packQuote.toLowerCase()}”
              </p>
              <div className="flex flex-wrap items-center gap-8">
                <BorderlessCta
                  label="READ OUR STORY"
                  onClick={() => onNavigate('/about')}
                  tone="blue"
                  size="md"
                />
                <BorderlessCta
                  label="VISIT INSTAGRAM"
                  href={VERIFIED_BRAND.instagramUrl}
                  external
                  tone="dark"
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VIBRANT ELECTRIC ROYAL BLUE — CORE TRADE OVERVIEW */}
      <section className="reveal-band relative bg-[#2457F5] text-white py-20 md:py-28 overflow-hidden">
        <div
          aria-hidden="true"
          className="ambient-flow absolute -right-24 -top-24 w-[36rem] h-[36rem] rounded-full bg-[#18B9B0]/25 blur-3xl pointer-events-none"
        />
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2C45C] mb-3">
                Core Plumbing Disciplines
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-none">
                Craftsmanship Across Every System
              </h2>
            </div>
            <BorderlessCta
              label="EXPLORE ALL SERVICES"
              onClick={() => onNavigate('/services')}
              tone="lime"
              size="md"
            />
          </div>

          <div className="divide-y divide-white/20">
            {PLUMBING_SERVICES.map((service) => (
              <div
                key={service.id}
                className="py-8 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-baseline group"
              >
                <div className="lg:col-span-1">
                  <span className="font-display font-bold text-2xl sm:text-3xl text-[#F2C45C] tabular-nums">
                    {service.number}.
                  </span>
                </div>
                <div className="lg:col-span-4">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight group-hover:text-[#D7F34A] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-white/70 mt-2">
                    {service.subtitle}
                  </p>
                </div>
                <div className="lg:col-span-5">
                  <p className="text-white/85 text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="lg:col-span-2 lg:text-right">
                  <BorderlessCta
                    label="DETAILS"
                    onClick={() => onNavigate('/services', service.id)}
                    tone="light"
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ASYMMETRIC OPEN PHOTOGRAPHY & WORKMANSHIP SPREAD (SKY BLUE) */}
      <section className="reveal-band bg-[#E6F2FF] text-[#303B43] py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end mb-14">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2457F5] mb-3">
                Workmanship Presentation
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl leading-[1.05] tracking-tight">
                Measured runs, clean solder joints, and lasting finish work.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pb-1">
              <p className="text-base text-[#303B43]/80 leading-relaxed mb-4">
                Every mechanical room and residential fixture reflects the same standard—neatly
                supported pipework, accessible shut-offs, and uncluttered execution.
              </p>
              <BorderlessCta
                label="VIEW OUR WORK"
                onClick={() => onNavigate('/about', 'our-work')}
                tone="blue"
                size="md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              <div className="overflow-hidden aspect-[4/3] bg-[#FFFDF7]">
                <ResilientImage
                  src={BRAND_ASSETS.serviceWaterHeaterSystem}
                  alt="Residential water heater with precision copper supply lines and brass ball valves"
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700"
                />
              </div>
              <div className="pt-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-[#303B43]/15 pb-4">
                <span className="font-display font-bold text-xl">
                  Utility Room Thermal Header & Expansion Assembly
                </span>
                <span className="text-xs font-medium text-[#303B43]/65">
                  Copper Supply · Isolation Valves
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 lg:mt-16">
              <div className="overflow-hidden aspect-[4/3] bg-[#FFFDF7]">
                <ResilientImage
                  src={BRAND_ASSETS.serviceFixtureInstallation}
                  alt="Brushed brass kitchen faucet and ceramic apron sink installation"
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700"
                />
              </div>
              <div className="pt-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-[#303B43]/15 pb-4">
                <span className="font-display font-bold text-xl">
                  Architectural Brushed Brass Kitchen Finish
                </span>
                <span className="text-xs font-medium text-[#303B43]/65">
                  Fixture Trim · Seal Testing
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE THE AMERICAN PLUMBER (SOFT MINT) */}
      <section className="reveal-band bg-[#E6F5EF] text-[#303B43] py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#18B9B0] mb-3">
                Why Choose Us
              </p>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl leading-[1.06] tracking-tight mb-5">
                Trade standards without shortcuts.
              </h2>
              <p className="text-base text-[#303B43]/80 leading-relaxed">
                Straightforward communication, respect for your home or job site, and durable
                components that hold up long after the tools are packed.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
              <div className="border-t border-[#303B43]/20 pt-5">
                <p className="text-xs font-bold tabular-nums text-[#2457F5] mb-2">01</p>
                <h3 className="font-display font-bold text-2xl mb-2">
                  Precision Behind the Scenes
                </h3>
                <p className="text-sm sm:text-base text-[#303B43]/80 leading-relaxed">
                  Piping is leveled, strapped securely, and routed logically so future service
                  valves remain clear and accessible.
                </p>
              </div>

              <div className="border-t border-[#303B43]/20 pt-5">
                <p className="text-xs font-bold tabular-nums text-[#2457F5] mb-2">02</p>
                <h3 className="font-display font-bold text-2xl mb-2">
                  Honest Scope & Diagnostics
                </h3>
                <p className="text-sm sm:text-base text-[#303B43]/80 leading-relaxed">
                  Clear explanations of what is failing, why it happened, and practical repair or
                  replacement options before work begins.
                </p>
              </div>

              <div className="border-t border-[#303B43]/20 pt-5">
                <p className="text-xs font-bold tabular-nums text-[#2457F5] mb-2">03</p>
                <h3 className="font-display font-bold text-2xl mb-2">
                  Respect for Occupied Spaces
                </h3>
                <p className="text-sm sm:text-base text-[#303B43]/80 leading-relaxed">
                  Work zones are protected during installation and left clean once pressure testing
                  and fixture checks are finished.
                </p>
              </div>

              <div className="border-t border-[#303B43]/20 pt-5">
                <p className="text-xs font-bold tabular-nums text-[#2457F5] mb-2">04</p>
                <h3 className="font-display font-bold text-2xl mb-2">
                  Pack-First Work Ethic
                </h3>
                <p className="text-sm sm:text-base text-[#303B43]/80 leading-relaxed">
                  Rooted in real blue-collar craftsmanship, accountability to family, and standing
                  firmly behind every turn of the wrench.
                </p>
              </div>
            </div>
          </div>

          {config?.businessLocation && (
            <div className="mt-14 pt-8 border-t border-[#303B43]/15 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#18B9B0]">
                Verified Service Area
              </p>
              <p className="text-lg font-display font-bold text-[#303B43]">
                {config.businessLocation}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 6. FULL-BLEED SERVICE INQUIRY CTA BAND */}
      <section className="reveal-band relative py-24 md:py-32 overflow-hidden text-white">
        <div className="absolute inset-0">
          <ResilientImage
            src={BRAND_ASSETS.craftsmanshipToolsWorkbench}
            alt="Organized plumbing wrenches, copper tubing, and brass fittings on oak workbench"
            className="w-full h-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#2457F5]/88 via-[#2457F5]/72 to-[#18B9B0]/62"
          />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D7F34A] mb-3">
              Direct Service Inquiry
            </p>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight mb-5">
              Ready to discuss your plumbing project or repair?
            </h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Send your scope details through our service request page or connect directly on
              Instagram at {VERIFIED_BRAND.instagramHandle}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8 shrink-0">
            <BorderlessCta
              label="REQUEST A SERVICE"
              onClick={() => onNavigate('/contact')}
              tone="lime"
              size="lg"
            />
            <BorderlessCta
              label="DM ON INSTAGRAM"
              href={VERIFIED_BRAND.instagramUrl}
              external
              tone="light"
              size="lg"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
