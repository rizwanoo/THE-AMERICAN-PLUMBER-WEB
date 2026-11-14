import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PageRoute } from '../data/brandData';

gsap.registerPlugin(ScrollTrigger);

interface ScrollProgressBarProps {
  route: PageRoute;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ route }) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const barEl = barRef.current;
    if (!barEl) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      const updateStatic = () => {
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
        barEl.style.transform = `scaleX(${progress})`;
      };
      updateStatic();
      window.addEventListener('scroll', updateStatic, { passive: true });
      window.addEventListener('resize', updateStatic, { passive: true });
      return () => {
        window.removeEventListener('scroll', updateStatic);
        window.removeEventListener('resize', updateStatic);
      };
    }

    gsap.set(barEl, { scaleX: 0, transformOrigin: 'left center' });

    const ctx = gsap.context(() => {
      gsap.to(barEl, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.15,
          invalidateOnRefresh: true,
        },
      });
    });

    const refreshId = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      window.clearTimeout(refreshId);
      ctx.revert();
    };
  }, [route]);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none bg-transparent"
    >
      <div
        ref={barRef}
        className="w-full h-full bg-[#2457F5] origin-left will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};
