import { Variants, Transition } from 'framer-motion';

/**
 * Sakuga Motion & Physics System
 * FileForge AI — Creative File Studio
 *
 * Principles:
 * - Physical squash on press, spring-loaded overshoot on release.
 * - Leading-edge particle and impact bursts on milestone completions.
 * - Zero decorative latency: all interactions complete under 300ms.
 * - Strict reduced-motion fallback honoring system preferences.
 */

export const springs = {
  squash: {
    type: 'spring',
    stiffness: 520,
    damping: 24,
    mass: 0.8
  } as Transition,
  snappy: {
    type: 'spring',
    stiffness: 420,
    damping: 26
  } as Transition,
  soft: {
    type: 'spring',
    stiffness: 260,
    damping: 20
  } as Transition,
  overshoot: {
    type: 'spring',
    stiffness: 380,
    damping: 15
  } as Transition
};

export const buttonMotion: Variants = {
  initial: {
    scaleX: 1,
    scaleY: 1,
    y: 0
  },
  hover: {
    y: -2,
    scale: 1.02,
    transition: springs.snappy
  },
  tap: {
    scaleX: 1.05,
    scaleY: 0.91,
    y: 2,
    transition: springs.squash
  }
};

export const magneticCardMotion: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: springs.soft
  },
  hover: {
    y: -5,
    boxShadow: '0 16px 36px -4px rgba(139, 92, 246, 0.25)',
    borderColor: 'rgba(236, 72, 153, 0.45)',
    transition: springs.snappy
  }
};

export const toastSmearMotion: Variants = {
  initial: {
    opacity: 0,
    x: 40,
    scaleX: 1.15,
    scaleY: 0.88
  },
  animate: {
    opacity: 1,
    x: 0,
    scaleX: 1,
    scaleY: 1,
    transition: springs.overshoot
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    x: 20,
    transition: { duration: 0.18, ease: 'easeIn' }
  }
};

export const tabIndicatorMotion: Variants = {
  initial: { scaleX: 0.8, opacity: 0 },
  animate: {
    scaleX: 1,
    opacity: 1,
    transition: springs.overshoot
  },
  exit: { scaleX: 0.8, opacity: 0 }
};

export const sliderThumbMotion: Variants = {
  idle: {
    scaleX: 1,
    scaleY: 1,
    boxShadow: '0 0 10px rgba(139, 92, 246, 0.4)'
  },
  dragging: {
    scaleX: 1.28,
    scaleY: 0.82,
    boxShadow: '0 0 24px rgba(236, 72, 153, 0.7)',
    transition: springs.squash
  }
};

export const modalCinematicMotion: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.93,
    y: 12
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springs.overshoot
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { duration: 0.15 }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02
    }
  }
};
