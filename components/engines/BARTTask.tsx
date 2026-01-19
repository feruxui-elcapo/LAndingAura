
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { BiometricPoint, PerformanceLog } from '../../App';

interface BARTTaskProps {
  onFinish: (results: BiometricPoint[], logs: PerformanceLog[]) => void;
  config: any;
}

export const BARTTask: React.FC<BARTTaskProps> = ({ onFinish, config }) => {
  const [balloons, setBalloons] = useState(0);
  const [currentSize, setCurrentSize] = useState(1);
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [totalBank, setTotalBank] = useState(0);
  const [isBurst, setIsBurst] = useState(false);
  const [logs, setLogs] = useState<PerformanceLog[]>([]);

  const totalRounds = config?.rounds || 5;
  const maxPumps = config?.maxPumps || 20;

  const addLog = (event: string, details?: any) => {
    setLogs(prev => [...prev, { timestamp: window.performance.now(), event, details }]);
  };

  const handlePump = () => {
    if (isBurst) return;

    const burstProbability = currentSize / maxPumps;
    const willBurst = Math.random() < burstProbability;

    if (willBurst) {
      setIsBurst(true);
      setCurrentEarnings(0);
      addLog('burst', { size: currentSize, round: balloons });
      setTimeout(nextRound, 1500);
    } else {
      const nextSize = currentSize + 1;
      const nextEarnings = currentEarnings + 10;
      setCurrentSize(nextSize);
      setCurrentEarnings(nextEarnings);
      addLog('pump', { size: nextSize, earnings: nextEarnings, round: balloons });
    }
  };

  const handleCollect = () => {
    if (isBurst || currentEarnings === 0) return;
    const newBank = totalBank + currentEarnings;
    setTotalBank(newBank);
    addLog('collect', { banked: currentEarnings, totalBank: newBank, round: balloons });

    if (balloons < totalRounds - 1) {
      nextRound();
    } else {
      finishTest(newBank);
    }
  };

  const nextRound = () => {
    if (balloons < totalRounds - 1) {
      setBalloons(balloons + 1);
      setCurrentSize(1);
      setCurrentEarnings(0);
      setIsBurst(false);
    } else {
      finishTest(totalBank);
    }
  };

  const finishTest = (finalScore: number) => {
    const riskScore = Math.max(60, Math.min(145, 60 + (finalScore / (totalRounds))));

    const results: BiometricPoint[] = [
      { subject: 'Lógica', A: 110, fullMark: 150 },
      { subject: 'Empatía', A: 85, fullMark: 150 },
      { subject: 'Creatividad', A: 120, fullMark: 150 },
      { subject: 'Social', A: 95, fullMark: 150 },
      { subject: 'Resiliencia', A: riskScore, fullMark: 150 },
      { subject: 'Foco', A: 105, fullMark: 150 },
    ];
    onFinish(results, logs);
  };

  return (
    <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center p-12 rounded-[48px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl">
      <div className="flex flex-col items-center justify-center space-y-12">
        <div className="relative w-64 h-64 flex items-center justify-center">
          <AnimatePresence>
            {!isBurst ? (
              <motion.div
                key="plasma"
                initial={{ scale: 0 }}
                animate={{ scale: 0.5 + (currentSize / 10) }}
                className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-[#00F3FF] to-[#7B2CBF] glow-cyan blur-sm"
                style={{ opacity: 0.5 + (currentSize / maxPumps) }}
              />
            ) : (
              <motion.div
                key="burst"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                className="absolute w-40 h-40 rounded-full bg-red-500 blur-xl"
              />
            )}
          </AnimatePresence>
          <div className="z-10 text-center font-black">
            <div className="text-4xl tracking-tighter">{currentEarnings}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest">CRÉDITOS</div>
          </div>
        </div>

        <div className="flex gap-4 w-full">
          <button onClick={handlePump} disabled={isBurst} className="flex-grow py-5 bg-[#00F3FF] text-[#080A0F] font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-all disabled:opacity-20">
            <Zap className="w-4 h-4" /> ESTABILIZAR
          </button>
          <button onClick={handleCollect} disabled={isBurst || currentEarnings === 0} className="flex-grow py-5 bg-white/5 border border-white/10 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all disabled:opacity-20">
            <TrendingUp className="w-4 h-4" /> ASEGURAR
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-white/20">Banco Total</span>
            <span className="text-2xl font-black text-[#00F3FF]">{totalBank}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-white/20">Carga Actual</span>
            <span className="text-lg font-mono">{currentSize}/{maxPumps}</span>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalRounds }).map((_, i) => (
            <div key={i} className={`h-1.5 w-10 rounded-full transition-colors ${i <= balloons ? 'bg-[#7B2CBF]' : 'bg-white/5'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};
