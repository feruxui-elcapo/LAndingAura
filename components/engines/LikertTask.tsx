import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { BiometricPoint } from '../../types';

interface LikertQuestion {
    id: string;
    text: string;
    category: string;
}

interface LikertConfig {
    scaleSize: 3 | 5 | 7;
    questions: LikertQuestion[];
    labels?: string[];
    showLabels?: boolean;
}

interface LikertTaskProps {
    onFinish: (results: BiometricPoint[]) => void;
    config: LikertConfig;
}

export const LikertTask: React.FC<LikertTaskProps> = ({ onFinish, config }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const scaleSize = config.scaleSize || 5;
    const labels = config.labels || (scaleSize === 3
        ? ['En desacuerdo', 'Neutro', 'De acuerdo']
        : scaleSize === 5
            ? ['Muy en desacuerdo', 'En desacuerdo', 'Neutro', 'De acuerdo', 'Muy de acuerdo']
            : ['Totalmente en desacuerdo', 'Muy en desacuerdo', 'En desacuerdo', 'Neutro', 'De acuerdo', 'Muy de acuerdo', 'Totalmente de acuerdo']
    );

    const currentQuestion = config.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / config.questions.length) * 100;

    const handleSelect = (value: number) => {
        setSelectedOption(value);
    };

    const handleNext = () => {
        if (selectedOption === null) return;

        const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
        setAnswers(newAnswers);
        setSelectedOption(null);

        if (currentQuestionIndex < config.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishTest(newAnswers);
        }
    };

    const finishTest = (finalAnswers: Record<string, number>) => {
        // Calculate results per category
        const categoryScores: Record<string, { sum: number, count: number }> = {};

        config.questions.forEach(q => {
            if (!categoryScores[q.category]) categoryScores[q.category] = { sum: 0, count: 0 };
            categoryScores[q.category].sum += finalAnswers[q.id];
            categoryScores[q.category].count += 1;
        });

        const results: BiometricPoint[] = Object.keys(categoryScores).map(cat => {
            const { sum, count } = categoryScores[cat];
            const maxPossible = count * scaleSize;
            const normalizedScore = (sum / maxPossible) * 150; // Normalize to 0-150 scale used in app

            return {
                subject: cat,
                A: Math.round(normalizedScore),
                fullMark: 150,
                ideal: 100
            };
        });

        onFinish(results);
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
            {/* HUD */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black uppercase tracking-[0.2em] text-[#00F3FF]">Evaluación Psicométrica</h2>
                <div className="text-right">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Pregunta</p>
                    <p className="text-xl font-mono text-white">{currentQuestionIndex + 1} <span className="text-white/30">/ {config.questions.length}</span></p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mb-12 overflow-hidden">
                <motion.div
                    className="h-full bg-[#00F3FF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                />
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 md:p-12 mb-8 relative overflow-hidden backdrop-blur-sm"
                >
                    <h3 className="text-2xl md:text-3xl font-medium text-white leading-relaxed text-center">
                        {currentQuestion.text}
                    </h3>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F3FF]/30 to-transparent"></div>
                </motion.div>
            </AnimatePresence>

            {/* Options - Likert Scale */}
            <div className="grid gap-4 mb-12">
                <div className="flex justify-between items-end px-2 mb-4">
                    {config.showLabels !== false && labels.map((label, idx) => (
                        <span key={idx} className={`text-[9px] uppercase tracking-widest font-black transition-colors duration-300 w-1/${scaleSize} text-center ${selectedOption === idx + 1 ? 'text-[#00F3FF]' : 'text-white/20'}`}>
                            {label}
                        </span>
                    ))}
                </div>

                <div className="relative h-16 flex items-center justify-between px-4 bg-white/[0.02] rounded-full border border-white/5">
                    {/* Line */}
                    <div className="absolute left-4 right-4 h-[2px] bg-white/10 z-0"></div>

                    {Array.from({ length: scaleSize }).map((_, i) => {
                        const value = i + 1;
                        const isSelected = selectedOption === value;

                        return (
                            <button
                                key={value}
                                onClick={() => handleSelect(value)}
                                className={`relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-[#00F3FF] border-[#00F3FF] scale-125 shadow-[0_0_20px_rgba(0,243,255,0.5)]' : 'bg-[#080A0F] border-white/20 hover:border-white/50 hover:bg-white/5'}`}
                            >
                                {isSelected && <Check className="w-4 h-4 md:w-5 md:h-5 text-black" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center">
                <button
                    onClick={handleNext}
                    disabled={selectedOption === null}
                    className={`group flex items-center gap-3 px-8 py-4 rounded-full font-black uppercase tracking-[0.2em] transition-all duration-300 ${selectedOption !== null ? 'bg-white text-[#080A0F] hover:bg-[#00F3FF]' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                >
                    {currentQuestionIndex < config.questions.length - 1 ? 'Siguiente' : 'Finalizar'}
                    <ChevronRight className={`w-5 h-5 transition-transform ${selectedOption !== null ? 'group-hover:translate-x-1' : ''}`} />
                </button>
            </div>
        </div>
    );
};
