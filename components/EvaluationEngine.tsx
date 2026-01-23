
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { BiometricPoint, TestDefinition } from '../App';
import { StaticTest } from './engines/StaticTest';
import { StroopTask } from './engines/StroopTask';
import { BARTTask } from './engines/BARTTask';
import { GoNoGoTask } from './engines/GoNoGoTask';
import { LikertTask } from './engines/LikertTask';

interface EvaluationEngineProps {
  testDef: TestDefinition;
  onComplete: (results: BiometricPoint[]) => void;
  onCancel: () => void;
}

export const EvaluationEngine: React.FC<EvaluationEngineProps> = ({ testDef, onComplete, onCancel }) => {
  const [engineState, setEngineState] = useState<'intro' | 'active'>('intro');

  const renderEngine = () => {
    switch (testDef.type) {
      case 'mfc':
        return <StaticTest onFinish={onComplete} config={testDef.config} />;
      case 'bart':
        return <BARTTask onFinish={onComplete} config={testDef.config} />;
      case 'gonogo':
        return <GoNoGoTask onFinish={onComplete} config={testDef.config} />;
      case 'stroop':
        return <StroopTask onFinish={onComplete} />;
      case 'likert':
        return <LikertTask onFinish={onComplete} config={testDef.config} />;
      default:
        return <StaticTest onFinish={onComplete} config={testDef.config} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-white flex flex-col relative overflow-hidden">
      <header className="p-8 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">{testDef.title}</h2>
            <div className="text-[10px] font-mono text-[#00F3FF] flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#00F3FF] animate-ping"></span>
              SESSION_ACTIVE // RT_INGESTION
            </div>
          </div>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          {engineState === 'intro' ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-xl text-center space-y-8"
            >
              <div className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 mb-4">
                <div className="text-[#00F3FF] text-xs font-black tracking-widest uppercase">Protocolo de Inicio</div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                {testDef.title.split(':')[1]?.trim() || 'ANALYSIS'}
              </h1>
              <p className="text-white/40 text-sm font-medium leading-relaxed uppercase tracking-widest">
                {testDef.description}
              </p>
              <button
                onClick={() => setEngineState('active')}
                className="px-12 py-4 bg-[#00F3FF] text-[#080A0F] font-black rounded-2xl tracking-[0.2em] uppercase hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,243,255,0.3)]"
              >
                Iniciar Secuencia
              </button>
            </motion.div>
          ) : (
            <motion.div key="engine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full max-w-7xl mx-auto flex items-center justify-center">
              {renderEngine()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
