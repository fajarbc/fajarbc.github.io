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

  if (showArchive) {
    return <ProjectsArchive onBack={() => setShowArchive(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <ScrollProgressBar />
      <Navigation />
      <ParallaxContainer>
        <HeroIntro />
        <TechArsenal />
        <CaseStudies onShowArchive={() => setShowArchive(true)} />
        <Contact />
        <Footer />
      </ParallaxContainer>
    </div>
  );
}

export default App;
