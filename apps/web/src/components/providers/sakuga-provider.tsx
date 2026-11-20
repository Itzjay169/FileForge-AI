'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';

interface SakugaContextType {
  isReady: boolean;
  loadedComponents: string[];
  loadComponent: (name: string) => Promise<void>;
}

const SakugaContext = createContext<SakugaContextType>({
  isReady: false,
  loadedComponents: [],
  loadComponent: async () => {},
});

export const useSakuga = () => useContext(SakugaContext);

const SAKUGA_SCRIPTS = [
  'core.js',
  'button.js',
  'slider.js',
  'checkbox.js',
  'radio.js',
  'input.js',
  'tabs.js',
  'progress.js',
  'rating.js',
  'toast.js',
  'tooltip.js',
] as const;

export const SakugaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [loaded, setLoaded] = useState<string[]>([]);
  const pathname = usePathname();

  const loadScript = (scriptName: string): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      window.__sakuga_loaded__ = window.__sakuga_loaded__ || new Set<string>();

      if (window.__sakuga_loaded__.has(scriptName)) {
        resolve();
        return;
      }

      const existing = document.querySelector(`script[data-sakuga="${scriptName}"]`);
      if (existing) {
        window.__sakuga_loaded__.add(scriptName);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `/sakuga-vfx/${scriptName}`;
      script.dataset.sakuga = scriptName;
      script.async = false; // Preserve load order: core first, then components
      script.onload = () => {
        window.__sakuga_loaded__?.add(scriptName);
        setLoaded((prev) => (prev.includes(scriptName) ? prev : [...prev, scriptName]));
        resolve();
      };
      script.onerror = () => {
        console.warn(`[SakugaProvider] Failed to load /sakuga-vfx/${scriptName}`);
        resolve(); // Don't block
      };
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    let isMounted = true;

    async function initSakuga() {
      // 1. Load core first to establish window.SakugaFX
      await loadScript('core.js');

      // 2. Load all component scripts
      for (const name of SAKUGA_SCRIPTS.slice(1)) {
        await loadScript(name);
      }

      if (isMounted) {
        setIsReady(true);
      }
    }

    initSakuga();

    return () => {
      isMounted = false;
    };
  }, []);

  // Route change safety: ensure fx canvas pointer-events remains none
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const canvases = document.querySelectorAll('canvas.sakuga-fx');
      canvases.forEach((c) => {
        (c as HTMLElement).style.pointerEvents = 'none';
      });
    }
  }, [pathname]);

  const value = useMemo(
    () => ({
      isReady,
      loadedComponents: loaded,
      loadComponent: loadScript,
    }),
    [isReady, loaded]
  );

  return (
    <SakugaContext.Provider value={value}>
      {children}
    </SakugaContext.Provider>
  );
};
