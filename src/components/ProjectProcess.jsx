import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { process } from '../content/copy';
import { fadeUp } from '../lib/motion';
import './project-process.css';

export default function ProjectProcess() {
  const [active, setActive] = useState(0);
  const stages = process.stages;
  const progress = ((active + 1) / stages.length) * 100;

  function focusTab(index) {
    const el = document.getElementById(`stage-tab-${index}`);
    el?.focus();
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const next = (active + 1) % stages.length;
      setActive(next);
      focusTab(next);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prev = (active - 1 + stages.length) % stages.length;
      setActive(prev);
      focusTab(prev);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
      focusTab(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(stages.length - 1);
      focusTab(stages.length - 1);
    }
  }

  return (
    <section className="section process-section" aria-labelledby="process-heading">
      <div className="container container--narrow process-section__header">
        <motion.h2
          id="process-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          {process.heading}
        </motion.h2>
        <p className="process-section__supporting">{process.supporting}</p>
      </div>

      <div className="container process">
        <div className="process__rail-track" aria-hidden="true">
          <span className="process__rail-fill" style={{ width: `${progress}%` }} />
        </div>

        <div
          className="process__tablist"
          role="tablist"
          aria-label="Етапи проєкту"
          onKeyDown={handleKeyDown}
        >
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              id={`stage-tab-${index}`}
              role="tab"
              type="button"
              aria-selected={active === index}
              aria-controls={`stage-panel-${index}`}
              tabIndex={active === index ? 0 : -1}
              className={`process__tab ${active === index ? 'process__tab--active' : ''}`}
              onClick={() => setActive(index)}
            >
              <span className="process__tab-index">{stage.index}</span>
              <span className="process__tab-title">{stage.title}</span>
            </button>
          ))}
        </div>

        <div className="process__panel-wrap">
          <AnimatePresence mode="wait">
            <motion.div
              key={stages[active].id}
              id={`stage-panel-${active}`}
              role="tabpanel"
              aria-labelledby={`stage-tab-${active}`}
              tabIndex={0}
              className="process__panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <p>{stages[active].description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
