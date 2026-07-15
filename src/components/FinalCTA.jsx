import { motion } from 'framer-motion';
import LogoStage from './LogoStage';
import MagneticButton from './MagneticButton';
import { finalCta } from '../content/copy';
import { fadeUp, scaleBlurIn } from '../lib/motion';
import './final-cta.css';

export default function FinalCTA({ onPrimaryCta, onSecondaryCta }) {
  return (
    <section className="section final-cta" aria-labelledby="final-cta-heading">
      <div className="final-cta__atmosphere" aria-hidden="true" />
      <div className="container final-cta__container">
        <LogoStage compact />

        <motion.h2
          id="final-cta-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={scaleBlurIn}
        >
          {finalCta.headline}
        </motion.h2>

        <motion.p
          className="final-cta__supporting"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          transition={{ delay: 0.08 }}
        >
          {finalCta.supporting}
        </motion.p>

        <motion.div
          className="final-cta__actions"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          transition={{ delay: 0.16 }}
        >
          <MagneticButton type="button" className="btn btn-primary" onClick={onPrimaryCta}>
            {finalCta.ctaPrimary}
          </MagneticButton>
          <MagneticButton type="button" className="btn btn-secondary" onClick={onSecondaryCta}>
            {finalCta.ctaSecondary}
          </MagneticButton>
        </motion.div>

        <p className="final-cta__clarification">{finalCta.clarification}</p>
      </div>
    </section>
  );
}
