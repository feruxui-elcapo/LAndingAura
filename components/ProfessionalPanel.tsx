
import React from 'react';
import { motion } from 'framer-motion';
import { Users, ClipboardList, Send, Calendar, ArrowUpRight, ChevronLeft } from 'lucide-react';

export const ProfessionalPanel: React.FC<any> = ({ onBack, onLogout }) => {
  return (
    <div className="min-h-screen bg-[#080A0F] text-white p-6 md:p-12 pb-32 font-mono">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-16">
        <div className="flex items-center gap-6">
          {onBack && (
            <button onClick={onBack} className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <ChevronLeft className="w-5 h-5 text-white/40" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-black uppercase tracking-[0.2em] flex items-center gap-3">
              <Users className="w-8 h-8 text-[#00F3FF]" /> DASHBOARD_PROFESIONAL
            </h1>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-2">Licencia: L3_VALIDATED // SESIÓN ACTIVA</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
        {/* Patient List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-widest">Lista de Pacientes / Sujetos</h2>
            <button className="px-4 py-2 bg-[#00F3FF] text-[#080A0F] rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
              <Send className="w-3 h-3" /> Invitar Sujeto
            </button>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-[40px] overflow-hidden">
            <table className="w-full text-left text-[11px] uppercase tracking-widest">
              <thead className="bg-white/5 text-white/30">
                <tr>
                  <th className="p-6">Sujeto</th>
                  <th className="p-6">Estado Evaluación</th>
                  <th className="p-6">Último Vínculo</th>
                  <th className="p-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <PatientRow name="Sujeto_#821 (Alex)" status="Completo" date="Hoy, 10:24" color="#00F3FF" />
                <PatientRow name="Sujeto_#825 (Marta)" status="Pendiente Motor B" date="Ayer" color="#7B2CBF" />
                <PatientRow name="Sujeto_#830 (Héctor)" status="Esperando Ingesta" date="Hace 2 días" color="#white" />
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Schedule */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#00F3FF]/5 border border-[#00F3FF]/20 rounded-[40px] p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Próximas Evaluaciones
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold">Orientación Vocacional</p>
                  <p className="text-[8px] text-white/30 uppercase">Sujeto_#901</p>
                </div>
                <span className="text-[9px] text-[#00F3FF]">14:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const PatientRow = ({ name, status, date, color }: any) => (
  <tr className="hover:bg-white/5 transition-colors group">
    <td className="p-6 font-bold">{name}</td>
    <td className="p-6">
      <div className="flex items-center gap-2">
        <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: color }}></div>
        <span style={{ color }}>{status}</span>
      </div>
    </td>
    <td className="p-6 text-white/30">{date}</td>
    <td className="p-6">
      <button className="p-2 rounded-lg bg-white/5 hover:bg-[#00F3FF] hover:text-[#080A0F] transition-all">
        <ArrowUpRight className="w-3 h-3" />
      </button>
    </td>
  </tr>
);
