
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiometricPoint } from '../../App';

// Added config to GoNoGoTaskProps to fix type error in EvaluationEngine
interface GoNoGoTaskProps {
  onFinish: (results: BiometricPoint[]) => void;
  config: any;
}

// Added config to component props
export const GoNoGoTask: React.FC<GoNoGoTaskProps> = ({ onFinish, config }) => {
  const [gameState, setGameState] = useState<'waiting' | 'stimulus'>('waiting');
  const [trial, setTrial] = useState(0);
  const [isGo, setIsGo] = useState(true);
  const [startTime, setStartTime] = useState(0);
  const [rts, setRts] = useState<number[]>([]);
  const [errors, setErrors] = useState(0);

  // Use values from config with fallbacks
  const totalTrials = config?.totalTrials || 15;
  const goProbability = config?.goProbability || 0.75;

  useEffect(() => {
    if (trial < totalTrials) {
      const delay = 1000 + Math.random() * 2000;
      const timer = setTimeout(() => {
        // Use goProbability from config
        setIsGo(Math.random() < goProbability); 
        setGameState('stimulus');
        setStartTime(window.performance.now());
      }, delay);
      return () => clearTimeout(timer);
    } else {
      finish();
    }
  }, [trial, totalTrials, goProbability]);

  useEffect(() => {
    if (gameState === 'stimulus') {
      const timeout = setTimeout(() => {
        if (isGo) {
          // Error por omisión
          setErrors(e => e + 1);
        }
        nextTrial();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [gameState, isGo]);

  const handleInteraction = () => {
    if (gameState !== 'stimulus') {
      // Click anticipado (Fase 4.1 Log)
      setErrors(e => e + 1);
      return;
    }

    const rt = window.performance.now() - startTime;
    if (isGo) {
      setRts(prev => [...prev, rt]);
    } else {
      // Error No-Go (Impulsividad motora detectada)
      setErrors(e => e + 1);
    }
    nextTrial();
  };

  const nextTrial = () => {
    setGameState('waiting');
    setTrial(t => t + 1);
  };

  const finish = () => {
    const avgRt = rts.length > 0 ? rts.reduce((a, b) => a + b, 0) / rts.length : 1000;
    const impulsivityFactor = errors * 10;
    const focusScore = Math.max(60, Math.min(145, 160 - (avgRt / 8) - impulsivityFactor));

    const results: BiometricPoint[] = [
      { subject: 'Lógica', A: 90, fullMark: 150 },
      { subject: 'Empatía', A: 110, fullMark: 150 },
      { subject: 'Creatividad', A: 85, fullMark: 150 },
      { subject: 'Social', A: 120, fullMark: 150 },
      { subject: 'Resiliencia', A: 95, fullMark: 150 },
      { subject: 'Foco', A: focusScore, fullMark: 150 },
    ];
    onFinish(results);
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center space-y-12 cursor-pointer"
      onClick={handleInteraction}
    >
      <div className="text-center space-y-4">
        <h2 className="text-xl font-black uppercase tracking-widest text-white/30">Protocolo de Respuesta Inhibitoria</h2>
        <p className="text-4xl font-bold uppercase tracking-tighter">Haz clic solo si el núcleo es <span className="text-[#00F3FF]">CYAN</span></p>
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {gameState === 'stimulus' ? (
            <motion.div 
              key="target"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className={`w-64 h-64 rounded-full blur-xl ${isGo ? 'bg-[#00F3FF] shadow-[0_0_100px_#00F3FF]' : 'bg-[#7B2CBF] shadow-[0_0_100px_#7B2CBF]'}`}
            />
          ) : (
            <motion.div 
              key="waiting"
              className="w-4 h-4 rounded-full bg-white/20 animate-pulse"
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        {Array.from({ length: totalTrials }).map((_, i) => (
          <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i <= trial ? 'bg-[#00F3FF]' : 'bg-white/5'}`} />
        ))}
      </div>
    </div>
  );
};
