
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Terminal, ChevronLeft, ChevronDown, Users, Settings2, BarChart3, CloudUpload, Search, Plus, Filter, ShieldCheck, Globe, Trash2, Edit3, X, Save, Download, FileSpreadsheet, Upload } from 'lucide-react';
import { TestDefinition } from '../App';

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

  const handleDeleteTest = (id: string) => {
    if (confirm('¿Confirmas la desincorporación de este protocolo? Esta acción es irreversible.')) {
      setCatalog(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;

    setCatalog(prev => {
      const exists = prev.find(t => t.id === editingTest.id);
      if (exists) {
        return prev.map(t => t.id === editingTest.id ? editingTest : t);
      }
      return [...prev, editingTest];
    });
    setEditingTest(null);
  };

  const exportToCSV = (data: any[], fileName: string) => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj =>
      Object.values(obj).map(val =>
        typeof val === 'object' ? JSON.stringify(val).replace(/,/g, ';') : val
      ).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadNormsTemplate = () => {
    const template = [
      { dimension: 'Lógica', media: 75, desviacion: 15, percentil_50: 75, percentil_90: 110, motor_referencia: 'MFC_v2' },
      { dimension: 'Empatía', media: 70, desviacion: 12, percentil_50: 70, percentil_90: 105, motor_referencia: 'MFC_v2' },
      { dimension: 'Creatividad', media: 80, desviacion: 20, percentil_50: 80, percentil_90: 125, motor_referencia: 'MFC_v2' },
      { dimension: 'Social', media: 65, desviacion: 18, percentil_50: 65, percentil_90: 100, motor_referencia: 'MFC_v2' },
      { dimension: 'Resiliencia', media: 72, desviacion: 14, percentil_50: 72, percentil_90: 115, motor_referencia: 'BART_v1' },
      { dimension: 'Foco', media: 78, desviacion: 10, percentil_50: 78, percentil_90: 120, motor_referencia: 'GNG_v1' },
    ];
    exportToCSV(template, "AURA_Baremos_Template");
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-white p-4 md:p-12 pb-32">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-[0.3em] flex items-center gap-3">
              <Database className="w-6 h-6 md:w-8 md:h-8 text-[#7B2CBF]" /> EL NEXO
            </h1>
            <div className="flex items-center gap-3 mt-1 text-[9px] text-white/30 uppercase tracking-[0.4em]">
              <span className="text-[#00F3FF] font-black">Nivel: ARQUITECTO DEL SISTEMA</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Operaciones Nucleares v2.5</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-8 bg-white/5 p-1 rounded-2xl border border-white/10 inline-flex">
          <TabBtn id="abm" label="Gestión ABM" icon={Users} active={activeTab === 'abm'} onClick={() => setActiveTab('abm')} />
          <TabBtn id="catalog" label="Catálogo Tests" icon={Settings2} active={activeTab === 'catalog'} onClick={() => setActiveTab('catalog')} />
          <TabBtn id="norms" label="Baremos" icon={CloudUpload} active={activeTab === 'norms'} onClick={() => setActiveTab('norms')} />
          <TabBtn id="research" label="Investigación" icon={BarChart3} active={activeTab === 'research'} onClick={() => setActiveTab('research')} />
        </div>

        <div className="grid gap-8">
          <AnimatePresence mode="wait">
            {activeTab === 'catalog' && (
              <motion.div key="catalog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-black uppercase tracking-widest">Protocolos Activos</h2>
                  <div className="flex gap-4">
                    <button
                      onClick={() => exportToCSV(catalog, "AURA_Catalogo")}
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
                      Descarga el archivo de baremos para calibrar la precisión estadística del sistema.
                      Aura utiliza estos parámetros para el cálculo de percentiles y desviaciones estándar.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <button
                      onClick={downloadNormsTemplate}
                      className="px-8 py-4 bg-white text-[#080A0F] font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-white/5"
                    >
                      <FileSpreadsheet className="w-5 h-5" /> Bajar Baremos (.CSV)
                    </button>
                    <button className="px-8 py-4 border border-white/10 bg-white/5 text-white/60 font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                      <Upload className="w-5 h-5" /> Cargar Actualización
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] space-y-4">
                    <div className="flex items-center gap-2 text-[#00F3FF]">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Validación de Esquema</span>
                    </div>
                    <h3 className="text-lg font-bold">Estado del Motor de Normalización</h3>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-[10px] text-white/30 uppercase font-bold">Base Normativa</span>
                      <span className="text-[10px] text-[#00F3FF] font-mono">LATAM_GENERAL_N1500</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-[10px] text-white/30 uppercase font-bold">Última Sincro</span>
                      <span className="text-[10px] font-mono text-white/60">24/02/2025</span>
                    </div>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] space-y-4">
                    <div className="flex items-center gap-2 text-[#7B2CBF]">
                      <Globe className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Referencia Global</span>
                    </div>
                    <h3 className="text-lg font-bold">Distribución Gaussiana Aplicada</h3>
                    <p className="text-[10px] text-white/30 leading-relaxed uppercase tracking-widest">
                      El sistema mapea los resultados brutos (Raw Scores) a un rango de 0-150 utilizando una media tipificada de 100 y una desviación estándar de 15.
                    </p>
                  </div>
                </div>
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
                      <div key={i} className="flex justify-between py-2 border-b border-white/5 text-white/50">
                        <span>[{ev.timestamp}] SUJETO: {ev.user}</span>
                        <span className="text-[#00F3FF]">PROCESADO_OK</span>
                      </div>
                    ))}
                    {evaluations.length === 0 && <div className="text-center py-12 text-white/10 italic">Esperando primeras evaluaciones...</div>}
                  </div>
                </div>
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
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#080A0F]/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl bg-[#11141D] border border-white/10 rounded-[40px] p-8 md:p-10 my-8 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-[#00F3FF]/10 text-[#00F3FF]">
                    <Settings2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-widest">Configurar Protocolo</h2>
                    <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Aura Core // Engine Management</p>
                  </div>
                </div>
                <button type="button" onClick={() => setEditingTest(null)} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white/30 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-10">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-[32px] bg-white/[0.02] border border-white/5">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#00F3FF]">Nombre del Protocolo</label>
                    <input
                      value={editingTest.title}
                      onChange={e => setEditingTest({ ...editingTest, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#00F3FF] transition-all font-bold placeholder:text-white/10"
                      placeholder="Ej: Evaluación de Resiliencia..."
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#00F3FF]">Motor de Ejecución</label>
                    <CustomSelect
                      value={editingTest.type}
                      options={[
                        { value: 'mfc', label: 'MFC (Psicometría)' },
                        { value: 'bart', label: 'BART (Riesgo)' },
                        { value: 'gonogo', label: 'Go/No-Go (Impulso)' },
                        { value: 'stroop', label: 'Stroop (Atención)' },
                        { value: 'likert', label: 'Likert (Autoinforme)' }
                      ]}
                      onChange={val => setEditingTest({ ...editingTest, type: val as any, config: val === 'likert' ? { questions: [], scaleSize: 5 } : {} })}
                    />
                  </div>
                </div>

                {/* Logic Editor */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40">Configuración Específica</h3>
                    {editingTest.type === 'likert' && (
                      <div className="px-3 py-1 rounded-full bg-[#00F3FF]/10 border border-[#00F3FF]/20 text-[9px] font-black text-[#00F3FF] uppercase tracking-widest">Editor Visual Activo</div>
                    )}
                  </div>

                  {editingTest.type === 'likert' ? (
                    <div className="space-y-8 p-8 rounded-[32px] bg-white/[0.03] border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-widest">Dimensiones del Likert</p>
                          <p className="text-[9px] text-white/20 uppercase">Ajuste de escala de respuesta (1 - N)</p>
                        </div>
                        <div className="flex items-center gap-4">
                          {[3, 5, 7].map(n => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setEditingTest({ ...editingTest, config: { ...editingTest.config, scaleSize: n } })}
                              className={`w-10 h-10 rounded-xl border font-black transition-all ${editingTest.config.scaleSize === n ? 'bg-[#00F3FF] text-[#080A0F] border-[#00F3FF]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-4">Reactivos / Preguntas</label>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                          {(editingTest.config.questions || []).map((q: any, idx: number) => (
                            <div key={idx} className="grid grid-cols-12 gap-3 group">
                              <div className="col-span-1 flex items-center justify-center text-[10px] font-mono text-white/20">{idx + 1}</div>
                              <input
                                className="col-span-7 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#00F3FF] transition-all"
                                placeholder="Texto de la pregunta..."
                                value={q.text}
                                onChange={e => {
                                  const qs = [...editingTest.config.questions];
                                  qs[idx] = { ...qs[idx], text: e.target.value };
                                  setEditingTest({ ...editingTest, config: { ...editingTest.config, questions: qs } });
                                }}
                              />
                              <div className="col-span-3">
                                <CustomSelect
                                  value={q.trait}
                                  options={[
                                    { value: 'Lógica', label: 'Lógica' },
                                    { value: 'Empatía', label: 'Empatía' },
                                    { value: 'Foco', label: 'Foco' },
                                    { value: 'Social', label: 'Social' },
                                    { value: 'Resiliencia', label: 'Resiliencia' },
                                    { value: 'Creatividad', label: 'Creatividad' }
                                  ]}
                                  onChange={val => {
                                    const qs = [...editingTest.config.questions];
                                    qs[idx] = { ...qs[idx], trait: val };
                                    setEditingTest({ ...editingTest, config: { ...editingTest.config, questions: qs } });
                                  }}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const qs = editingTest.config.questions.filter((_: any, i: number) => i !== idx);
                                  setEditingTest({ ...editingTest, config: { ...editingTest.config, questions: qs } });
                                }}
                                className="col-span-1 flex items-center justify-center text-white/10 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const qs = [...(editingTest.config.questions || [])];
                            qs.push({ id: `q_${Date.now()}`, text: '', trait: 'Lógica' });
                            setEditingTest({ ...editingTest, config: { ...editingTest.config, questions: qs } });
                          }}
                          className="w-full py-4 mt-4 border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:bg-white/5 hover:border-[#00F3FF]/40 hover:text-[#00F3FF] transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Agregar Reactivo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <textarea
                        value={JSON.stringify(editingTest.config, null, 2)}
                        onChange={e => {
                          try { setEditingTest({ ...editingTest, config: JSON.parse(e.target.value) }); } catch { }
                        }}
                        rows={10}
                        className="w-full bg-black/40 border border-white/10 rounded-[32px] p-8 outline-none font-mono text-[11px] text-[#00F3FF] leading-relaxed focus:border-[#00F3FF] transition-all overflow-hidden"
                        placeholder="{ ... }"
                      />
                      <div className="flex items-center gap-3 px-6 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold italic">
                        <Terminal className="w-3 h-3" /> System Log: Raw JSON active for type {editingTest.type}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => handleSaveTest(e as any)}
                  className="w-full py-6 bg-[#00F3FF] text-[#080A0F] font-black rounded-[24px] uppercase tracking-[0.4em] text-xs flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-[0_20px_50px_rgba(0,243,255,0.2)]"
                >
                  <Save className="w-5 h-5" /> Enviar a Base de Datos de Baterías
                </button>
              </div>
            </motion.div>
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
    <td className="p-6 font-bold text-white/90">{alias} <br /><span className="text-[9px] text-white/20">{id}</span></td>
    <td className="p-6"><span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black">{rol}</span></td>
    <td className="p-6 font-mono text-[#00F3FF] text-[10px]">{level}</td>
    <td className="p-6">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)] shadow-yellow-500/50'}`}></div>
        <span className={`text-[10px] font-bold ${status === 'Active' ? 'text-green-500' : 'text-yellow-500'}`}>{status}</span>
      </div>
    </td>
    <td className="p-6 text-white/20 group-hover:text-[#00F3FF] transition-all cursor-pointer">
      <Settings2 className="w-4 h-4" />
    </td>
  </tr>
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
