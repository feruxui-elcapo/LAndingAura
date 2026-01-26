
import React from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, Users, Target, ShieldCheck, ChevronLeft, BarChart2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const teamData = [
  { subject: 'Lógica', value: 120 },
  { subject: 'Empatía', value: 80 },
  { subject: 'Foco', value: 110 },
  { subject: 'Social', value: 140 },
  { subject: 'Resiliencia', value: 90 },
];

export const CorporatePanel: React.FC<any> = ({ evaluations = [], onBack }) => {
  return (
    <div className="min-h-screen bg-[#080A0F] text-white p-6 md:p-12 pb-32">
      <header className="max-w-7xl mx-auto flex justify-between items-end mb-16">
        <div className="flex items-center gap-6">
          {onBack && (
            <button onClick={onBack} className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <ChevronLeft className="w-5 h-5 text-white/40" />
            </button>
          )}
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
              <Building2 className="w-10 h-10 text-[#FF9FFC]" /> ANALÍTICA DE EQUIPO
            </h1>
            <p className="text-xs text-[#FF9FFC] font-bold uppercase tracking-[0.4em] mt-2">ORGANIZACIÓN: CORPORACIÓN GLOBAL</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40">
          Licencias Activas: 142 / 200
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CorpStat icon={Users} label="Colaboradores Evaluados" value={evaluations.length.toString()} />
          <CorpStat icon={BarChart2} label="Evaluaciones Totales" value="482" />
          <CorpStat icon={Target} label="Promedio General" value="112" />
          <CorpStat icon={ShieldCheck} label="Nivel de Confianza" value="Alto" />
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-[48px] p-12">
            <h3 className="text-lg font-black uppercase tracking-widest mb-8">Radar de Competencias Grupales</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={teamData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'white', fontSize: 10, opacity: 0.5 }} />
                  <Radar name="Equipo" dataKey="value" stroke="#FF9FFC" fill="#FF9FFC" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-gradient-to-br from-[#7B2CBF]/20 to-transparent border border-white/10 rounded-[40px] p-8">
              <h4 className="text-sm font-black uppercase tracking-widest mb-4">Tendencias de Desarrollo</h4>
              <p className="text-xs text-white/40 leading-relaxed uppercase tracking-widest">
                El equipo demuestra una excelente competencia en habilidades sociales. Se observa un área de oportunidad en el enfoque sostenido bajo presión.
              </p>
            </div>

            <button className="w-full py-6 bg-white text-[#080A0F] font-black rounded-[32px] text-xs tracking-[0.4em] uppercase hover:scale-105 transition-all">
              Descargar Informe de Resultados .PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const CorpStat = ({ icon: Icon, label, value }: any) => (
  <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5">
    <Icon className="w-5 h-5 text-white/20 mb-4" />
    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black">{value}</p>
  </div>
);
