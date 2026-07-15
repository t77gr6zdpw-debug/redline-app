import { motion } from 'framer-motion';
import LogoStage from './LogoStage';
import { hero } from '../content/copy';
import { EVENTS, trackEvent } from '../lib/analytics';
import { fadeUp } from '../lib/motion';
import './collaboration-hero.css';

export default function CollaborationHero({ onPrimaryCta, onSecondaryCta }) {
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

        <motion.h1
          id="hero-heading"
          className="hero__headline"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.08 }}
        >
          {hero.headline}
        </motion.h1>

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
          <button type="button" className="btn btn-primary" onClick={handlePrimary}>
            {hero.ctaPrimary}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleSecondary}>
            {hero.ctaSecondary}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
