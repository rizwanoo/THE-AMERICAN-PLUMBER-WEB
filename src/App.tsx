import { useCallback, useEffect, useState } from 'react';
import gsap from 'gsap';
import { Footer, type PublicBusinessConfig } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import type { PageRoute } from './data/brandData';
import { AboutWorkPage } from './pages/AboutWorkPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';

function resolveRoute(pathname: string): PageRoute {
  if (pathname === '/services' || pathname.startsWith('/services/')) return '/services';
  if (pathname === '/about' || pathname.startsWith('/about/') || pathname === '/our-work') {
    return '/about';
  }
  if (pathname === '/contact' || pathname.startsWith('/contact/')) return '/contact';
  return '/';
}

const PAGE_SEO: Record<PageRoute, { title: string; description: string }> = {
  '/': {
    title: 'THE AMERICAN PLUMBER — Expert Plumbing Craftsmanship',
    description:
      'Official website for THE AMERICAN PLUMBER (@the_american_plumber). Copper piping, water heater systems, fixture installations, and service requests.',
  },
  '/services': {
    title: 'Plumbing Services — THE AMERICAN PLUMBER',
    description:
      'Copper piping and manifolds, water heater installations, kitchen and bath fixture trim, and practical plumbing repairs by THE AMERICAN PLUMBER.',
  },
  '/about': {
    title: 'About & Our Work — THE AMERICAN PLUMBER',
    description:
      'Plumber by trade. Father of four. Faith over fear. Explore the trade philosophy and craftsmanship showcase of THE AMERICAN PLUMBER.',
  },
  '/contact': {
    title: 'Contact & Service Request — THE AMERICAN PLUMBER',
    description:
      'Submit a validated plumbing service request or connect with THE AMERICAN PLUMBER (@the_american_plumber) directly.',
  },
};

export default function App() {
  const [route, setRoute] = useState<PageRoute>(() => resolveRoute(window.location.pathname));
  const [config, setConfig] = useState<PublicBusinessConfig | null>(null);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setConfig(data as PublicBusinessConfig);
      })
      .catch(() => {
        // Non-blocking config read
      });
  }, []);

  useEffect(() => {
    const seo = PAGE_SEO[route];
    document.title = seo.title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', seo.description);
    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute('content', seo.title);
    const ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute('content', seo.description);
  }, [route]);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(resolveRoute(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = useCallback(
    (nextRoute: PageRoute, hash?: string, servicePreselect?: string) => {
      if (servicePreselect) {
        setPreselectedService(servicePreselect);
      }

      const targetUrl = hash ? `${nextRoute}#${hash}` : nextRoute;
      if (window.location.pathname + window.location.hash !== targetUrl) {
        window.history.pushState({}, '', targetUrl);
      }

      setRoute(nextRoute);

      window.requestAnimationFrame(() => {
        if (hash) {
          const target = document.getElementById(hash);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            return;
          }
        }
        window.scrollTo({ top: 0, behavior: 'auto' });
        const mainEl = document.getElementById('page-transition-stage');
        if (
          mainEl &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
          gsap.fromTo(
            mainEl,
            { opacity: 0.72, y: 10 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity' }
          );
        }
      });
    },
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-[#303B43]">
      <ScrollProgressBar route={route} />
      <Navbar currentRoute={route} onNavigate={handleNavigate} />

      <main id="page-transition-stage" className="flex-1">
        {route === '/' && <HomePage onNavigate={handleNavigate} config={config} />}
        {route === '/services' && <ServicesPage onNavigate={handleNavigate} />}
        {route === '/about' && <AboutWorkPage onNavigate={handleNavigate} />}
        {route === '/contact' && (
          <ContactPage config={config} preselectedService={preselectedService} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} config={config} />
    </div>
  );
}
