
import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      // Desaparece gradualmente en los primeros 300px
      const opacity = Math.max(0, 1 - window.scrollY / 300);
      setScrollOpacity(opacity);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-24 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00F3FF] text-[10px] font-bold uppercase tracking-[0.3em] mb-10 reveal" style={{ animationDelay: '0.1s' }}>
          El nuevo estándar en autoconocimiento
        </div>
        
        <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight reveal" style={{ animationDelay: '0.3s' }}>
          El mapa de tu mente,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F3FF] to-[#7B2CBF]">ahora en tus manos.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed reveal" style={{ animationDelay: '0.5s' }}>
          Aura traduce la ciencia de la mente en datos visuales claros. Herramientas precisas para que puedas entenderte mejor y tomar decisiones con total claridad.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 reveal" style={{ animationDelay: '0.7s' }}>
          <button className="w-full sm:w-auto px-10 py-4 bg-[#00F3FF] text-[#080A0F] font-bold rounded-2xl text-base hover:scale-[1.02] transition-all glow-cyan shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2">
            DESCUBRIR MI PERFIL <ChevronRight className="w-5 h-5" />
          </button>
          <button className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl text-base transition-all">
            Explorar Tecnología
          </button>
        </div>
      </div>

      {/* Indicador de scroll sofisticado */}
      <div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-opacity duration-500 pointer-events-none"
        style={{ opacity: scrollOpacity }}
      >
        <div className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-bold">Scroll</div>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#00F3FF] to-transparent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-white animate-[scrollLine_2s_infinite]"></div>
        </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
      `}</style>
    </section>
  );
};
