import { createContext, useContext } from 'react';
import { MotionConfig } from 'framer-motion';
import { usePrefersReducedMotion } from '../lib/motion';

const ReducedMotionContext = createContext(false);

export function useReducedMotion() {
  return useContext(ReducedMotionContext);
}

export default function MotionProvider({ children }) {
  const reduced = usePrefersReducedMotion();

  return (
    <ReducedMotionContext.Provider value={reduced}>
      <MotionConfig reducedMotion={reduced ? 'always' : 'never'} transition={{ duration: 0.5 }}>
        {children}
      </MotionConfig>
    </ReducedMotionContext.Provider>
  );
}
