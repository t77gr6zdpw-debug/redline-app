import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { RedLineWordmark, ProBiznesWordmark } from './Wordmark';
import { useReducedMotion } from './MotionProvider';
import { useLowPowerHint } from '../lib/motion';
import './logo-stage.css';

export default function LogoStage({ compact = false }) {
  const prefersReduced = useReducedMotion();
  const lowPower = useLowPowerHint();
  const reduced = prefersReduced || lowPower;
  const stageRef = useRef(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springX = useSpring(px, { stiffness: 120, damping: 20, mass: 0.4 });
  const springY = useSpring(py, { stiffness: 120, damping: 20, mass: 0.4 });

  const rotateY = useTransform(springX, [0, 1], [-8, 8]);
  const rotateX = useTransform(springY, [0, 1], [7, -7]);
  const lightX = useTransform(springX, [0, 1], ['20%', '80%']);
  const lightY = useTransform(springY, [0, 1], ['20%', '80%']);

  function handlePointerMove(event) {
    if (reduced || event.pointerType === 'touch') return;
    const rect = stageRef.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div
      ref={stageRef}
      className={`logo-stage ${compact ? 'logo-stage--compact' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className="logo-stage__world"
        style={reduced ? undefined : { rotateX, rotateY }}
      >
        <motion.div
          className="logo-stage__plate logo-stage__plate--back"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <ProBiznesWordmark size={compact ? 'sm' : 'md'} />
        </motion.div>

        <div className="logo-stage__connector" aria-hidden="true">×</div>

        <motion.div
          className="logo-stage__plate logo-stage__plate--front"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          <RedLineWordmark size={compact ? 'sm' : 'md'} />
        </motion.div>

        {!reduced && (
          <motion.div
            className="logo-stage__glow"
            style={{
              background: `radial-gradient(220px 220px at ${lightX} ${lightY}, var(--red-glow-soft), transparent 70%)`,
            }}
            aria-hidden="true"
          />
        )}
      </motion.div>
    </div>
  );
}
