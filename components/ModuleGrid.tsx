
import React from 'react';
import { Brain, Zap, Target, ArrowUpRight, ShieldX, Activity } from 'lucide-react';
import { TestDefinition } from '../App';

interface ModuleCardProps {
  test: TestDefinition;
  onClick: (id: string) => void;
}

const ModuleCard = ({ test, onClick }: ModuleCardProps) => {
  const getIcon = () => {
    switch(test.type) {
      case 'mfc': return Brain;
      case 'bart': return Target;
      case 'gonogo': return ShieldX;
      default: return Activity;
    }
  };
  const Icon = getIcon();

  return (
    <div 
      onClick={() => onClick(test.id)}
      className="group rounded-[32px] bg-white/[0.03] border border-white/10 p-4 hover:border-white/20 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110" style={{ color: test.color }}>
          <Icon className="w-4 h-4" />
        </div>
        <ArrowUpRight className="w-3 h-3 text-white/20 group-hover:text-white transition-colors" />
      </div>
      <h4 className="text-[10px] font-black mb-1 tracking-[0.2em] group-hover:text-[#00F3FF] transition-colors uppercase">{test.title}</h4>
      <p className="text-[8px] text-white/30 leading-relaxed font-medium uppercase truncate">{test.description}</p>
      <div className="absolute -bottom-12 -right-12 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: `${test.color}20` }}></div>
    </div>
  );
};

interface ModuleGridProps {
  onStartEvaluation: (id: string) => void;
  catalog: TestDefinition[];
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({ onStartEvaluation, catalog }) => {
  return (
    <div className="grid gap-4 grid-cols-2">
      {catalog.map(test => (
        <ModuleCard key={test.id} test={test} onClick={onStartEvaluation} />
      ))}
    </div>
  );
};
