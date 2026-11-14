import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { BRAND_ASSETS } from '../assets/media';
import { PLUMBING_SERVICES, type PageRoute } from '../data/brandData';
import { BorderlessCta } from './BorderlessCta';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute, hash?: string, servicePreselect?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 44);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [currentRoute]);

  const openDropdown = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setServicesOpen(true);
  };

  const scheduleCloseDropdown = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setServicesOpen(false);
    }, 180);
  };

  // Home and Services start over full-bleed dark-contrasted hero photography;
  // About and Contact start on light editorial grounds unless scrolled.
  const hasDarkHeroTop = currentRoute === '/' || currentRoute === '/services';
  const useLightText = hasDarkHeroTop && !isScrolled && !mobileOpen;

  const navTextClass = useLightText
    ? 'text-white hover:text-[#F2C45C]'
    : 'text-[#303B43] hover:text-[#2457F5]';

  const headerBgClass = isScrolled
    ? 'bg-[#FFFDF7]/95 backdrop-blur-md border-b border-[#303B43]/10'
    : hasDarkHeroTop
      ? 'bg-gradient-to-b from-black/35 to-transparent'
      : 'bg-[#FFFDF7]/90 backdrop-blur-sm border-b border-[#303B43]/10';

  const handleLinkClick = (route: PageRoute, hash?: string) => {
    setMobileOpen(false);
    setServicesOpen(false);
    onNavigate(route, hash);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${headerBgClass}`}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-20 md:h-24 flex items-center justify-between gap-6 lg:gap-8">
        {/* Zone 1: Prominent Original Logo + Brand Title */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('/');
          }}
          className="flex items-center gap-3.5 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2457F5]"
          aria-label="THE AMERICAN PLUMBER Home"
        >
          <img
            src={BRAND_ASSETS.logo}
            alt="THE AMERICAN PLUMBER Logo"
            className="h-12 sm:h-14 md:h-16 w-auto object-contain shrink-0"
          />
          <span
            className={`font-display font-extrabold tracking-tight text-lg sm:text-xl md:text-2xl whitespace-nowrap shrink-0 transition-colors duration-300 ${
              useLightText ? 'text-white' : 'text-[#303B43]'
            }`}
          >
            THE AMERICAN PLUMBER
          </span>
        </a>

        {/* Zone 2: Single-line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 xl:gap-9"
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/');
            }}
            className={`nav-link-item text-sm tracking-wide uppercase ${navTextClass} ${
              currentRoute === '/' ? 'is-active' : ''
            }`}
          >
            Home
          </a>

          {/* Dropdown wrapper with seamless hover bridge */}
          <div
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={scheduleCloseDropdown}
          >
            <button
              type="button"
              aria-expanded={servicesOpen}
              onClick={() => handleLinkClick('/services')}
              className={`nav-link-item text-sm tracking-wide uppercase gap-1.5 bg-transparent border-0 cursor-pointer ${navTextClass} ${
                currentRoute === '/services' ? 'is-active' : ''
              }`}
            >
              <span>Plumbing Services</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  servicesOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {servicesOpen && (
              <div
                onMouseEnter={openDropdown}
                onMouseLeave={scheduleCloseDropdown}
                className="absolute left-0 top-full pt-2 w-80 z-50"
              >
                <div className="bg-[#FFFDF7] border-t-2 border-[#2457F5] shadow-xl py-4 px-6 flex flex-col gap-1">
                  {PLUMBING_SERVICES.map((svc) => (
                    <a
                      key={svc.id}
                      href={`/services#${svc.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick('/services', svc.id);
                      }}
                      className="py-2.5 border-b border-[#303B43]/10 last:border-b-0 flex items-baseline justify-between gap-3 text-[#303B43] hover:text-[#2457F5] transition-colors"
                    >
                      <span className="text-xs font-semibold tabular-nums text-[#18B9B0]">
                        {svc.number}.
                      </span>
                      <span className="text-sm font-semibold flex-1 leading-snug">
                        {svc.title}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/about');
            }}
            className={`nav-link-item text-sm tracking-wide uppercase ${navTextClass} ${
              currentRoute === '/about' ? 'is-active' : ''
            }`}
          >
            About
          </a>

          <a
            href="/about#our-work"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/about', 'our-work');
            }}
            className={`nav-link-item text-sm tracking-wide uppercase ${navTextClass}`}
          >
            Our Work
          </a>

          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/contact');
            }}
            className={`nav-link-item text-sm tracking-wide uppercase ${navTextClass} ${
              currentRoute === '/contact' ? 'is-active' : ''
            }`}
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: Single Primary Borderless CTA + Mobile Menu Button */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:block">
            <BorderlessCta
              label="REQUEST A SERVICE"
              onClick={() => handleLinkClick('/contact')}
              tone={useLightText ? 'light' : 'blue'}
              size="sm"
            />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className={`lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-transparent border-0 cursor-pointer ${
              useLightText ? 'text-white' : 'text-[#303B43]'
            }`}
          >
            {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Full-Width Editorial Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#FFFDF7] text-[#303B43] border-t border-[#303B43]/15 px-6 py-8 flex flex-col gap-5 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/');
            }}
            className="font-display font-bold text-2xl py-2 border-b border-[#303B43]/10 flex items-center justify-between"
          >
            <span>Home</span>
          </a>
          <a
            href="/services"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/services');
            }}
            className="font-display font-bold text-2xl py-2 border-b border-[#303B43]/10 flex items-center justify-between"
          >
            <span>Plumbing Services</span>
          </a>
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/about');
            }}
            className="font-display font-bold text-2xl py-2 border-b border-[#303B43]/10 flex items-center justify-between"
          >
            <span>About</span>
          </a>
          <a
            href="/about#our-work"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/about', 'our-work');
            }}
            className="font-display font-bold text-2xl py-2 border-b border-[#303B43]/10 flex items-center justify-between"
          >
            <span>Our Work</span>
          </a>
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/contact');
            }}
            className="font-display font-bold text-2xl py-2 border-b border-[#303B43]/10 flex items-center justify-between"
          >
            <span>Contact</span>
          </a>
          <div className="pt-2">
            <BorderlessCta
              label="REQUEST A SERVICE"
              onClick={() => handleLinkClick('/contact')}
              tone="blue"
              size="lg"
            />
          </div>
        </div>
      )}
    </header>
  );
};
