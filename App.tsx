import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { ScrollProgressBar } from '@/components/layout/ScrollProgressBar';
import { Navigation } from '@/components/layout/Navigation';
import { ParallaxContainer } from '@/components/layout/ParallaxContainer';
import { HeroIntro } from '@/components/chapters/HeroIntro';
import { TechArsenal } from '@/components/chapters/TechArsenal';
import { CaseStudies } from '@/components/chapters/CaseStudies';
import { Contact } from '@/components/chapters/Contact';
import Footer from '@/components/Footer';
import ProjectsArchive from '@/components/ProjectsArchive';
import { ProjectDetail } from '@/src/components/pages/ProjectDetail';
import { WritingArchive } from '@/src/components/pages/WritingArchive';
import { ArticleDetail } from '@/src/components/pages/ArticleDetail';
import { ArchitectureDemo } from '@/src/components/pages/ArchitectureDemo';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-cyan-500/30 selection:text-cyan-900">
      <ScrollProgressBar />
      <Navigation />
      <ParallaxContainer>
        <HeroIntro />
        <TechArsenal />
        <CaseStudies onShowArchive={() => { window.location.href = '/work'; }} />
        <Contact />
        <Footer />
      </ParallaxContainer>
    </div>
  );
};

export function App() {
  return (
    <Router base="/">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/work" component={() => <ProjectsArchive onBack={() => { window.location.href = '/'; }} />} />
        <Route path="/work/:slug" component={ProjectDetail} />
        <Route path="/writing" component={WritingArchive} />
        <Route path="/writing/:slug" component={ArticleDetail} />
        <Route path="/architecture/:slug" component={ArchitectureDemo} />
        <Route>
          <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700 p-4">
            <div className="text-center font-mono">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
              <p className="text-slate-500 mb-4">Page Not Found</p>
              <a href="/" className="text-cyan-700 underline">Back Home</a>
            </div>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
