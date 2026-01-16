
import React, { useRef, useEffect } from 'react';
import { Sparkles, BarChart, ShieldCheck, Zap } from 'lucide-react';

const ParallaxCard = ({ icon: Icon, title, desc, delay }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const content = contentRef.current;
    const glow = glowRef.current;
    if (!card || !content || !glow) return;

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      content.style.transform = `translateZ(60px)`;
      glow.style.transform = `translate(${x - rect.width / 2}px, ${y - rect.height / 2}px)`;
      glow.style.opacity = '1';
    };

    const handleLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      content.style.transform = 'translateZ(0px)';
      glow.style.opacity = '0';
    };

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
    return () => {
      card.removeEventListener('mousemove', handleMove);
      card.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className="relative p-10 rounded-[32px] bg-white/[0.03] border border-white/10 overflow-hidden group reveal transition-transform duration-150 ease-out"
      style={{ animationDelay: delay, transformStyle: 'preserve-3d' }}
    >
      <div 
        ref={glowRef}
        className="absolute inset-0 w-64 h-64 bg-[#00F3FF]/10 blur-[100px] rounded-full pointer-events-none opacity-0 transition-opacity duration-300"
      ></div>
      
      <div ref={contentRef} className="relative z-10 transition-transform duration-200 ease-out pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
        <div className="w-16 h-16 rounded-2xl bg-[#00F3FF]/10 flex items-center justify-center mb-8 text-[#00F3FF]">
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
        <p className="text-white/50 text-base leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
};

export const Features: React.FC = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Tu camino a la claridad</h2>
          <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Hacemos que lo complejo sea simple. Los datos de tu mente, visibles por primera vez.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <ParallaxCard 
            icon={Sparkles}
            title="Conocete mejor"
            desc="Descubrí tus fortalezas y áreas de mejora con reportes diseñados para ser entendidos, no solo leídos."
            delay="0.1s"
          />
          <ParallaxCard 
            icon={Zap}
            title="Resultados al instante"
            desc="Sin esperas. Obtené tu mapa de personalidad apenas terminás tus evaluaciones."
            delay="0.2s"
          />
          <ParallaxCard 
            icon={BarChart}
            title="Ciencia que se ve"
            desc="Transformamos teorías psicológicas en gráficos visuales increíbles que podés explorar."
            delay="0.3s"
          />
          <ParallaxCard 
            icon={ShieldCheck}
            title="Control absoluto"
            desc="Tus datos son privados. Vos decidís quién los ve, con seguridad de grado bancario."
            delay="0.4s"
          />
        </div>
      </div>
    </section>
  );
};
