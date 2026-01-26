
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ClipboardList, Send, Calendar, ArrowUpRight, ChevronLeft, X, Plus, Clock, Shield, Search, ChevronDown, CheckCircle2 } from 'lucide-react';
import { TestDefinition, PatientRecord } from '../App';

interface ProfessionalPanelProps {
  onBack: () => void;
  onLogout: () => void;
  catalog: TestDefinition[];
  patients: PatientRecord[];
  setPatients: React.Dispatch<React.SetStateAction<PatientRecord[]>>;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  evaluations: any[];
}

export const ProfessionalPanel: React.FC<ProfessionalPanelProps> = ({
  onBack, onLogout, catalog, patients, setPatients, notifications, setNotifications, evaluations
}) => {
  const [isInviting, setIsInviting] = useState(false);
  const [isAssigning, setIsAssigning] = useState<string | null>(null); // Patient ID
  const [inviteData, setInviteData] = useState({ name: '', email: '' });
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [viewingPatient, setViewingPatient] = useState<PatientRecord | null>(null);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: PatientRecord = {
      id: Date.now().toString(),
      name: inviteData.name,
      email: inviteData.email,
      status: 'pending',
      assignedTests: [],
      resultsShared: false,
      history: []
    };
    setPatients([...patients, newPatient]);
    setNotifications(prev => [...prev, {
      id: `noti_${Date.now()}`,
      type: 'data_access',
      from: 'Dr. Smith (AURA_PRO)',
      timestamp: new Date().toISOString()
    }]);
    setInviteData({ name: '', email: '' });
    setIsInviting(false);
  };

  const handleAssignTests = () => {
    if (!isAssigning) return;
    setPatients(patients.map(p =>
      p.id === isAssigning
        ? { ...p, assignedTests: [...p.assignedTests, ...selectedTests] }
        : p
    ));

    // Generate notification for each assigned test
    const newNotifications = selectedTests.map((testId, index) => ({
      id: `noti_${Date.now()}_${index}`,
      type: 'test_invite',
      testId,
      from: 'Dr. Smith (AURA_PRO)',
      timestamp: new Date().toISOString()
    }));

    setNotifications(prev => [...prev, ...newNotifications]);

    setIsAssigning(null);
    setSelectedTests([]);
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-white p-6 md:p-12 pb-32 font-mono">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-16">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <ChevronLeft className="w-5 h-5 text-white/40" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-[0.2em] flex items-center gap-3">
              <Users className="w-8 h-8 text-[#00F3FF]" /> PANEL DE PROFESIONALES
            </h1>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-2">Licencia: L3_VALIDA // SESIÓN ACTIVA</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-widest">Pacientes Registrados</h2>
            <button
              onClick={() => setIsInviting(true)}
              className="px-6 py-3 bg-[#00F3FF] text-[#080A0F] rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" /> Registrar Paciente
            </button>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-[40px] overflow-hidden">
            <table className="w-full text-left text-[11px] uppercase tracking-widest">
              <thead className="bg-white/5 text-white/30 font-black">
                <tr>
                  <th className="p-8">Paciente / Mail</th>
                  <th className="p-8">Estado</th>
                  <th className="p-8">Acceso</th>
                  <th className="p-8">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {patients.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-8">
                      <div className="font-bold text-white/90 text-sm">{p.name}</div>
                      <div className="text-[9px] text-white/20 mt-1">{p.email}</div>
                    </td>
                    <td className="p-8">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black tracking-widest ${p.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-8">
                      {p.resultsShared ? (
                        <div className="flex items-center gap-2 text-[#00F3FF]">
                          <Shield className="w-3 h-3" />
                          <span className="text-[9px] font-black">AUTORIZADO</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-white/10">
                          <Shield className="w-3 h-3" />
                          <span className="text-[9px] font-black">PENDIENTE</span>
                        </div>
                      )}
                    </td>
                    <td className="p-8">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setIsAssigning(p.id)}
                          className="p-3 bg-white/5 rounded-xl hover:text-[#00F3FF] transition-all"
                          title="Asignar Test"
                        >
                          <ClipboardList className="w-4 h-4" />
                        </button>
                        <button
                          disabled={!p.resultsShared}
                          onClick={() => setViewingPatient(p)}
                          className="p-3 bg-white/5 rounded-xl hover:text-[#FF9FFC] transition-all disabled:opacity-20"
                          title="Ver Resultados"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 text-white/40">
              <Clock className="w-4 h-4" /> Actividad Reciente
            </h3>
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
                <p className="text-[10px] font-bold text-[#00F3FF]">Evaluación Completada</p>
                <p className="text-[11px] mt-1 uppercase">Alex completó Motor B1</p>
                <p className="text-[8px] text-white/20 mt-2 uppercase tracking-widest">Hace 2 horas</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isInviting && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#080A0F]/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md bg-[#11141D] border border-white/10 rounded-[40px] p-10 relative">
              <button onClick={() => setIsInviting(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X /></button>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-8 text-[#00F3FF]">Registrar Paciente</h2>
              <form onSubmit={handleInvite} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/30">Nombre Completo</label>
                  <input
                    required
                    value={inviteData.name}
                    onChange={e => setInviteData({ ...inviteData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#00F3FF]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/30">Correo Electrónico</label>
                  <input
                    required
                    type="email"
                    value={inviteData.email}
                    onChange={e => setInviteData({ ...inviteData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#00F3FF]"
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-[#00F3FF] text-[#080A0F] font-black rounded-[24px] uppercase tracking-widest shadow-xl shadow-[#00F3FF]/20">Confirmar Registro</button>
              </form>
            </motion.div>
          </div>
        )}

        {isAssigning && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#080A0F]/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-xl bg-[#11141D] border border-white/10 rounded-[40px] p-10 relative">
              <button onClick={() => setIsAssigning(null)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X /></button>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-2 text-[#00F3FF]">Solicitar Evaluaciones</h2>
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-8">El paciente recibirá una notificación por cada test solicitado</p>

              <div className="space-y-3 max-h-[300px] overflow-y-auto mb-8 pr-4">
                {catalog.map(test => (
                  <label key={test.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:border-[#00F3FF]/40 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: test.color }}></div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest">{test.title}</p>
                        <p className="text-[9px] text-white/20">{test.description}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedTests.includes(test.id)}
                      onChange={e => {
                        if (e.target.checked) setSelectedTests([...selectedTests, test.id]);
                        else setSelectedTests(selectedTests.filter(id => id !== test.id));
                      }}
                      className="w-5 h-5 rounded-lg accent-[#00F3FF]"
                    />
                  </label>
                ))}
              </div>

              <button
                onClick={handleAssignTests}
                className="w-full py-5 bg-[#00F3FF] text-[#080A0F] font-black rounded-[24px] uppercase tracking-widest shadow-xl shadow-[#00F3FF]/20"
              >
                Enviar Invitaciones ({selectedTests.length})
              </button>
            </motion.div>
          </div>
        )}

        {viewingPatient && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#080A0F]/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-4xl bg-[#11141D] border border-white/10 rounded-[50px] p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9FFC]/10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              <button onClick={() => setViewingPatient(null)} className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl hover:bg-white/10 text-white/30 hover:text-white transition-all"><X /></button>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">{viewingPatient.name}</h2>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#FF9FFC]">
                    <span>ID: {viewingPatient.id}</span>
                    <span>•</span>
                    <span>ACCESO AUTORIZADO</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-right">
                    <p className="text-[9px] text-white/20 uppercase font-bold">Última Evaluación</p>
                    <p className="text-xs font-black uppercase">22 Ene, 2026</p>
                  </div>
                  <div className="w-[1px] h-8 bg-white/10"></div>
                  <div className="text-right">
                    <p className="text-[9px] text-white/20 uppercase font-bold">Protocolos Hechos</p>
                    <p className="text-xs font-black uppercase">12</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <ResultCard label="Lógica" value="132" change="+12" color="#00F3FF" />
                <ResultCard label="Foco" value="118" change="-2" color="#7B2CBF" />
                <ResultCard label="Social" value="145" change="+5" color="#FF9FFC" />
              </div>

              <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-[32px]">
                <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> Historial de Protocolos
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-4 border-b border-white/5 px-4 bg-white/[0.02] rounded-xl">
                    <span className="text-xs font-black">MOTOR B1: STROOP</span>
                    <span className="text-[10px] font-mono text-[#00F3FF]">SCORE: 114</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-white/5 px-4">
                    <span className="text-xs font-black text-white/40">MOTOR A: MFC</span>
                    <span className="text-[10px] font-mono text-white/20">SCORE: 121</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ResultCard = ({ label, value, change, color }: any) => (
  <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 relative overflow-hidden group">
    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }}></div>
    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">{label}</p>
    <div className="flex items-end gap-3">
      <span className="text-4xl font-black">{value}</span>
      <span className={`text-[10px] font-black pb-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</span>
    </div>
  </div>
);

const CustomSelect = ({ value, options, onChange }: { value: string, options: { value: string, label: string }[], onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center justify-between hover:border-[#00F3FF]/40 transition-all font-bold group"
      >
        <span className="text-sm tracking-tight">{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 text-white/30 group-hover:text-[#00F3FF] transition-all ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[250]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[#1A1D25] border border-white/10 rounded-2xl shadow-2xl z-[260] overflow-hidden backdrop-blur-xl"
            >
              <div className="p-2 space-y-1">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${value === opt.value ? 'bg-[#00F3FF] text-[#080A0F]' : 'hover:bg-white/5 text-white/60 hover:text-white'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
