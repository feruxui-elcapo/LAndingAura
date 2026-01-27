
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BiometricPoint } from '../../App';

interface Question {
    id: string;
    text: string;
    trait: string;
}

interface LikertTaskProps {
    onFinish: (results: BiometricPoint[]) => void;
    config: {
        questions?: Question[];
        scaleSize?: number;
    };
}

const DEFAULT_QUESTIONS: Question[] = [
    { id: 'l1', text: 'Me siento c├│modo liderando equipos en situaciones de alta presi├│n.', trait: 'Resiliencia' },
    { id: 'l2', text: 'Prefiero tener un plan detallado antes de comenzar cualquier proyecto.', trait: 'L├│gica' },
    { id: 'l3', text: 'Suelo notar cambios sutiles en el estado de ├ínimo de las personas.', trait: 'Empat├¡a' },
    { id: 'l4', text: 'Disfruto encontrando soluciones creativas a problemas t├®cnicos.', trait: 'Creatividad' },
    { id: 'l5', text: 'Me resulta f├ícil iniciar conversaciones con desconocidos.', trait: 'Social' },
    { id: 'l6', text: 'Puedo mantener la concentraci├│n incluso en entornos ruidosos.', trait: 'Foco' },
];

export const LikertTask: React.FC<LikertTaskProps> = ({ onFinish, config }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const questions = config.questions || DEFAULT_QUESTIONS;
    const scaleSize = config.scaleSize || 5;

    const handleSelect = (value: number) => {
        const newAnswers = { ...answers, [questions[currentIndex].id]: value };
        setAnswers(newAnswers);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            finishTest(newAnswers);
        }
    };

    const finishTest = (finalAnswers: Record<string, number>) => {
        // Map answers to BiometricPoints (normalized to 150)
        // Scale 1-5 maps to roughly 30-150
        const traitScores: Record<string, number> = {};
        questions.forEach(q => {
            const val = finalAnswers[q.id] || 3;
            traitScores[q.trait] = (val / scaleSize) * 150;
        });

        const results: BiometricPoint[] = Object.entries(traitScores).map(([trait, score]) => ({
            subject: trait,
            A: score,
            fullMark: 150
        }));

        onFinish(results);
    };

    const currentQ = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="w-full max-w-2xl p-12 rounded-[48px] bg-white/[0.02] border border-white/5">
            <div className="space-y-12">
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="text-[10px] font-mono text-[#00F3FF] uppercase tracking-[0.5em]">Autoinforme // Percepci├│n</div>
                        <div className="text-[10px] font-mono text-white/20 uppercase">Pregunta {currentIndex + 1} de {questions.length}</div>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-[#00F3FF]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="min-h-[120px] flex items-center justify-center"
                    >
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-center leading-tight">
                            {currentQ.text}
                        </h2>
                    </motion.div>
                </AnimatePresence>

                <div className="flex justify-between items-center gap-2">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest hidden sm:block">Totalmente en Desacuerdo</span>
                    <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map((val) => (
                            <button
                                key={val}
                                onClick={() => handleSelect(val)}
                                className="w-12 h-12 md:w-16 md:h-16 rounded-2xl border border-white/10 bg-white/5 hover:bg-[#00F3FF] hover:text-[#080A0F] hover:scale-110 transition-all font-black text-xl flex items-center justify-center group"
                            >
                                {val}
                                <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[8px] tracking-widest text-[#00F3FF]">
                                    SELECCIONAR
                                </div>
                            </button>
                        ))}
                    </div>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest hidden sm:block">Totalmente de Acuerdo</span>
                </div>
            </div>
        </div>
    );
};
