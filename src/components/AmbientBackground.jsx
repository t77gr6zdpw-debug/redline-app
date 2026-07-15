import { useEffect } from 'react';
import { useReducedMotion } from './MotionProvider';
import './ambient-background.css';

export default function AmbientBackground() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    function handleVisibility() {
      document.body.classList.toggle('ambient-paused', document.hidden);
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [reduced]);

  return (
    <div className={`ambient-bg ${reduced ? 'ambient-bg--static' : ''}`} aria-hidden="true">
      <div className="ambient-bg__blob ambient-bg__blob--a" />
      <div className="ambient-bg__blob ambient-bg__blob--b" />
      <div className="ambient-bg__grid" />
    </div>
  );
}
