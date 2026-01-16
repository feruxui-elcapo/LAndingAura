
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiometricPoint } from '../../App';

const COLORS = [
  { name: 'ROJO', hex: '#FF4136', label: 'Red' },
  { name: 'AZUL', hex: '#0074D9', label: 'Blue' },
  { name: 'VERDE', hex: '#2ECC40', label: 'Green' },
  { name: 'AMARILLO', hex: '#FFDC00', label: 'Yellow' }
];

interface StroopTaskProps {
  onFinish: (results: BiometricPoint[]) => void;
}

export const StroopTask: React.FC<StroopTaskProps> = ({ onFinish }) => {
  const [trial, setTrial] = useState(0);
  const [currentStroop, setCurrentStroop] = useState({ text: '', color: '', isCongruent: false });
  const [latencies, setLatencies] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const totalTrials = 12;

  useEffect(() => {
    generateTrial();
  }, []);

  const generateTrial = () => {
    const textIdx = Math.floor(Math.random() * COLORS.length);
    const colorIdx = Math.random() > 0.5 ? textIdx : Math.floor(Math.random() * COLORS.length);
    
    setCurrentStroop({
      text: COLORS[textIdx].name,
      color: COLORS[colorIdx].hex,
      isCongruent: textIdx === colorIdx
    });
    setStartTime(window.performance.now());
  };

  const handleResponse = (hexCode: string) => {
    const endTime = window.performance.now();
    const rt = endTime - startTime;
    
    if (hexCode === currentStroop.color) {
      setLatencies([...latencies, rt]);
      if (trial < totalTrials - 1) {
        setTrial(trial + 1);
        generateTrial();
      } else {
        finishTest([...latencies, rt]);
      }
    } else {
      // Error feedback (Glitch visual)
      const el = document.getElementById('stroop-container');
      el?.classList.add('animate-pulse', 'bg-red-500/10');
      setTimeout(() => el?.classList.remove('animate-pulse', 'bg-red-500/10'), 200);
    }
  };

  const finishTest = (allLats: number[]) => {
    const avgRt = allLats.reduce((a, b) => a + b, 0) / allLats.length;
    // Mapear tiempo de reacción a puntaje (ej: 400ms = 140pts, 1000ms = 60pts)
    const score = Math.max(60, Math.min(145, 180 - (avgRt / 10)));

    const results: BiometricPoint[] = [
      { subject: 'Lógica', A: 85, fullMark: 150 },
      { subject: 'Empatía', A: 90, fullMark: 150 },
      { subject: 'Creatividad', A: 75, fullMark: 150 },
      { subject: 'Social', A: 110, fullMark: 150 },
      { subject: 'Resiliencia', A: 95, fullMark: 150 },
      { subject: 'Foco', A: score, fullMark: 150 },
    ];
    onFinish(results);
  };

  return (
    <div id="stroop-container" className="w-full max-w-2xl p-12 rounded-[48px] bg-white/[0.02] border border-white/5 transition-colors">
      <div className="text-center space-y-12">
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">Atención Selectiva</div>
          <h2 className="text-xl font-bold uppercase">Identifica el COLOR de la tinta</h2>
        </div>

        <div className="h-40 flex items-center justify-center">
          <motion.h1 
            key={trial}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl font-black italic tracking-tighter"
            style={{ color: currentStroop.color }}
          >
            {currentStroop.text}
          </motion.h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => handleResponse(c.hex)}
              className="py-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all font-black uppercase tracking-widest text-xs"
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="pt-8 flex justify-center gap-2">
          {Array.from({ length: totalTrials }).map((_, i) => (
            <div key={i} className={`h-1 w-6 rounded-full transition-colors ${i <= trial ? 'bg-[#00F3FF]' : 'bg-white/5'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};
