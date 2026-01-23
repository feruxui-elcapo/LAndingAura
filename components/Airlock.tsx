
import React from 'react';
import { motion } from 'framer-motion';
import { User, Command, ChevronLeft, HeartPulse, Building2 } from 'lucide-react';
import { UserRole } from '../App';
import { supabase } from '../lib/supabase';

interface AirlockProps {
  onBack: () => void;
  onSuccess: (role: UserRole) => void;
}

export const Airlock: React.FC<AirlockProps> = ({ onBack, onSuccess }) => {
  // Temporary force flag: set to `true` to enable Architect locally for testing.
  // You can change this to false or remove after finishing local tests.
  const FORCE_ENABLE_ARCHITECT = true;

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
  const envForce = import.meta.env.VITE_FORCE_ENABLE_ARCHITECT === '1';
  const isSupabaseConfigured = (SUPABASE_URL && !SUPABASE_URL.includes('your-project') && !SUPABASE_URL.includes('placeholder')) || envForce || FORCE_ENABLE_ARCHITECT;

  const handleGoogleLogin = async (role: UserRole) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Auth error:', error.message);
      // Fallback for demo if no config
      onSuccess(role);
    }
  };

  const handleProtocolClick = async (role: UserRole) => {
    // If architect and FORCE is enabled, bypass OAuth and simulate login locally
    const envForce = import.meta.env.VITE_FORCE_ENABLE_ARCHITECT === '1';
    const FORCE_ENABLE_ARCHITECT = true;
    const allowBypass = FORCE_ENABLE_ARCHITECT || envForce;

    if (role === 'architect' && allowBypass) {
      // Simulate successful authentication for local testing
      console.warn('Bypassing OAuth for architect (local test mode)');
      onSuccess(role);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      // If already logged in, just proceed with the role
      onSuccess(role);
    } else {
      // Trigger Google Login
      await handleGoogleLogin(role);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative bg-[#080A0F]">
      <div className="absolute top-10 left-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/30 hover:text-[#00F3FF] transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a la superficie
        </button>
      </div>

      <div className="max-w-6xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Selección de Protocolo</h1>
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.4em]">Identificación de Nodo AURA v2.0</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProtocolCard
            id="explorer"
            title="Explorer"
            icon={User}
            color="#00F3FF"
            desc="Sujeto de prueba. Autoconocimiento personal."
            onClick={() => onSuccess('explorer')}
          />
          <ProtocolCard
            id="professional"
            title="Professional"
            icon={HeartPulse}
            color="#00F3FF"
            desc="Gestión de pacientes y baterías clínicas."
            onClick={() => onSuccess('professional')}
          />
          <ProtocolCard
            id="corporate"
            title="Corporate"
            icon={Building2}
            color="#FF9FFC"
            desc="Analítica de equipos y gestión de talento."
            onClick={() => onSuccess('corporate')}
          />
          <ProtocolCard
            id="architect"
            title="Architect"
            icon={Command}
            color="#7B2CBF"
            desc="Control de nexo, baremos y algoritmos."
            onClick={() => handleProtocolClick('architect')}
            disabled={!isSupabaseConfigured}
          />
        </div>
      </div>
    </div>
  );
};

const ProtocolCard = ({ title, icon: Icon, color, desc, onClick, disabled = false }: any) => (
  <motion.div
    whileHover={{ y: disabled ? 0 : -5 }}
    onClick={disabled ? undefined : onClick}
    className={`bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[32px] p-8 flex flex-col items-center text-center group transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-white/20'}`}
  >
    <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: `${color}10`, color }}>
      <Icon className="w-8 h-8" />
    </div>
    <h2 className="text-xl font-black uppercase tracking-widest mb-3">{title}</h2>
    <p className="text-[10px] text-white/20 leading-relaxed uppercase tracking-wider mb-8">{desc}</p>
    <button disabled={disabled} className={`w-full py-3 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest transition-all ${disabled ? 'bg-white/5 text-white/30' : 'group-hover:bg-white group-hover:text-[#080A0F]'}`}>
      {disabled ? 'Configuración necesaria' : 'Iniciar Vínculo'}
    </button>
  </motion.div>
);
