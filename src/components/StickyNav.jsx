import { useEffect, useRef, useState } from 'react';
import { RedLineWordmark } from './Wordmark';
import { hero } from '../content/copy';
import './sticky-nav.css';

export default function StickyNav({ heroRef, onCta }) {
  const [visible, setVisible] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const target = heroRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return undefined;

    observerRef.current = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '-70% 0px 0px 0px' },
    );
    observerRef.current.observe(target);

    return () => observerRef.current?.disconnect();
  }, [heroRef]);

  return (
    <div className={`sticky-nav ${visible ? 'sticky-nav--visible' : ''}`} aria-hidden={!visible}>
      <div className="sticky-nav__inner">
        <RedLineWordmark size="sm" />
        <button type="button" className="btn btn-primary sticky-nav__cta" onClick={onCta} tabIndex={visible ? 0 : -1}>
          {hero.ctaPrimary}
        </button>
      </div>
    </div>
  );
}
