'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/** Hook to detect prefers-reduced-motion */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

/** Hook to detect if element is in viewport */
export function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

/** Hook to detect screen size breakpoints */
export function useBreakpoint() {
  const [bp, setBp] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 640) setBp('mobile');
      else if (window.innerWidth < 1024) setBp('tablet');
      else setBp('desktop');
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return bp;
}

/** Debounced callback */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/** Copy to clipboard with status */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);
  return { copy, copied };
}

/** Hook to detect and track active theme state (light vs dark) across any component */
export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const checkIsDark = () => {
      if (typeof document === 'undefined') return false;
      return document.documentElement.classList.contains('dark');
    };

    const animFrame = requestAnimationFrame(() => {
      setMounted(true);
      setIsDark(checkIsDark());
    });

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isDark: boolean }>;
      if (typeof customEvent.detail?.isDark === 'boolean') {
        setIsDark(customEvent.detail.isDark);
      } else {
        setIsDark(checkIsDark());
      }
    };

    window.addEventListener('fileforge:themechange', handleThemeChange);

    const observer = new MutationObserver(() => {
      setIsDark(checkIsDark());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('fileforge:themechange', handleThemeChange);
      observer.disconnect();
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const nextDark = !document.documentElement.classList.contains('dark');
    if (nextDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    try {
      localStorage.setItem('fileforge-theme', nextDark ? 'dark' : 'light');
    } catch {}
    setIsDark(nextDark);
    window.dispatchEvent(new CustomEvent('fileforge:themechange', { detail: { isDark: nextDark } }));
  }, []);

  return { isDark, theme: isDark ? 'dark' : 'light', toggleTheme, mounted };
}
