
import React, { useEffect, useState, useRef } from 'react';

export const ScrollPhrase: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const current = -rect.top + windowHeight;
      const total = rect.height + windowHeight;
      const p = Math.min(Math.max(current / total, 0), 1);
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 flex items-center justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <h2 
          className="text-3xl md:text-6xl font-bold tracking-tight leading-[1.2] transition-all duration-300 ease-out"
          style={{
            transform: `scale(${0.96 + progress * 0.08}) translateY(${(1 - progress) * 25}px)`,
            opacity: progress > 0.1 ? 1 : progress * 8,
          }}
        >
          CONOCERTE ES EL PRIMER PASO <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F3FF] to-[#7B2CBF] glow-text-cyan">
            PARA TRANSFORMAR TU VIDA
          </span>
          <br />
          CON DATOS, SIN ADIVINAR.
        </h2>
      </div>
    </section>
  );
};
