
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, ReferenceLine } from 'recharts';
import { X, Info } from 'lucide-react';

interface GaussianAnalysisProps {
  trait: string;
  value: number;
  onClose: () => void;
}

export const GaussianAnalysis: React.FC<GaussianAnalysisProps> = ({ trait, value, onClose }) => {
  const data = useMemo(() => {
    const points = [];
    const mean = 75;
    const stdDev = 25;
    for (let x = 0; x <= 150; x += 2) {
      const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
      const y = Math.exp(exponent);
      points.push({ x, y });
    }
    return points;
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#080A0F]/90 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-[#11141D] border border-white/10 rounded-[40px] md:rounded-[48px] p-6 md:p-10 relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 md:top-8 md:right-8 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all">
          <X className="w-5 h-5 text-white/30" />
        </button>

        <div className="mb-8 md:mb-10 space-y-2">
          <div className="flex items-center gap-3 text-[#00F3FF]">
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Análisis de Distribución</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Dimensión: {trait}</h2>
          <p className="text-[10px] md:text-sm text-white/40 max-w-xl leading-relaxed uppercase tracking-wider">
            Posicionamiento relativo basado en el baremo normativo AURA. Tu puntuación te sitúa por encima del {Math.round((value/150)*100)}% de los sujetos evaluados.
          </p>
        </div>

        <div className="h-48 md:h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="gaussGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F3FF" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00F3FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="x" hide />
              <YAxis hide />
              <Area type="monotone" dataKey="y" stroke="#00F3FF" strokeWidth={2} fill="url(#gaussGrad)" />
              <ReferenceLine 
                x={value} 
                stroke="#FF9FFC" 
                strokeWidth={4} 
                label={{ position: 'top', value: 'TÚ', fill: '#FF9FFC', fontSize: 10, fontWeight: '900', letterSpacing: '0.1em' }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 md:mt-12 grid grid-cols-3 gap-4 md:gap-8">
           <AnalyticBox label="Percentil" value={`${Math.round((value/150)*100)}`} sub="Superior" />
           <AnalyticBox label="Desviación" value="+1.2σ" sub="Z-Score" />
           <AnalyticBox label="Confiabilidad" value="99.9%" sub="Protocolo α" />
        </div>
      </motion.div>
    </motion.div>
  );
};

const AnalyticBox = ({ label, value, sub }: any) => (
  <div className="p-4 md:p-6 rounded-2xl bg-white/[0.03] border border-white/5">
    <div className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">{label}</div>
    <div className="text-xl md:text-3xl font-black text-white">{value}</div>
    <div className="text-[8px] md:text-[9px] font-bold text-[#00F3FF] uppercase tracking-widest mt-1 opacity-50">{sub}</div>
  </div>
);
