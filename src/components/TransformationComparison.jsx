import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { transformation } from '../content/copy';
import { EVENTS, trackEvent } from '../lib/analytics';
import { fadeUp, skewSettle } from '../lib/motion';
import './transformation-comparison.css';

function BeforeMock() {
  return (
    <div className="mock mock--before" aria-hidden="true">
      <div className="mock__bar mock__bar--dated" />
      <div className="mock__row">
        <span className="mock__pill" />
        <span className="mock__pill" />
        <span className="mock__pill mock__pill--wide" />
        <span className="mock__pill" />
      </div>
      <div className="mock__line mock__line--w70" />
      <div className="mock__line mock__line--w40" />
      <div className="mock__grid">
        <span className="mock__block mock__block--offset" />
        <span className="mock__block" />
        <span className="mock__block mock__block--small" />
      </div>
      <div className="mock__line mock__line--w55" />
    </div>
  );
}

function AfterMock() {
  return (
    <div className="mock mock--after" aria-hidden="true">
      <div className="mock__headline" />
      <div className="mock__subline" />
      <span className="mock__cta" />
      <div className="mock__grid mock__grid--clean">
        <span className="mock__card" />
        <span className="mock__card" />
        <span className="mock__card" />
      </div>
      <div className="mock__trust" />
    </div>
  );
}

export default function TransformationComparison() {
  const [value, setValue] = useState(50);
  const hasTracked = useRef(false);

  function handleChange(event) {
    setValue(Number(event.target.value));
    if (!hasTracked.current) {
      hasTracked.current = true;
      trackEvent(EVENTS.COMPARISON_INTERACTION);
    }
  }

  return (
    <section className="section comparison-section" aria-labelledby="comparison-heading">
      <div className="container container--narrow comparison-section__header">
        <motion.h2
          id="comparison-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={skewSettle}
        >
          {transformation.heading}
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          className="comparison-section__supporting"
        >
          {transformation.supporting}
        </motion.p>
      </div>

      <div className="container comparison">
        <div className="comparison__frame">
          <AfterMock />
          <div
            className="comparison__before-layer"
            style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
          >
            <BeforeMock />
          </div>
          <div className="comparison__divider" style={{ left: `${value}%` }} aria-hidden="true" />
        </div>

        <div className="comparison__labels" aria-hidden="true">
          <span>{transformation.before.label}</span>
          <span>{transformation.after.label}</span>
        </div>

        <label className="comparison__slider-label" htmlFor="comparison-range">
          {transformation.sliderLabel}
        </label>
        <input
          id="comparison-range"
          className="comparison__range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={handleChange}
        />

        <div className="comparison__lists">
          <div className="comparison__list-col">
            <h3>{transformation.before.label}</h3>
            <ul>
              {transformation.before.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="comparison__list-col comparison__list-col--after">
            <h3>{transformation.after.label}</h3>
            <ul>
              {transformation.after.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
