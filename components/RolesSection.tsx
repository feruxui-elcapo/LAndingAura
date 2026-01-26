
import React, { useRef, useEffect } from 'react';
import { User, HeartPulse, Building, ChevronRight } from 'lucide-react';

const RoleAction = ({ icon: Icon, title, subtitle, points, delay }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
    };

    const handleLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
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
      className="group p-10 rounded-[32px] bg-white/[0.02] border border-white/10 hover:border-[#00F3FF]/40 transition-all duration-300 flex flex-col h-full reveal"
      style={{ animationDelay: delay }}
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-[#00F3FF]">
        <Icon className="w-8 h-8" />
      </div>
      <div className="mb-6">
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/30">{subtitle}</span>
        <h3 className="text-3xl font-bold mt-2 tracking-tight">{title}</h3>
      </div>
      <ul className="space-y-4 mb-12 flex-grow">
        {points.map((p: string, i: number) => (
          <li key={i} className="text-white/40 flex items-start gap-4">
            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#7B2CBF]"></div>
            <span className="text-sm leading-relaxed font-medium">{p}</span>
          </li>
        ))}
      </ul>
      <button className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-sm transition-all flex items-center justify-center gap-2 tracking-widest uppercase">
        Ver más <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export const RolesSection: React.FC = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Aura para todos</h2>
          <p className="text-white/40 text-xl font-medium">Llevamos los datos de la mente a cada rincón.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <RoleAction 
            icon={User}
            subtitle="EXPLORADORES"
            title="Personal"
            points={["Descubrí quién sos realmente", "Obtené mapas visuales de tu mente", "Toda tu info segura y privada", "Tests gratis para comenzar"]}
            delay="0.1s"
          />
          <RoleAction 
            icon={HeartPulse}
            subtitle="PROFESIONALES"
            title="Psicólogos"
            points={["Panel de control para pacientes", "Tests validados y automáticos", "Informes técnicos profundos", "Gestión clínica sin esfuerzo"]}
            delay="0.2s"
          />
          <RoleAction 
            icon={Building}
            subtitle="ORGANIZACIONES"
            title="Empresas"
            points={["Identificá el talento real", "Evaluaciones grupales rápidas", "Mejorá el clima de tu equipo", "Selección basada en datos"]}
            delay="0.3s"
          />
        </div>
      </div>
    </section>
  );
};
