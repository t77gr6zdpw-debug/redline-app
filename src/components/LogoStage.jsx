import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { RedLineWordmark, ProBiznesWordmark } from './Wordmark';
import { useReducedMotion } from './MotionProvider';
import { useLowPowerHint } from '../lib/motion';
import { usePointerFine, useViewportAtLeast, isWebglSupported } from '../lib/device';
import ErrorBoundary from './ErrorBoundary';
import './logo-stage.css';

const LogoScene3D = lazy(() => import('../three/LogoScene3D'));

function useCanRender3D() {
  const reduced = useReducedMotion();
  const lowPower = useLowPowerHint();
  const pointerFine = usePointerFine();
  const wideEnough = useViewportAtLeast(860);
  const [webgl] = useState(isWebglSupported);
  return webgl && !reduced && !lowPower && pointerFine && wideEnough;
}

function CssLogoStage({ compact }) {
  const reduced = useReducedMotion();
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
      <motion.div className="logo-stage__world" style={reduced ? undefined : { rotateX, rotateY }}>
        <motion.div
          className="logo-stage__plate logo-stage__plate--back"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <motion.div
            animate={reduced ? undefined : { y: [0, -9, 0] }}
            transition={reduced ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <ProBiznesWordmark size={compact ? 'sm' : 'md'} priority />
          </motion.div>
        </motion.div>

        <div className="logo-stage__connector" aria-hidden="true">×</div>

        <motion.div
          className="logo-stage__plate logo-stage__plate--front"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          <motion.div
            animate={reduced ? undefined : { y: [0, 9, 0] }}
            transition={reduced ? undefined : { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          >
            <RedLineWordmark size={compact ? 'sm' : 'md'} priority />
          </motion.div>
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

function Scene3DStage({ compact }) {
  const wrapRef = useRef(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0.05,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`logo-stage logo-stage--3d ${compact ? 'logo-stage--compact' : ''}`}
      aria-hidden="true"
    >
      <Suspense fallback={<div className="logo-stage__3d-fallback" />}>
        <LogoScene3D compact={compact} active={active} />
      </Suspense>
    </div>
  );
}

export default function LogoStage({ compact = false }) {
  const canRender3D = useCanRender3D();

  return (
    <>
      <span className="visually-hidden">RedLine Studio × «Про Бізнес» — колаборація двох брендів</span>
      <ErrorBoundary fallback={<CssLogoStage compact={compact} />}>
        {canRender3D ? <Scene3DStage compact={compact} /> : <CssLogoStage compact={compact} />}
      </ErrorBoundary>
    </>
  );
}
