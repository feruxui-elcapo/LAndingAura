
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { BiometricPoint } from '../../App';

interface LikertTaskProps {
    onFinish: (results: BiometricPoint[]) => void;
    config: {
        questions: Array<{ id: number, label: string, trait: string }>;
        scaleSize?: number;
    };
}

export const LikertTask: React.FC<LikertTaskProps> = ({ onFinish, config }) => {
    const [curr, setCurr] = useState(0);
    const [results, setResults] = useState<Record<string, number>>({});
    const questions = config?.questions || [
        { id: 1, label: "Me considero una persona con alta capacidad analítica", trait: "Lógica" },
        { id: 2, label: "Suelo entender las emociones de los demás con facilidad", trait: "Empatía" },
        { id: 3, label: "Disfruto creando soluciones innovadoras a problemas complejos", trait: "Creatividad" },
        { id: 4, label: "Me siento cómodo interactuando con grupos grandes", trait: "Social" },
        { id: 5, label: "Me recupero rápido de las situaciones adversas", trait: "Resiliencia" },
        { id: 6, label: "Puedo mantener la concentración en una tarea por largo tiempo", trait: "Foco" }
    ];
    const scaleSize = config?.scaleSize || 5;

    const handleSelect = (value: number) => {
        const trait = questions[curr].trait;
        const normalizedValue = (value / scaleSize) * 150;

        setResults(prev => ({
            ...prev,
            [trait]: normalizedValue
        }));

        if (curr < questions.length - 1) {
            setCurr(curr + 1);
        } else {
            const final: BiometricPoint[] = [
                { subject: 'Lógica', A: results['Lógica'] || 100, fullMark: 150 },
                { subject: 'Empatía', A: results['Empatía'] || 100, fullMark: 150 },
                { subject: 'Creatividad', A: results['Creatividad'] || 100, fullMark: 150 },
                { subject: 'Social', A: results['Social'] || 100, fullMark: 150 },
                { subject: 'Resiliencia', A: results['Resiliencia'] || 100, fullMark: 150 },
                { subject: 'Foco', A: normalizedValue, fullMark: 150 }, // Use current value if it's the last one
            ];
            // Map results correctly for all traits
            const finalMapped = final.map(f => ({
                ...f,
                A: results[f.subject] || (f.subject === trait ? normalizedValue : 100)
            }));
            onFinish(finalMapped);
        }
    };

    return (
        <div className="w-full max-w-4xl space-y-12">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9FFC]/10 border border-[#FF9FFC]/20 text-[#FF9FFC] text-[10px] font-black uppercase tracking-widest">
                    <Info className="w-3 h-3" /> Motor de Autoinforme (Likert)
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight">Percepción de Atributos</h2>
                <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Pregunta {curr + 1} de {questions.length}</p>
            </div>

            <div className="p-12 rounded-[48px] bg-white/[0.02] border border-white/10 text-center space-y-12">
                <p className="text-2xl font-bold">{questions[curr].label}</p>

                <div className="flex justify-between items-center max-w-2xl mx-auto">
                    {Array.from({ length: scaleSize }).map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handleSelect(i + 1)}
                            className="group flex flex-col items-center gap-4"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black group-hover:bg-[#00F3FF] group-hover:text-[#080A0F] group-hover:scale-110 transition-all">
                                {i + 1}
                            </div>
                            <span className="text-[8px] uppercase tracking-widest text-white/20 font-bold group-hover:text-white transition-colors">
                                {i === 0 ? 'Muy en Desacuerdo' : i === scaleSize - 1 ? 'Muy de Acuerdo' : ''}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-center gap-2">
                {questions.map((_, i) => (
                    <div key={i} className={`h-1 w-8 rounded-full transition-all ${i <= curr ? 'bg-[#00F3FF]' : 'bg-white/5'}`}></div>
                ))}
            </div>
        </div>
    );
};
