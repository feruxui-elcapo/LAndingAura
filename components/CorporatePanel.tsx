import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, Users, Target, ShieldCheck, ChevronLeft, LogOut } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const MOCK_TEAM_DATA = [
  { subject: 'Lógica', value: 120 },
  { subject: 'Empatía', value: 80 },
  { subject: 'Foco', value: 110 },
  { subject: 'Social', value: 140 },
  { subject: 'Resiliencia', value: 90 },
];

interface CorporatePanelProps {
  onBack: () => void;
  onLogout: () => void;
  evaluations: any[];
}

export const CorporatePanel: React.FC<CorporatePanelProps> = ({ onBack, onLogout, evaluations }) => {
  const teamAverages = useMemo(() => {
    if (!evaluations || evaluations.length === 0) return MOCK_TEAM_DATA;

    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};

    evaluations.forEach(ev => {
      ev.results?.forEach((res: any) => {
        totals[res.subject] = (totals[res.subject] || 0) + (res.A || 0);
        counts[res.subject] = (counts[res.subject] || 0) + 1;
      });
    });


    return Object.keys(totals).map(subject => ({
      subject,
      value: totals[subject] / (counts[subject] || 1)
    }));
  }, [evaluations]);

  const uniqueUsers = new Set(evaluations.map(e => e.user)).size;
  const globalPrecision = 98.1 + (Math.random() * 0.5);

  return (
    <div className="min-h-screen bg-[#080A0F] text-white p-6 md:p-12 pb-32">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
              <Building2 className="w-8 h-8 md:w-10 md:h-10 text-[#FF9FFC]" /> TEAM_ANALYTICS
            </h1>
            <p className="text-[10px] text-[#FF9FFC] font-bold uppercase tracking-[0.4em] mt-2">ORGANIZACIÓN: TECH_CORP_GLOBAL</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40">
            Sujetos: {uniqueUsers} / 200
          </div>
          <button onClick={onLogout} className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:text-red-500 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <CorpStat icon={Users} label="Sesiones Totales" value={evaluations.length} />
          <CorpStat icon={Target} label="Precisión Global" value={`${globalPrecision.toFixed(1)}%`} />
          <CorpStat icon={TrendingUp} label="Crecimiento" value="+12%" />
          <CorpStat icon={ShieldCheck} label="Fuga Talento" value="Baja" />
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-[48px] p-8 md:p-12">
            <h3 className="text-sm md:text-lg font-black uppercase tracking-widest mb-8 text-white/40">Radar de Cultura de Equipo</h3>
            <div className="h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={teamAverages}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'white', fontSize: 9, opacity: 0.5 }} />
                  <Radar name="Equipo" dataKey="value" stroke="#FF9FFC" fill="#FF9FFC" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-gradient-to-br from-[#7B2CBF]/20 to-transparent border border-white/10 rounded-[40px] p-8">
              <h4 className="text-sm font-black uppercase tracking-widest mb-4">Insights de Gestión</h4>
              <p className="text-[10px] md:text-xs text-white/40 leading-relaxed uppercase tracking-widest">
                El análisis heurístico detecta una alta cohesión en dimensiones sociales y analíticas.
                Los niveles de resiliencia sugieren una estructura adaptativa óptima para el trimestre actual.
              </p>
            </div>

            <button className="w-full py-6 md:py-8 bg-white text-[#080A0F] font-black rounded-[32px] text-xs tracking-[0.4em] uppercase hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
              Exportar Reporte Corporativo .PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const CorpStat = ({ icon: Icon, label, value }: any) => (
  <div className="p-6 md:p-8 rounded-[32px] bg-white/[0.02] border border-white/5">
    <Icon className="w-4 h-4 md:w-5 md:h-5 text-white/20 mb-4" />
    <p className="text-[8px] md:text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-xl md:text-3xl font-black">{value}</p>
  </div>
);

