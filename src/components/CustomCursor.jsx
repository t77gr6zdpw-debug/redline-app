import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePointerFine } from '../lib/device';
import { useReducedMotion } from './MotionProvider';
import './custom-cursor.css';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], input, textarea, select, [data-cursor-hover]';

export default function CustomCursor() {
  const pointerFine = usePointerFine();
  const reduced = useReducedMotion();
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 32, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 400, damping: 32, mass: 0.3 });

  const enabled = pointerFine && !reduced;

  useEffect(() => {
    if (!enabled) return undefined;

    function handleMove(event) {
      if (!visible) setVisible(true);
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target;
      setHovering(Boolean(target?.closest?.(INTERACTIVE_SELECTOR)));
    }

    function handleLeaveWindow() {
      setVisible(false);
    }

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeaveWindow);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('mouseleave', handleLeaveWindow);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className={`custom-cursor ${hovering ? 'custom-cursor--hover' : ''}`}
      style={{ x: springX, y: springY, opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    />
  );
}
