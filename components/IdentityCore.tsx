
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HUD } from './HUD';
import { IdentityRadar } from './IdentityRadar';
import { ModuleGrid } from './ModuleGrid';
import { InsightsPanel } from './InsightsPanel';
import { GaussianAnalysis } from './GaussianAnalysis';
import { Activity, Zap, Shield, Sparkles, BrainCircuit, LayoutGrid } from 'lucide-react';
import { BiometricPoint, UserRole, TestDefinition } from '../types';


interface IdentityCoreProps {
  role: UserRole;
  onLogout: () => void;
  onStartEvaluation: (id: string) => void;
  onNexus: () => void;
  data: BiometricPoint[];
  isAnalyzed: boolean;
  catalog: TestDefinition[];
  evaluations?: any[];
}


export const IdentityCore: React.FC<IdentityCoreProps> = ({ role, onLogout, onStartEvaluation, onNexus, data, isAnalyzed, catalog, evaluations }) => {

  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 md:px-6">
      <HUD />

      <main className="max-w-7xl mx-auto space-y-8">
        <AnimatePresence>
          {isAnalyzed && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-gradient-to-r from-[#00F3FF]/10 to-transparent border border-[#00F3FF]/20 rounded-[32px] p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#00F3FF] flex items-center justify-center text-[#080A0F] shadow-[0_0_20px_#00F3FF]">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Sincronía Completa</h2>
                  <p className="text-[10px] text-[#00F3FF] font-bold uppercase tracking-widest opacity-70">Datos Normalizados v2.1</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            <motion.div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-6 md:p-12 backdrop-blur-3xl relative overflow-hidden min-h-[400px] md:h-[600px] flex flex-col">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00F3FF]/10 flex items-center justify-center text-[#00F3FF]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold tracking-tight">Radar Comparativo</h3>
                    <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Protocolo AURA</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.map(p => (
                    <button
                      key={p.subject}
                      onClick={() => setSelectedTrait(p.subject)}
                      className="px-2 md:px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:border-[#00F3FF]/30 transition-all"
                    >
                      {p.subject}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-grow w-full relative aspect-square md:aspect-auto">
                <IdentityRadar data={data} />
              </div>
            </motion.div>

            {isAnalyzed ? <InsightsPanel data={data} evaluations={evaluations} /> : (
              <div className="p-10 md:p-12 border-2 border-dashed border-white/5 rounded-[40px] text-center space-y-4">
                <BrainCircuit className="w-10 h-10 md:w-12 md:h-12 mx-auto text-white/10" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black">Esperando Ingesta de Datos</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <QuickStat icon={Zap} label="Motor Neuro" value={isAnalyzed ? "A+" : "S/D"} color="#00F3FF" />
              <QuickStat icon={Shield} label="Nivel Riesgo" value={isAnalyzed ? "Medio" : "S/D"} color="#7B2CBF" />
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-5 h-5 text-[#FF9FFC]" />
                <h4 className="text-sm font-black uppercase tracking-widest">Protocolos</h4>
              </div>
              <ModuleGrid onStartEvaluation={onStartEvaluation} catalog={catalog} />
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedTrait && (
          <GaussianAnalysis
            trait={selectedTrait}
            value={data.find(d => d.subject === selectedTrait)?.A || 70}
            onClose={() => setSelectedTrait(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const QuickStat = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-5 md:p-6 backdrop-blur-xl">
    <div className="flex items-center gap-3 mb-3 md:mb-4">
      <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center" style={{ color }}>
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </div>
      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</span>
    </div>
    <div className="text-2xl md:text-3xl font-black tracking-tighter" style={{ color }}>{value}</div>
  </div>
);
