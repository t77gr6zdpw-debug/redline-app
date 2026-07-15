import { motion } from 'framer-motion';
import LogoStage from './LogoStage';
import MagneticButton from './MagneticButton';
import { hero } from '../content/copy';
import { EVENTS, trackEvent } from '../lib/analytics';
import { fadeUp } from '../lib/motion';
import { useReducedMotion } from './MotionProvider';
import './collaboration-hero.css';

export default function CollaborationHero({ onPrimaryCta, onSecondaryCta }) {
  const reduced = useReducedMotion();

  function handlePrimary() {
    trackEvent(EVENTS.HERO_CTA_CLICK, { cta: 'primary' });
    onPrimaryCta();
  }

  function handleSecondary() {
    trackEvent(EVENTS.HERO_CTA_CLICK, { cta: 'secondary' });
    onSecondaryCta();
  }

  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__atmosphere" aria-hidden="true" />
      <div className="container hero__container">
        <motion.p
          className="eyebrow"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {hero.eyebrow}
        </motion.p>

        <div className="hero__headline-mask">
          <motion.h1
            id="hero-heading"
            className="hero__headline"
            initial={{ y: reduced ? 0 : '105%', opacity: reduced ? 1 : 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          >
            {hero.headline}
          </motion.h1>
        </div>

        <LogoStage />

        <motion.p
          className="hero__supporting"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.16 }}
        >
          {hero.supporting}
        </motion.p>

        <motion.div
          className="hero__actions"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.24 }}
        >
          <MagneticButton type="button" className="btn btn-primary" onClick={handlePrimary}>
            {hero.ctaPrimary}
          </MagneticButton>
          <MagneticButton type="button" className="btn btn-secondary" onClick={handleSecondary}>
            {hero.ctaSecondary}
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
