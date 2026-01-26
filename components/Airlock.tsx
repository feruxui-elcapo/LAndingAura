
import React from 'react';
import { motion } from 'framer-motion';
import { User, Command, ChevronLeft, HeartPulse, Building2 } from 'lucide-react';
import { UserRole } from '../App';

interface AirlockProps {
  onBack: () => void;
  onSuccess: (role: UserRole) => void;
}

export const Airlock: React.FC<AirlockProps> = ({ onBack, onSuccess }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative bg-[#080A0F]">
      <div className="absolute top-10 left-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/30 hover:text-[#00F3FF] transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" /> Volver al Inicio
        </button>
      </div>

      <div className="max-w-6xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Selección de Perfil</h1>
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.4em]">Acceso al Sistema AURA v2.0</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProtocolCard
            id="explorer"
            title="Explorer"
            icon={User}
            color="#00F3FF"
            desc="Evaluación personal y resultados biométricos."
            onClick={() => onSuccess('explorer')}
          />
          <ProtocolCard
            id="professional"
            title="Professional"
            icon={HeartPulse}
            color="#00F3FF"
            desc="Gestión de pacientes y seguimiento clínico."
            onClick={() => onSuccess('professional')}
          />
          <ProtocolCard
            id="corporate"
            title="Corporate"
            icon={Building2}
            color="#FF9FFC"
            desc="Análisis organizacional y gestión de talento."
            onClick={() => onSuccess('corporate')}
          />
          <ProtocolCard
            id="architect"
            title="Architect"
            icon={Command}
            color="#7B2CBF"
            desc="Administración del sistema y configuración central."
            onClick={() => onSuccess('architect')}
          />
        </div>
      </div>
    </div>
  );
};

const ProtocolCard = ({ title, icon: Icon, color, desc, onClick }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[32px] p-8 flex flex-col items-center text-center group cursor-pointer hover:border-white/20 transition-all"
  >
    <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: `${color}10`, color }}>
      <Icon className="w-8 h-8" />
    </div>
    <h2 className="text-xl font-black uppercase tracking-widest mb-3">{title}</h2>
    <p className="text-[10px] text-white/20 leading-relaxed uppercase tracking-wider mb-8">{desc}</p>
    <button className="w-full py-3 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-[#080A0F] transition-all">
      Ingresar
    </button>
  </motion.div>
);
