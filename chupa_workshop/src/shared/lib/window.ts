// lib/window.ts
export const WindowService = {
  getInnerWidth: () => (typeof window !== 'undefined' ? window.innerWidth : 0),
  addResizeListener: (handler: () => void) => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handler);
      return () => window.removeEventListener('resize', handler);
    }
    return () => {};
  },
};
