
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Info } from 'lucide-react';
import { BiometricPoint } from '../../App';

export const StaticTest = ({ onFinish, config }: { onFinish: (r: BiometricPoint[]) => void, config: any }) => {
  const [curr, setCurr] = useState(0);
  const [selections, setSelections] = useState<{most?: string, least?: string}>({});
  const [results, setResults] = useState<Record<string, number>>({});

  const triads = config?.triads || [];

  const handleSelect = (id: string, type: 'most' | 'least') => {
    if (type === 'most' && selections.least === id) return;
    if (type === 'least' && selections.most === id) return;
    setSelections(prev => ({ ...prev, [type]: id }));
  };

  const next = () => {
    const triad = triads[curr];
    const mostOpt = triad.options.find((o: any) => o.id === selections.most)!;
    const leastOpt = triad.options.find((o: any) => o.id === selections.least)!;

    const newResults = { ...results };
    newResults[mostOpt.trait] = (newResults[mostOpt.trait] || 80) + 20;
    newResults[leastOpt.trait] = (newResults[leastOpt.trait] || 80) - 10;
    
    setResults(newResults);

    if (curr < triads.length - 1) {
      setCurr(curr + 1);
      setSelections({});
    } else {
      const final: BiometricPoint[] = [
        { subject: 'Lógica', A: newResults['Lógica'] || 110, fullMark: 150 },
        { subject: 'Empatía', A: newResults['Empatía'] || 95, fullMark: 150 },
        { subject: 'Creatividad', A: newResults['Creatividad'] || 120, fullMark: 150 },
        { subject: 'Social', A: newResults['Social'] || 105, fullMark: 150 },
        { subject: 'Resiliencia', A: newResults['Resiliencia'] || 100, fullMark: 150 },
        { subject: 'Foco', A: newResults['Foco'] || 115, fullMark: 150 },
      ];
      onFinish(final);
    }
  };

  if (!triads.length) return <div className="text-red-500 font-black">ERROR: No hay triadas configuradas.</div>;

  return (
    <div className="w-full max-w-4xl space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7B2CBF]/10 border border-[#7B2CBF]/20 text-[#7B2CBF] text-[10px] font-black uppercase tracking-widest">
           <Info className="w-3 h-3" /> Motor de Elección Forzada (MFC)
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tight">Cruce de Coordenadas</h2>
        <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Bloque {curr + 1} de {triads.length}</p>
      </div>

      <div className="grid gap-6">
        {triads[curr].options.map((opt: any) => (
          <div key={opt.id} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/10 flex items-center justify-between group transition-all">
            <p className="text-lg font-bold max-w-md">{opt.label}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => handleSelect(opt.id, 'most')}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${selections.most === opt.id ? 'bg-[#00F3FF] border-transparent text-[#080A0F]' : 'bg-white/5 border-white/10 text-white/20 hover:text-[#00F3FF]'}`}
              >
                <Check className="w-6 h-6" />
              </button>
              <button 
                onClick={() => handleSelect(opt.id, 'least')}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${selections.least === opt.id ? 'bg-red-500 border-transparent text-white' : 'bg-white/5 border-white/10 text-white/20 hover:text-red-500'}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-[10px] font-mono text-white/20">TEST_INSTANCE_{curr + 1}</div>
        <button 
          disabled={!selections.most || !selections.least}
          onClick={next}
          className="px-12 py-4 bg-white text-[#080A0F] font-black rounded-2xl uppercase tracking-[0.2em] hover:scale-105 transition-all disabled:opacity-20"
        >
          {curr < triads.length - 1 ? 'Siguiente' : 'Finalizar Ingesta'}
        </button>
      </div>
    </div>
  );
};
