import { useState } from 'react';
import { ScrollProgressBar } from '@/components/layout/ScrollProgressBar';
import { Navigation } from '@/components/layout/Navigation';
import { ParallaxContainer } from '@/components/layout/ParallaxContainer';
import { HeroIntro } from '@/components/chapters/HeroIntro';
import { TechArsenal } from '@/components/chapters/TechArsenal';
import { CaseStudies } from '@/components/chapters/CaseStudies';
import { Contact } from '@/components/chapters/Contact';
import Footer from '@/components/Footer';
import ProjectsArchive from '@/components/ProjectsArchive';

function App() {
  const [showArchive, setShowArchive] = useState(false);

  const handleShowArchive = () => {
    setShowArchive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setShowArchive(false);
    // Wait for DOM to render, then scroll to projects section
    setTimeout(() => {
      const el = document.getElementById('case-studies');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (showArchive) {
    return <ProjectsArchive onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-cyan-500/30 selection:text-cyan-900">
      <ScrollProgressBar />
      <Navigation />
      <ParallaxContainer>
        <HeroIntro />
        <TechArsenal />
        <CaseStudies onShowArchive={handleShowArchive} />
        <Contact />
        <Footer />
      </ParallaxContainer>
    </div>
  );
}

export default App;
