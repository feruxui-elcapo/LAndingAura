
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Terminal, ChevronLeft, Users, Settings2, BarChart3, CloudUpload, Search, Plus, Filter, ShieldCheck, Globe, Trash2, Edit3, X, Save, Download, FileSpreadsheet, Upload } from 'lucide-react';
import { TestDefinition, PerformanceLog, BiometricPoint, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface NexusPanelProps {
  onBack: () => void;
  onLogout: () => void;
  catalog: TestDefinition[];
  setCatalog: React.Dispatch<React.SetStateAction<TestDefinition[]>>;
  evaluations: any[];
}

type NexusTab = 'abm' | 'catalog' | 'norms' | 'research';


export const NexusPanel: React.FC<NexusPanelProps> = ({ onBack, onLogout, catalog, setCatalog, evaluations }) => {
  const [activeTab, setActiveTab] = useState<NexusTab>('abm');

  const [editingTest, setEditingTest] = useState<TestDefinition | null>(null);
  const [inspectingSessionId, setInspectingSessionId] = useState<string | null>(null);
  const [selectedSessionLogs, setSelectedSessionLogs] = useState<PerformanceLog[] | null>(null);

  const [editingNormsCountry, setEditingNormsCountry] = useState<string>('LATAM');
  const [selectedNormTestId, setSelectedNormTestId] = useState<string>('');

  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('');

  const handleSaveTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;

    if (editingTest.id.startsWith('test_') && !catalog.find(t => t.id === editingTest.id)) {
      setCatalog([...catalog, editingTest]);
    } else {
      setCatalog(catalog.map(t => t.id === editingTest.id ? editingTest : t));
    }

    // Also save to Supabase
    await supabase.from('test_definitions').upsert({
      id: editingTest.id,
      title: editingTest.title,
      type: editingTest.type,
      description: editingTest.description,
      config: editingTest.config,
      color: editingTest.color
    });

    setEditingTest(null);
  };

  const handleDeleteTest = async (id: string) => {
    setCatalog(catalog.filter(t => t.id !== id));
    await supabase.from('test_definitions').delete().eq('id', id);
  };

  const inspectSession = async (sessionId: string) => {
    setInspectingSessionId(sessionId);
    const { data } = await supabase.from('neuro_logs').select('*').eq('session_id', sessionId).single();
    if (data) {
      setSelectedSessionLogs(data.events);
    } else {
      setSelectedSessionLogs([]);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    // Implementation placeholder
    console.log("Exporting", filename);
  };

  const downloadNormsTemplate = () => {
    // Implementation placeholder
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-white p-6 md:p-12 pb-32 font-mono relative overflow-hidden">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-16 relative z-10">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4 text-[10px] uppercase font-bold tracking-widest">
            <ChevronLeft className="w-4 h-4" /> Volver al Core
          </button>
          <h1 className="text-3xl font-black uppercase tracking-[0.2em] flex items-center gap-3">
            <Database className="w-8 h-8 text-[#7B2CBF]" /> EL NEXO <span className="text-[#7B2CBF]">//</span> ADMIN
          </h1>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-2">Sistema Maestro de Configuración y Análisis</p>
        </div>
        <button onClick={onLogout} className="px-6 py-2 border border-red-500/30 text-red-400 rounded-full hover:bg-red-500/10 text-[10px] uppercase font-bold tracking-widest transition-all">
          Cerrar Sesión Maestra
        </button>
      </header>

      <main className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Nav */}
          <nav className="w-full lg:w-64 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            <TabBtn id="abm" label="Usuarios" icon={Users} active={activeTab === 'abm'} onClick={() => setActiveTab('abm')} />
            <TabBtn id="catalog" label="Catálogo Tests" icon={Terminal} active={activeTab === 'catalog'} onClick={() => setActiveTab('catalog')} />
            <TabBtn id="norms" label="Baremos Globales" icon={BarChart3} active={activeTab === 'norms'} onClick={() => setActiveTab('norms')} />
            <TabBtn id="research" label="Investigación" icon={Database} active={activeTab === 'research'} onClick={() => setActiveTab('research')} />
          </nav>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {activeTab === 'catalog' && (
              <motion.div key="catalog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <h2 className="text-xl font-black uppercase tracking-widest">Catálogo de Pruebas</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportToCSV(catalog, "Aura_Test_Catalog")}
                      className="px-4 py-2 border border-white/10 text-white/40 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                    >
                      <Download className="w-3 h-3" /> Exportar JSON/CSV
                    </button>
                    <button
                      onClick={() => setEditingTest({ id: `test_${Date.now()}`, type: 'mfc', title: 'Nuevo Test', description: '', config: {}, color: '#00F3FF' })}
                      className="px-4 py-2 bg-[#00F3FF] text-[#080A0F] rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                    >
                      <Plus className="w-3 h-3" /> Crear Protocolo
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catalog.map(test => (
                    <div key={test.id} className="bg-white/[0.02] border border-white/10 p-8 rounded-[32px] relative group hover:border-white/20 transition-all">
                      <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingTest(test)} className="p-2 bg-white/5 rounded-lg hover:text-[#00F3FF] transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteTest(test.id)} className="p-2 bg-white/5 rounded-lg hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="text-[9px] font-black uppercase tracking-widest mb-4" style={{ color: test.color }}>Motor {test.type.toUpperCase()}</div>
                      <h3 className="text-lg font-black uppercase tracking-tight mb-2">{test.title}</h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">{test.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'norms' && (
              <motion.div key="norms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="bg-gradient-to-br from-[#7B2CBF]/10 to-transparent border border-white/10 p-10 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-xl">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Gestión de Normalización</h2>
                    <p className="text-sm text-white/40 leading-relaxed uppercase tracking-widest">
                      Selecciona un protocolo y una región para calibrar los baremos estadísticos.
                    </p>
                  </div>
                  <div className="flex bg-white/5 border border-white/10 rounded-2xl p-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#00F3FF]">Protocolo Objetivo</label>
                      <select
                        value={selectedNormTestId}
                        onChange={(e) => setSelectedNormTestId(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#00F3FF] outline-none uppercase font-bold"
                      >
                        <option value="">-- Seleccionar Test --</option>
                        {catalog.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#7B2CBF]">Región Demográfica</label>
                      <select
                        value={editingNormsCountry}
                        onChange={(e) => setEditingNormsCountry(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#7B2CBF] outline-none uppercase font-bold"
                      >
                        <option value="LATAM">LATAM (General)</option>
                        <option value="AR">Argentina</option>
                        <option value="MX">México</option>
                        <option value="CL">Chile</option>
                        <option value="CO">Colombia</option>
                        <option value="ES">España</option>
                      </select>
                    </div>
                  </div>
                </div>

                {selectedNormTestId ? (
                  <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#00F3FF]" />
                        Editor de Baremos: {catalog.find(t => t.id === selectedNormTestId)?.title} ({editingNormsCountry})
                      </h3>
                      <button
                        onClick={async () => {
                          // Save trigger via Supabase update
                          const testToUpdate = catalog.find(t => t.id === selectedNormTestId);
                          if (testToUpdate) {
                            await supabase.from('test_definitions').upsert({
                              id: testToUpdate.id,
                              title: testToUpdate.title,
                              type: testToUpdate.type,
                              description: testToUpdate.description,
                              config: testToUpdate.config,
                              color: testToUpdate.color,
                              norms: testToUpdate.norms
                            });
                            alert("Baremos actualizados y guardados en el núcleo.");
                          }
                        }}
                        className="px-4 py-2 bg-[#00F3FF]/20 text-[#00F3FF] border border-[#00F3FF]/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00F3FF] hover:text-[#080A0F] transition-all"
                      >
                        Confirmar Cambios
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Datos CSV (Categoría, Media, Desviación)</label>
                        <textarea
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none font-mono text-[10px] text-[#7B2CBF] min-h-[300px]"
                          placeholder="Social,100,15&#10;Cognitivo,100,15"
                          value={(() => {
                            const test = catalog.find(t => t.id === selectedNormTestId);
                            if (!test) return '';
                            const norms = test.norms?.[editingNormsCountry] || {};
                            return Object.entries(norms).map(([k, v]) => `${k},${(v as any).mean},${(v as any).stdDev}`).join('\n');
                          })()}
                          onChange={(e) => {
                            const testIndex = catalog.findIndex(t => t.id === selectedNormTestId);
                            if (testIndex === -1) return;

                            const lines = e.target.value.split('\n');
                            const currentCountryNorms: any = {};
                            lines.forEach(line => {
                              const [cat, mean, std] = line.split(',');
                              if (cat && mean && std) {
                                currentCountryNorms[cat.trim()] = { mean: parseFloat(mean), stdDev: parseFloat(std) };
                              }
                            });

                            const updatedCatalog = [...catalog];
                            const test = updatedCatalog[testIndex];
                            test.norms = { ...test.norms, [editingNormsCountry]: currentCountryNorms };
                            setCatalog(updatedCatalog);
                          }}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Vista Previa de Validación</h4>
                          <div className="space-y-2">
                            {(() => {
                              const test = catalog.find(t => t.id === selectedNormTestId);
                              if (!test || !test.norms?.[editingNormsCountry]) return <div className="text-white/20 text-[10px] italic">Sin datos cargados...</div>;
                              return Object.entries(test.norms[editingNormsCountry]).map(([k, v]: any) => (
                                <div key={k} className="flex justify-between items-center py-2 border-b border-white/5">
                                  <span className="text-[10px] font-bold text-white">{k}</span>
                                  <span className="text-[9px] font-mono text-[#00F3FF]">µ={v.mean} σ={v.stdDev}</span>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[40px]">
                    <BarChart3 className="w-12 h-12 text-white/10 mb-4" />
                    <p className="text-[10px] uppercase tracking-widest text-white/30">Selecciona un protocolo arriba para comenzar la edición.</p>
                  </div>
                )}
              </motion.div>
            )}


            {activeTab === 'research' && (
              <motion.div key="research" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-black uppercase tracking-widest">Panel de Investigación</h2>
                  <button
                    onClick={() => exportToCSV(evaluations, "AURA_Research_Data")}
                    disabled={evaluations.length === 0}
                    className="px-4 py-2 bg-[#7B2CBF] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:bg-[#8e44ad] disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <Download className="w-3 h-3" /> Descargar Raw Data (.CSV)
                  </button>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <StatBox label="Evaluaciones Reales" value={evaluations.length} color="#00F3FF" />
                  <StatBox label="Sujetos Únicos" value={new Set(evaluations.map(e => e.user)).size} color="#7B2CBF" />
                  <StatBox label="Clearance Promedio" value="88%" color="#FF9FFC" />
                  <StatBox label="Latencia Promedio" value="1.2ms" color="#FFFFFF" />
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-8 text-white/30">Log de Ingesta Real-Time</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-4 font-mono text-[10px]">
                    {evaluations.map((ev, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-white/5 text-white/50 group">
                        <span>[{ev.timestamp}] SUJETO: {ev.user}</span>
                        <div className="flex gap-4 items-center">
                          <span className="text-[#00F3FF]">PROCESADO_OK</span>
                          <button
                            onClick={() => inspectSession(ev.id)}
                            className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-white/5 rounded hover:text-[#00F3FF] transition-all"
                          >
                            INSPECCIONAR_TELEMETRIA
                          </button>
                        </div>
                      </div>
                    ))}
                    {evaluations.length === 0 && <div className="text-center py-12 text-white/10 italic">Esperando primeras evaluaciones...</div>}
                  </div>
                </div>

                {selectedSessionLogs && (
                  <div className="bg-[#11141D] border border-[#00F3FF]/30 rounded-[40px] p-8 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#00F3FF]">Telemetría de la Sesión: {inspectingSessionId}</h3>
                      <button onClick={() => setSelectedSessionLogs(null)} className="p-2 bg-white/5 rounded-lg hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[8px] font-black uppercase text-white/20 border-b border-white/5 pb-2">
                      <span>Timestamp</span>
                      <span>Evento</span>
                      <span>Detalles</span>
                    </div>
                    <div className="space-y-1 max-h-96 overflow-y-auto pr-2 font-mono text-[9px]">
                      {selectedSessionLogs.map((log, i) => (
                        <div key={i} className="grid grid-cols-3 gap-2 py-1 border-b border-white/5 text-white/40">
                          <span className="text-[#7B2CBF]">{log.timestamp.toFixed(2)}ms</span>
                          <span className="text-white font-bold">{log.event}</span>
                          <span className="truncate">{JSON.stringify(log.details)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'abm' && (
              <motion.div key="abm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white/[0.03] border border-white/10 rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-white/10 flex justify-between items-center">
                  <h2 className="text-xl font-black uppercase tracking-widest">Gestión de Nodos</h2>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                      <input className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2 text-[10px] uppercase font-bold focus:border-[#00F3FF] outline-none w-64" placeholder="Buscar ID / Alias..." />
                    </div>
                  </div>
                </div>
                <table className="w-full text-left text-[11px] uppercase tracking-widest">
                  <thead className="bg-white/5 text-white/30 font-bold">
                    <tr>
                      <th className="p-6">Sujeto / Alias</th>
                      <th className="p-6">Rol</th>
                      <th className="p-6">Clearance</th>
                      <th className="p-6">Estado</th>
                      <th className="p-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <UserRow id="ID_8122" alias="Explorer_Alpha" rol="EXPLORADOR" level="A1" status="Active" />
                    <UserRow id="ID_0029" alias="Pro_Clin_South" rol="PROFESIONAL" level="L3" status="Active" />
                    <UserRow id="ID_9901" alias="HR_Lead_Global" rol="CORPORATE" level="C2" status="Pending" />
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {editingTest && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#080A0F]/90 backdrop-blur-md">
            <motion.form
              onSubmit={handleSaveTest}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl bg-[#11141D] border border-white/10 rounded-[40px] p-10 space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black uppercase tracking-widest">Configurar Protocolo</h2>
                <button type="button" onClick={() => setEditingTest(null)}><X className="w-6 h-6 text-white/30" /></button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Nombre Público</label>
                  <input
                    value={editingTest.title}
                    onChange={e => setEditingTest({ ...editingTest, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00F3FF]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Tipo de Motor</label>
                  <select
                    value={editingTest.type}
                    onChange={e => setEditingTest({ ...editingTest, type: e.target.value as any })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00F3FF]"
                  >
                    <option value="mfc">MFC (Psicometría)</option>
                    <option value="bart">BART (Riesgo)</option>
                    <option value="gonogo">Go/No-Go (Impulso)</option>
                    <option value="likert">Encuesta Likert</option>
                  </select>
                </div>
              </div>

              {editingTest.type === 'likert' ? (
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#00F3FF] block mb-3">Agregar Nueva Pregunta</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        value={newQuestionText}
                        onChange={e => setNewQuestionText(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#00F3FF] outline-none"
                        placeholder="Texto de la pregunta..."
                      />
                      <input
                        value={newQuestionCategory}
                        onChange={e => setNewQuestionCategory(e.target.value)}
                        className="w-24 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:border-[#00F3FF] outline-none"
                        placeholder="Categoría"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newQuestionText || !newQuestionCategory) return;
                          const currentQuestions = editingTest.config.questions || [];
                          const newQ = {
                            id: `q${currentQuestions.length + 1}`,
                            text: newQuestionText,
                            category: newQuestionCategory
                          };
                          setEditingTest({
                            ...editingTest,
                            config: { ...editingTest.config, questions: [...currentQuestions, newQ] }
                          });
                          setNewQuestionText('');
                        }}
                        className="px-3 bg-[#00F3FF]/20 text-[#00F3FF] rounded-lg hover:bg-[#00F3FF] hover:text-[#080A0F] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-2">
                      Preguntas Configuradas ({editingTest.config.questions?.length || 0})
                    </label>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                      {editingTest.config.questions?.map((q: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                          <div>
                            <div className="text-[10px] text-white font-bold">{q.text}</div>
                            <div className="text-[8px] text-[#00F3FF] uppercase tracking-widest">{q.category}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingTest.config.questions.filter((_: any, i: number) => i !== idx);
                              setEditingTest({ ...editingTest, config: { ...editingTest.config, questions: updated } });
                            }}
                            className="text-white/20 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {(!editingTest.config.questions || editingTest.config.questions.length === 0) && (
                        <div className="text-center py-4 text-[10px] text-white/20 italic border border-dashed border-white/10 rounded-xl">
                          No hay preguntas definidas todavía.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              ) : (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Configuración Lógica (JSON Raw)</label>
                  <textarea
                    value={JSON.stringify(editingTest.config, null, 2)}
                    onChange={e => {
                      try { setEditingTest({ ...editingTest, config: JSON.parse(e.target.value) }); } catch { }
                    }}
                    rows={6}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none font-mono text-[10px] text-[#00F3FF]"
                  />
                </div>
              )}

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#7B2CBF]">Baremos & Normalización</h3>
                  <select
                    value={editingNormsCountry}
                    onChange={(e) => setEditingNormsCountry(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] uppercase font-bold outline-none focus:border-[#7B2CBF]"
                  >
                    <option value="LATAM">LATAM (General)</option>
                    <option value="AR">Argentina</option>
                    <option value="MX">México</option>
                    <option value="CL">Chile</option>
                    <option value="CO">Colombia</option>
                    <option value="ES">España</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Carga Masiva para {editingNormsCountry} (CSV: Categoría, Media, Desviación)</label>
                  <textarea
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none font-mono text-[10px] text-[#7B2CBF] min-h-[100px]"
                    placeholder="Social,100,15&#10;Cognitivo,100,15"
                    value={Object.entries(editingTest.norms?.[editingNormsCountry] || {}).map(([k, v]) => `${k},${(v as any).mean},${(v as any).stdDev}`).join('\n')}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n');
                      const currentCountryNorms: any = {};
                      lines.forEach(line => {
                        const [cat, mean, std] = line.split(',');
                        if (cat && mean && std) {
                          currentCountryNorms[cat.trim()] = { mean: parseFloat(mean), stdDev: parseFloat(std) };
                        }
                      });

                      const updatedNorms = { ...editingTest.norms, [editingNormsCountry]: currentCountryNorms };
                      setEditingTest({ ...editingTest, norms: updatedNorms });
                    }}
                  />
                  <p className="text-[8px] text-white/30 mt-2 uppercase tracking-widest">Calculadora Z-Score automática para la región seleccionada.</p>
                </div>
              </div>


              <button type="submit" className="w-full py-4 bg-[#00F3FF] text-[#080A0F] font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Guardar en Núcleo
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TabBtn = ({ id, label, icon: Icon, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-xl flex items-center gap-3 transition-all ${active ? 'bg-[#00F3FF] text-[#080A0F] font-black' : 'text-white/40 hover:text-white font-bold'} text-[10px] uppercase tracking-widest`}
  >
    <Icon className="w-4 h-4" /> {label}
  </button>
);

const StatBox = ({ label, value, color }: any) => (
  <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[24px]">
    <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">{label}</div>
    <div className="text-2xl font-black" style={{ color }}>{value}</div>
  </div>
);

const UserRow = ({ id, alias, rol, level, status }: any) => (
  <tr className="hover:bg-white/[0.02] transition-colors group">
    <td className="p-6 font-bold">{alias} <br /><span className="text-[9px] text-white/20">{id}</span></td>
    <td className="p-6"><span className="px-2 py-1 rounded-lg bg-white/5 border border-white/5">{rol}</span></td>
    <td className="p-6 font-mono text-[#00F3FF]">{level}</td>
    <td className="p-6">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        <span className={status === 'Active' ? 'text-green-500' : 'text-yellow-500'}>{status}</span>
      </div>
    </td>
    <td className="p-6 text-white/20 group-hover:text-white transition-all cursor-pointer">
      <Settings2 className="w-4 h-4" />
    </td>
  </tr>
);
