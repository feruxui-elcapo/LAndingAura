
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
        minLabel?: string;
        maxLabel?: string;
    };
}

const DEFAULT_QUESTIONS: Question[] = [
    { id: 'l1', text: 'Me siento cómodo liderando equipos en situaciones de alta presión.', trait: 'Resiliencia' },
    { id: 'l2', text: 'Prefiero tener un plan detallado antes de comenzar cualquier proyecto.', trait: 'Lógica' },
    { id: 'l3', text: 'Suelo notar cambios sutiles en el estado de ánimo de las personas.', trait: 'Empatía' },
    { id: 'l4', text: 'Disfruto encontrando soluciones creativas a problemas técnicos.', trait: 'Creatividad' },
    { id: 'l5', text: 'Me resulta fácil iniciar conversaciones con desconocidos.', trait: 'Social' },
    { id: 'l6', text: 'Puedo mantener la concentración incluso en entornos ruidosos.', trait: 'Foco' },
];

export const LikertTask: React.FC<LikertTaskProps> = ({ onFinish, config }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const questions = config.questions || DEFAULT_QUESTIONS;
    const scaleSize = config.scaleSize || 5;
    const minLabel = config.minLabel || 'Totalmente en Desacuerdo';
    const maxLabel = config.maxLabel || 'Totalmente de Acuerdo';

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
        const traitScores: Record<string, number[]> = {};
        questions.forEach(q => {
            const val = finalAnswers[q.id] || Math.ceil(scaleSize / 2);
            if (!traitScores[q.trait]) traitScores[q.trait] = [];
            traitScores[q.trait].push((val / scaleSize) * 150);
        });

        const results: BiometricPoint[] = Object.entries(traitScores).map(([trait, scores]) => ({
            subject: trait,
            A: scores.reduce((a, b) => a + b, 0) / scores.length,
            fullMark: 150
        }));

        onFinish(results);
    };

    const currentQ = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const scaleArray = Array.from({ length: scaleSize }, (_, i) => i + 1);

    return (
        <div className="w-full max-w-3xl mx-auto p-8 md:p-12">
            <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-[48px] p-8 md:p-16 space-y-12 backdrop-blur-xl shadow-2xl">
                {/* Header & Progress */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#00F3FF] animate-pulse"></div>
                            <div className="text-[10px] font-black text-[#00F3FF] uppercase tracking-[0.5em]">Autoinforme</div>
                        </div>
                        <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                            {currentIndex + 1} / {questions.length}
                        </div>
                    </div>

                    <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#7B2CBF] via-[#00F3FF] to-[#FF9FFC] rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="min-h-[140px] flex items-center justify-center"
                    >
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-center leading-tight bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                            {currentQ.text}
                        </h2>
                    </motion.div>
                </AnimatePresence>

                {/* Scale Labels */}
                <div className="flex justify-between items-center gap-4 px-2">
                    <span className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-widest text-left flex-1 hidden sm:block">
                        {minLabel}
                    </span>
                    <span className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-widest text-right flex-1 hidden sm:block">
                        {maxLabel}
                    </span>
                </div>

                {/* Scale Buttons */}
                <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
                    {scaleArray.map((val) => (
                        <motion.button
                            key={val}
                            onClick={() => handleSelect(val)}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative group"
                        >
                            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl border-2 border-white/10 bg-gradient-to-br from-white/10 to-white/5 hover:from-[#00F3FF]/20 hover:to-[#7B2CBF]/20 hover:border-[#00F3FF] transition-all flex items-center justify-center font-black text-2xl md:text-3xl backdrop-blur-sm shadow-lg">
                                {val}
                            </div>
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                <div className="text-[8px] md:text-[9px] font-black tracking-widest text-[#00F3FF] uppercase">
                                    Seleccionar
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Mobile Labels */}
                <div className="flex justify-between items-center gap-4 px-2 sm:hidden">
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest text-left flex-1">
                        {minLabel}
                    </span>
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest text-right flex-1">
                        {maxLabel}
                    </span>
                </div>

                {/* Trait Indicator */}
                <div className="flex justify-center">
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/5">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">
                            Evaluando: {currentQ.trait}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
