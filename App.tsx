
import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { RolesSection } from './components/RolesSection';
import { DataVisuals } from './components/DataVisuals';
import { Navbar } from './components/Navbar';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { ScrollPhrase } from './components/ScrollPhrase';
import LiquidEther from './components/LiquidEther';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#080A0F] text-white selection:bg-[#00F3FF]/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <LiquidEther
          colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
          mouseForce={20}
          cursorSize={100}
          autoSpeed={0.5}
        />
      </div>
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-20"></div>
      
      <Navbar scrolled={scrolled} />
      
      <main className="relative z-10">
        <Hero />
        <ScrollPhrase />
        <Features />
        <DataVisuals />
        <RolesSection />
        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default App;
