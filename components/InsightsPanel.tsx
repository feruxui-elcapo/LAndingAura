
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, Info, TrendingUp } from 'lucide-react';
import { BiometricPoint } from '../types';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface InsightsPanelProps {
  data: BiometricPoint[];
  evaluations?: any[];
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ data, evaluations }) => {
  // Encontrar la categoría con mayor puntaje
  const dominant = [...data].sort((a, b) => b.A - a.A)[0];

  const trendData = evaluations?.map(ev => ({
    date: new Date(ev.timestamp).toLocaleDateString(),
    score: (ev.results?.reduce((acc: number, curr: any) => acc + (curr.A || 0), 0) || 0) / (ev.results?.length || 1)

  })).slice(-10) || [];

  const getInsightDescription = (subject: string) => {
    switch (subject) {
      case 'Lógica': return "Posees una arquitectura mental orientada a sistemas. Tu capacidad para descomponer la complejidad en unidades mínimas es superior al 94% de la muestra.";
      case 'Creatividad': return "Tu flujo de asociaciones no es lineal. Generas conexiones divergentes que permiten soluciones innovadoras en entornos de alta incertidumbre.";
      case 'Foco': return "Demuestras una 'Tunelización Cognitiva' selectiva. Tu cerebro prioriza el impacto sobre el ruido de manera excepcional.";
      default: return "Perfil equilibrado con una fuerte base en procesamientos analíticos y adaptabilidad contextual.";
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <div className="bg-gradient-to-br from-[#00F3FF]/10 to-transparent border border-[#00F3FF]/20 rounded-[40px] p-8 relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#00F3FF]/10 flex items-center justify-center text-[#00F3FF]">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest">Dimensión Dominante</h4>
              <p className="text-2xl font-bold tracking-tight text-[#00F3FF]">{dominant.subject}</p>
            </div>
          </div>
          <p className="text-sm text-white/60 leading-relaxed italic">
            "{getInsightDescription(dominant.subject)}"
          </p>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#00F3FF]/20 blur-[60px] rounded-full"></div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-[#7B2CBF]" />
              <h4 className="text-sm font-black uppercase tracking-widest">Sincronía de Red</h4>
            </div>
            <Info className="w-4 h-4 text-white/20" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Estabilidad</span>
              <span className="text-xs font-mono text-[#7B2CBF]">98.2%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#7B2CBF]"
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ delay: 1, duration: 2 }}
              />
            </div>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">
              Tus patrones neuronales muestran una alta coherencia en tareas de resolución paralela.
            </p>
          </div>
        </div>
      </motion.div>

      {trendData.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 space-y-6"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#00F3FF]" />
            <h4 className="text-sm font-black uppercase tracking-widest">Evolución del Rendimiento</h4>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="date" hide />
                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#080A0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#00F3FF' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#00F3FF"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#00F3FF' }}
                  activeDot={{ r: 6, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
};
