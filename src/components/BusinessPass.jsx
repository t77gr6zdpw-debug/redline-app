import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { RedLineWordmark, ProBiznesWordmark } from './Wordmark';
import MagneticButton from './MagneticButton';
import { useReducedMotion } from './MotionProvider';
import { useLowPowerHint } from '../lib/motion';
import { businessPass } from '../content/copy';
import { EVENTS, trackEvent } from '../lib/analytics';
import './business-pass.css';

export default function BusinessPass({ onActivate }) {
  const prefersReduced = useReducedMotion();
  const lowPower = useLowPowerHint();
  const reduced = prefersReduced || lowPower;
  const cardRef = useRef(null);
  const [flipped, setFlipped] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 150, damping: 18, mass: 0.4 });
  const springY = useSpring(py, { stiffness: 150, damping: 18, mass: 0.4 });
  const tiltX = useTransform(springY, [0, 1], [8, -8]);
  const tiltY = useTransform(springX, [0, 1], [-8, 8]);
  const glareX = useTransform(springX, [0, 1], ['10%', '90%']);
  const glareY = useTransform(springY, [0, 1], ['10%', '90%']);

  function handlePointerMove(event) {
    if (reduced || event.pointerType === 'touch') return;
    const rect = cardRef.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  function toggleFlip() {
    setFlipped((prev) => {
      const next = !prev;
      trackEvent(EVENTS.BUSINESS_PASS_FLIP, { flipped: next });
      return next;
    });
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFlip();
    }
  }

  function handleActivate(event) {
    event.stopPropagation();
    trackEvent(EVENTS.BUSINESS_PASS_ACTIVATE);
    onActivate();
  }

  return (
    <section className="section business-pass-section" aria-labelledby="business-pass-heading">
      <div className="container container--narrow business-pass-section__header">
        <p className="eyebrow">{businessPass.eyebrow}</p>
        <h2 id="business-pass-heading" className="business-pass-section__heading">
          {businessPass.heading}
        </h2>
      </div>
      <div className="business-pass-stage">
      <motion.div
        animate={reduced ? undefined : { y: [0, -10, 0] }}
        transition={reduced ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
      <div
        ref={cardRef}
        className="business-pass"
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={
          flipped
            ? 'Business Pass, зворотний бік. Натисніть, щоб побачити передню сторону.'
            : 'Business Pass, передній бік. Натисніть, щоб дізнатися про умови.'
        }
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {!reduced && (
          <div className="business-pass__border-glow" aria-hidden="true">
            <div className="business-pass__border-glow-spin" />
          </div>
        )}
        <motion.div
          className="business-pass__inner"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: reduced ? 0.001 : 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={reduced ? undefined : { rotateX: tiltX, rotateZ: tiltY }}
        >
          <div className="business-pass__face business-pass__face--front">
            {!reduced && (
              <motion.div
                className="business-pass__glare"
                style={{
                  background: `radial-gradient(180px 180px at ${glareX} ${glareY}, rgba(255,255,255,0.16), transparent 70%)`,
                }}
                aria-hidden="true"
              />
            )}
            <div className="business-pass__edge-light" aria-hidden="true" />
            <div className="business-pass__header">
              <span className="business-pass__label">{businessPass.front.label}</span>
              <span className="business-pass__chip" aria-hidden="true" />
            </div>
            <div className="business-pass__brands">
              <ProBiznesWordmark size="sm" imageOnly />
              <span className="business-pass__x" aria-hidden="true">×</span>
              <RedLineWordmark size="sm" imageOnly />
            </div>
            <p className="business-pass__partners">{businessPass.front.partners}</p>
            <ul className="business-pass__perks">
              {businessPass.front.perks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
            <p className="business-pass__hint">{businessPass.front.hint}</p>
          </div>

          <div className="business-pass__face business-pass__face--back">
            <div className="business-pass__edge-light" aria-hidden="true" />
            <p className="business-pass__back-title">{businessPass.back.title}</p>
            <p className="business-pass__back-detail">{businessPass.back.detail}</p>
            <MagneticButton
              type="button"
              className="btn btn-primary business-pass__activate"
              onClick={handleActivate}
            >
              {businessPass.back.cta}
            </MagneticButton>
          </div>
        </motion.div>
      </div>
      </motion.div>
      </div>
    </section>
  );
}
