import React from 'react';
import { BRAND_ASSETS } from '../assets/media';
import { VERIFIED_BRAND, type PageRoute } from '../data/brandData';
import { BorderlessCta } from './BorderlessCta';

export interface PublicBusinessConfig {
  brandName: string;
  instagramHandle: string;
  instagramUrl: string;
  businessLocation: string | null;
  businessPhone: string | null;
  businessEmail: string | null;
  smtpConfigured: boolean;
}

interface FooterProps {
  onNavigate: (route: PageRoute, hash?: string) => void;
  config: PublicBusinessConfig | null;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, config }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2457F5] text-white">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24">
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-white/20">
          <div className="lg:col-span-5 flex flex-col items-start gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/95 p-2.5 shrink-0">
                <img
                  src={BRAND_ASSETS.logo}
                  alt="THE AMERICAN PLUMBER Logo"
                  className="h-14 sm:h-16 w-auto object-contain"
                />
              </div>
              <div>
                <p className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight leading-none">
                  THE AMERICAN PLUMBER
                </p>
                <p className="text-sm text-white/80 mt-2">
                  Plumber by trade · Faith over fear
                </p>
              </div>
            </div>

            <p className="text-white/85 text-base leading-relaxed max-w-md">
              “{VERIFIED_BRAND.packQuote}”
            </p>

            <BorderlessCta
              label={`FOLLOW ${VERIFIED_BRAND.instagramHandle.toUpperCase()}`}
              href={VERIFIED_BRAND.instagramUrl}
              external
              tone="lime"
              size="sm"
            />
          </div>

          <div className="lg:col-span-3 flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#F2C45C] mb-2">
              Navigation
            </p>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="text-base font-medium text-white/90 hover:text-[#D7F34A] transition-colors py-1"
            >
              Home
            </a>
            <a
              href="/services"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/services');
              }}
              className="text-base font-medium text-white/90 hover:text-[#D7F34A] transition-colors py-1"
            >
              Plumbing Services
            </a>
            <a
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/about');
              }}
              className="text-base font-medium text-white/90 hover:text-[#D7F34A] transition-colors py-1"
            >
              About & Philosophy
            </a>
            <a
              href="/about#our-work"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/about', 'our-work');
              }}
              className="text-base font-medium text-white/90 hover:text-[#D7F34A] transition-colors py-1"
            >
              Our Work
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/contact');
              }}
              className="text-base font-medium text-white/90 hover:text-[#D7F34A] transition-colors py-1"
            >
              Contact & Service Request
            </a>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#F2C45C] mb-1">
              Direct Channels
            </p>
            <div className="text-sm text-white/85 space-y-2.5 leading-relaxed">
              <p>
                <span className="text-white/60 block text-xs uppercase tracking-wider">
                  Official Instagram
                </span>
                <a
                  href={VERIFIED_BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white hover:text-[#D7F34A] transition-colors"
                >
                  instagram.com/the_american_plumber
                </a>
              </p>

              {config?.businessLocation && (
                <p>
                  <span className="text-white/60 block text-xs uppercase tracking-wider">
                    Verified Service Area
                  </span>
                  <span className="font-medium text-white">{config.businessLocation}</span>
                </p>
              )}

              {config?.businessPhone && (
                <p>
                  <span className="text-white/60 block text-xs uppercase tracking-wider">
                    Phone
                  </span>
                  <a
                    href={`tel:${config.businessPhone}`}
                    className="font-medium text-white hover:text-[#D7F34A]"
                  >
                    {config.businessPhone}
                  </a>
                </p>
              )}

              {config?.businessEmail && (
                <p>
                  <span className="text-white/60 block text-xs uppercase tracking-wider">
                    Email
                  </span>
                  <a
                    href={`mailto:${config.businessEmail}`}
                    className="font-medium text-white hover:text-[#D7F34A]"
                  >
                    {config.businessEmail}
                  </a>
                </p>
              )}
            </div>

            <div className="pt-2">
              <BorderlessCta
                label="START A SERVICE REQUEST"
                onClick={() => onNavigate('/contact')}
                tone="light"
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Bottom Quiet Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/70">
          <p>© {year} THE AMERICAN PLUMBER. All rights reserved.</p>
          <p>
            Verified social profile:{' '}
            <a
              href={VERIFIED_BRAND.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              {VERIFIED_BRAND.instagramHandle}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
