import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePointerFine } from '../lib/device';
import { useReducedMotion } from './MotionProvider';

const STRENGTH = 0.35;
const MAX_OFFSET = 14;

export default function MagneticButton({ as = 'button', className = '', children, ...rest }) {
  const ref = useRef(null);
  const pointerFine = usePointerFine();
  const reduced = useReducedMotion();
  const enabled = pointerFine && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function handlePointerMove(event) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, relX * STRENGTH)));
    y.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, relY * STRENGTH)));
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  const MotionTag = motion[as] ?? motion.button;

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={enabled ? { x: springX, y: springY } : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
