import { lazy, Suspense, useCallback, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import MotionProvider from './components/MotionProvider';
import StickyNav from './components/StickyNav';
import CollaborationHero from './components/CollaborationHero';
import BusinessPass from './components/BusinessPass';
import TransformationComparison from './components/TransformationComparison';
import ProjectProcess from './components/ProjectProcess';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

const LeadModal = lazy(() => import('./components/LeadModal'));

export default function App() {
  const heroRef = useRef(null);
  const passRef = useRef(null);
  const [isLeadOpen, setLeadOpen] = useState(false);

  const openLead = useCallback(() => setLeadOpen(true), []);
  const closeLead = useCallback(() => setLeadOpen(false), []);

  const scrollToPass = useCallback(() => {
    passRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <MotionProvider>
      <a href="#main-content" className="skip-link">
        Перейти до основного контенту
      </a>

      <StickyNav heroRef={heroRef} onCta={openLead} />

      <main id="main-content">
        <div ref={heroRef}>
          <CollaborationHero onPrimaryCta={openLead} onSecondaryCta={scrollToPass} />
        </div>

        <div ref={passRef}>
          <BusinessPass onActivate={openLead} />
        </div>

        <TransformationComparison />
        <ProjectProcess />
        <FinalCTA onPrimaryCta={openLead} onSecondaryCta={openLead} />
      </main>

      <Footer />

      <Suspense fallback={null}>
        <AnimatePresence>{isLeadOpen && <LeadModal onClose={closeLead} />}</AnimatePresence>
      </Suspense>
    </MotionProvider>
  );
}
