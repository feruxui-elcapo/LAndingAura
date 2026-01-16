
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CTAProps {
  onStart?: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onStart }) => {
  return (
    <section className="py-40 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tight leading-tight">
          Tu mente tiene datos. <br />
          <span className="text-[#00F3FF] glow-text-cyan">¿Querés verlos?</span>
        </h2>
        <p className="text-xl text-white/40 mb-14 max-w-xl mx-auto font-medium leading-relaxed">
          Unite a Aura y transformá el misterio en claridad. Conocerte nunca fue tan preciso ni tan visual.
        </p>
        <div className="flex flex-col items-center gap-8">
          <button 
            onClick={onStart}
            className="px-16 py-6 bg-[#00F3FF] text-[#080A0F] font-bold rounded-[32px] text-2xl hover:scale-105 transition-all glow-cyan shadow-2xl shadow-cyan-500/20 flex items-center gap-4"
          >
            EMPEZAR EL CAMINO <ArrowRight className="w-8 h-8" />
          </button>
          <div className="text-[11px] text-white/20 uppercase tracking-[0.5em] font-bold">
            Unite a la revolución del autoconocimiento
          </div>
        </div>
      </div>
    </section>
  );
};
