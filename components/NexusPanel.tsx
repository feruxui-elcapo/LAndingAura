
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
  const [calculatorScore, setCalculatorScore] = useState<string>('75');
  const [selectedNormForCalc, setSelectedNormForCalc] = useState<any>(null);
  const [isUploadingNorms, setIsUploadingNorms] = useState(false);
  const [uploadMetadata, setUploadMetadata] = useState({ testId: '', country: 'AR', year: '2025' });

  // Norms Data State
  const [norms, setNorms] = useState([
    { id: 1, test: 'MFC', pais: 'AR', año: 2025, sexo: 'M', p10: 45, p25: 60, p50: 75, p75: 90, p90: 110, p95: 120, detalle: 'Media normal central' },
    { id: 2, test: 'MFC', pais: 'AR', año: 2025, sexo: 'F', p10: 48, p25: 62, p50: 78, p75: 92, p90: 112, p95: 122, detalle: 'Desviación leve superior' },
    { id: 3, test: 'BART', pais: 'CL', año: 2024, sexo: 'M', p10: 30, p25: 45, p50: 60, p75: 75, p90: 95, p95: 105, detalle: 'Tolerancia al riesgo base' },
  ]);

  // Research Filters
  const [researchFilters, setResearchFilters] = useState({
    sex: 'all',
    ageMin: '',
    ageMax: '',
    country: 'all',
    province: 'all',
    testId: 'all'
  });

  // Norms Filters
  const [normsFilters, setNormsFilters] = useState({
    testId: 'all',
    year: 'all', // 'last5' or specific range
    country: 'all'
  });

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

  const handleUploadNorms = (e: React.FormEvent) => {
    e.preventDefault();
    const newNormsData = [
      { id: Date.now(), test: catalog.find(t => t.id === uploadMetadata.testId)?.title || 'MFC', pais: uploadMetadata.country, año: parseInt(uploadMetadata.year), sexo: 'M', p10: 42, p25: 58, p50: 72, p75: 88, p90: 108, p95: 118, detalle: 'Batch Normalizado (M)' },
      { id: Date.now() + 1, test: catalog.find(t => t.id === uploadMetadata.testId)?.title || 'MFC', pais: uploadMetadata.country, año: parseInt(uploadMetadata.year), sexo: 'F', p10: 45, p25: 61, p50: 76, p75: 91, p90: 111, p95: 121, detalle: 'Batch Normalizado (F)' }
    ];
    setNorms(prev => [...prev, ...newNormsData]);
    setIsUploadingNorms(false);
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

                  {/* Norms Filters */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 grid grid-cols-3 gap-4 w-full md:w-auto min-w-[400px]">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase tracking-widest text-white/30">Test</label>
                      <CustomSelect
                        value={normsFilters.testId}
                        options={[
                          { value: 'all', label: 'Todos' },
                          ...catalog.map(t => ({ value: t.id, label: t.title }))
                        ]}
                        onChange={(val) => setNormsFilters({ ...normsFilters, testId: val })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase tracking-widest text-white/30">Año</label>
                      <CustomSelect
                        value={normsFilters.year}
                        options={[
                          { value: 'all', label: 'Todos' },
                          { value: 'last5', label: 'Últimos 5 años' },
                          { value: '2025', label: '2025' },
                          { value: '2024', label: '2024' },
                          { value: '2023', label: '2023' }
                        ]}
                        onChange={(val) => setNormsFilters({ ...normsFilters, year: val })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase tracking-widest text-white/30">País</label>
                      <CustomSelect
                        value={normsFilters.country}
                        options={[
                          { value: 'all', label: 'Todos' },
                          { value: 'ar', label: 'Argentina' },
                          { value: 'cl', label: 'Chile' },
                          { value: 'mx', label: 'México' },
                          { value: 'es', label: 'España' }
                        ]}
                        onChange={(val) => setNormsFilters({ ...normsFilters, country: val })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <button
                      onClick={downloadNormsTemplate}
                      className="px-8 py-4 bg-white text-[#080A0F] font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-white/5"
                    >
                      <FileSpreadsheet className="w-5 h-5" /> Bajar Baremos (.CSV)
                    </button>
                    <button
                      onClick={() => setIsUploadingNorms(true)}
                      className="px-8 py-4 border border-white/10 bg-white/5 text-white/60 font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all font-bold"
                    >
                      <Upload className="w-5 h-5" /> Cargar Actualización
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] space-y-4">
                    <div className="flex items-center gap-2 text-[#00F3FF]">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Estado de Referencia</span>
                    </div>
                    <h3 className="text-lg font-bold">Base de Normalización</h3>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-[10px] text-white/30 uppercase font-bold">Población Base</span>
                      <span className="text-[10px] text-[#00F3FF] font-mono">LATAM_G_N1500</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-white/5">
                      <span className="text-[10px] text-white/30 uppercase font-bold">Última Actualización</span>
                      <span className="text-[10px] font-mono text-white/60">24/01/2026</span>
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

                {/* Exploración de Baremos */}
                <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-8 space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-widest">Exploración de Baremos</h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Detalle por Percentil y Sexo</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[10px] uppercase tracking-widest">
                      <thead className="bg-white/5 text-white/40 font-bold border-b border-white/10">
                        <tr>
                          <th className="p-4">Test</th>
                          <th className="p-4">País</th>
                          <th className="p-4">Sexo</th>
                          <th className="p-4">P10</th>
                          <th className="p-4">P25</th>
                          <th className="p-4 text-[#00F3FF]">P50</th>
                          <th className="p-4">P75</th>
                          <th className="p-4">P90</th>
                          <th className="p-4">Detalle</th>
                          <th className="p-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {norms.filter(norm => {
                          const matchesTest = normsFilters.testId === 'all' || norm.test === catalog.find(t => t.id === normsFilters.testId)?.title || norm.test === normsFilters.testId;
                          const matchesCountry = normsFilters.country === 'all' || norm.pais.toLowerCase() === normsFilters.country.toLowerCase();
                          // Simulación de filtro por año (en el mock solo hay 2024 y 2025)
                          const matchesYear = normsFilters.year === 'all' || (normsFilters.year === 'last5' && norm.año >= 2020) || norm.año.toString() === normsFilters.year;
                          return matchesTest && matchesCountry && matchesYear;
                        }).map(norm => (
                          <tr key={norm.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold">{norm.test}</td>
                            <td className="p-4">{norm.pais}</td>
                            <td className="p-4 font-bold text-[#7B2CBF]">{norm.sexo}</td>
                            <td className="p-4 text-white/40">{norm.p10}</td>
                            <td className="p-4 text-white/40">{norm.p25}</td>
                            <td className="p-4 font-black text-[#00F3FF] bg-[#00F3FF]/5">{norm.p50}</td>
                            <td className="p-4 text-white/40">{norm.p75}</td>
                            <td className="p-4 text-white/40">{norm.p90}</td>
                            <td className="p-4 text-[9px] lowercase italic">{norm.detalle}</td>
                            <td className="p-4">
                              <button
                                onClick={() => setSelectedNormForCalc(norm)}
                                className="px-3 py-1 bg-white/5 hover:bg-[#00F3FF]/20 border border-white/10 rounded-lg text-[9px] font-black transition-all"
                              >
                                Calcular Gauss
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Gauss Calculator Integration */}
                  {selectedNormForCalc && (
                    <div className="mt-12 p-8 bg-gradient-to-r from-[#00F3FF]/10 to-transparent border border-[#00F3FF]/20 rounded-[32px] grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-center gap-2 text-[#00F3FF] mb-4">
                          <BarChart3 className="w-5 h-5" />
                          <span className="text-xs font-black uppercase tracking-[0.3em]">Calculadora de Posicionamiento</span>
                        </div>
                        <h4 className="text-2xl font-black uppercase mb-2">Puntaje &rarr; Percentil</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-6">
                          Ingresa un puntaje bruto para ver su ubicación en la curva normal basada en el baremo de {selectedNormForCalc.test} ({selectedNormForCalc.pais} - {selectedNormForCalc.sexo}).
                        </p>

                        <div className="flex gap-4 mb-8">
                          <div className="flex-1">
                            <label className="text-[9px] font-black text-white/20 uppercase block mb-2">Puntaje Bruto</label>
                            <input
                              type="number"
                              value={calculatorScore}
                              onChange={(e) => setCalculatorScore(e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xl font-black text-[#00F3FF] outline-none focus:border-[#00F3FF]"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-[9px] font-black text-white/20 uppercase block mb-2">Percentil Estimado</label>
                            <div className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xl font-black text-white/40">
                              {(() => {
                                const score = parseInt(calculatorScore);
                                if (score >= selectedNormForCalc.p95) return '95+';
                                if (score >= selectedNormForCalc.p90) return '90';
                                if (score >= selectedNormForCalc.p75) return '75';
                                if (score >= selectedNormForCalc.p50) return '50';
                                if (score >= selectedNormForCalc.p25) return '25';
                                if (score >= selectedNormForCalc.p10) return '10';
                                return '<10';
                              })()}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              // Esto abriría el componente GaussianAnalysis ya existente si lo tuviéramos integrado
                              // Pero aquí solo lo simulamos o mostramos el detalle
                            }}
                            className="flex-1 py-4 bg-[#00F3FF] text-[#080A0F] font-black rounded-xl uppercase text-[10px] tracking-widest shadow-xl shadow-[#00F3FF]/10"
                          >
                            Graficar Distribución Completa
                          </button>
                          <button
                            onClick={() => setSelectedNormForCalc(null)}
                            className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white/40 rounded-xl uppercase text-[10px] font-black"
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>

                      <div className="relative h-64 bg-black/40 rounded-[24px] border border-white/5 overflow-hidden p-4">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          <BarChart3 className="w-32 h-32 text-[#00F3FF]" />
                        </div>
                        {/* Aquí integraríamos GaussianAnalysis o un SVG similar */}
                        <div className="relative z-10 h-full flex flex-col justify-end">
                          <div className="flex items-end justify-between gap-1 h-32">
                            {[0.1, 0.2, 0.4, 0.7, 1, 0.7, 0.4, 0.2, 0.1].map((h, i) => (
                              <div key={i} className="flex-1 bg-[#00F3FF]/20 rounded-t-sm" style={{ height: `${h * 100}%` }}></div>
                            ))}
                          </div>
                          <div className="mt-4 flex justify-between text-[8px] font-black text-white/20 uppercase">
                            <span>P10</span>
                            <span>P25</span>
                            <span className="text-[#00F3FF]">P50</span>
                            <span>P75</span>
                            <span>P90</span>
                          </div>
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#FF9FFC]/40 flex items-center" style={{ top: `${100 - (Math.min(parseInt(calculatorScore), 150) / 150) * 100}%` }}>
                            <div className="px-2 py-0.5 bg-[#FF9FFC] text-[#080A0F] text-[8px] font-black rounded-full ml-[50%] -translate-x-1/2">TU SCORE: {calculatorScore}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'research' && (
              <motion.div key="research" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-black uppercase tracking-widest">Panel de Investigación</h2>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        const filtered = evaluations.filter(ev => {
                          const matchesSex = researchFilters.sex === 'all' || ev.sex === researchFilters.sex;
                          const matchesCountry = researchFilters.country === 'all' || ev.country === researchFilters.country;
                          const matchesProvince = researchFilters.province === 'all' || ev.province?.toLowerCase().includes(researchFilters.province.toLowerCase());
                          const matchesTest = researchFilters.testId === 'all' || ev.testId === researchFilters.testId;
                          const age = parseInt(ev.age);
                          const matchesAgeMin = !researchFilters.ageMin || age >= parseInt(researchFilters.ageMin);
                          const matchesAgeMax = !researchFilters.ageMax || age <= parseInt(researchFilters.ageMax);
                          return matchesSex && matchesCountry && matchesProvince && matchesTest && matchesAgeMin && matchesAgeMax;
                        });
                        exportToCSV(filtered, "AURA_Research_Data_Filtered");
                      }}
                      disabled={evaluations.length === 0}
                      className="px-4 py-2 border border-[#7B2CBF] text-[#7B2CBF] rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:bg-[#7B2CBF] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <Download className="w-3 h-3" /> Exportar Filtrados
                    </button>
                    <button
                      onClick={() => exportToCSV(evaluations, "AURA_Research_Data")}
                      disabled={evaluations.length === 0}
                      className="px-4 py-2 bg-[#7B2CBF] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:bg-[#8e44ad] disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <Download className="w-3 h-3" /> Descargar Todo (.CSV)
                    </button>
                  </div>
                </div>

                {/* Research Filters */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Sexo</label>
                    <CustomSelect
                      value={researchFilters.sex}
                      options={[
                        { value: 'all', label: 'Todos' },
                        { value: 'm', label: 'Masculino' },
                        { value: 'f', label: 'Femenino' },
                        { value: 'nb', label: 'No Binario' }
                      ]}
                      onChange={(val) => setResearchFilters({ ...researchFilters, sex: val })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Edad (Desde)</label>
                    <input
                      type="number"
                      value={researchFilters.ageMin}
                      onChange={(e) => setResearchFilters({ ...researchFilters, ageMin: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] uppercase font-bold outline-none focus:border-[#00F3FF]"
                      placeholder="18"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Edad (Hasta)</label>
                    <input
                      type="number"
                      value={researchFilters.ageMax}
                      onChange={(e) => setResearchFilters({ ...researchFilters, ageMax: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] uppercase font-bold outline-none focus:border-[#00F3FF]"
                      placeholder="99"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">País</label>
                    <CustomSelect
                      value={researchFilters.country}
                      options={[
                        { value: 'all', label: 'Todos' },
                        { value: 'ar', label: 'Argentina' },
                        { value: 'cl', label: 'Chile' },
                        { value: 'mx', label: 'México' },
                        { value: 'es', label: 'España' }
                      ]}
                      onChange={(val) => setResearchFilters({ ...researchFilters, country: val })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Provincia</label>
                    <input
                      type="text"
                      value={researchFilters.province}
                      onChange={(e) => setResearchFilters({ ...researchFilters, province: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] uppercase font-bold outline-none focus:border-[#00F3FF]"
                      placeholder="Ej: Buenos Aires"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Test</label>
                    <CustomSelect
                      value={researchFilters.testId}
                      options={[
                        { value: 'all', label: 'Todos' },
                        ...catalog.map(t => ({ value: t.id, label: t.title }))
                      ]}
                      onChange={(val) => setResearchFilters({ ...researchFilters, testId: val })}
                    />
                  </div>
                </div>

                {(() => {
                  const filtered = evaluations.filter(ev => {
                    const matchesSex = researchFilters.sex === 'all' || ev.sex === researchFilters.sex;
                    const matchesCountry = researchFilters.country === 'all' || ev.country === researchFilters.country;
                    const matchesProvince = researchFilters.province === 'all' || ev.province?.toLowerCase().includes(researchFilters.province.toLowerCase() || '');
                    const matchesTest = researchFilters.testId === 'all' || ev.testId === researchFilters.testId;
                    const age = parseInt(ev.age || '0');
                    const matchesAgeMin = !researchFilters.ageMin || age >= parseInt(researchFilters.ageMin);
                    const matchesAgeMax = !researchFilters.ageMax || age <= parseInt(researchFilters.ageMax);
                    return matchesSex && matchesCountry && matchesProvince && matchesTest && matchesAgeMin && matchesAgeMax;
                  });

                  return (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <StatBox label="Evaluaciones Totales (Filtro)" value={filtered.length} color="#00F3FF" />
                        <StatBox label="Usuarios Únicos" value={new Set(filtered.map(e => e.user)).size} color="#7B2CBF" />
                      </div>

                      <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-8 text-white/30">Historial de Actividad (Filtro)</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-4 font-mono text-[10px]">
                          {filtered.map((ev, i) => (
                            <div key={i} className="flex justify-between py-2 border-b border-white/5 text-white/50">
                              <span>[{ev.timestamp}] USUARIO: {ev.user}</span>
                              <span className="text-[#00F3FF]">COMPLETADO</span>
                            </div>
                          ))}
                          {filtered.length === 0 && <div className="text-center py-12 text-white/10 italic">No hay evaluaciones que coincidan con los filtros...</div>}
                        </div>
                      </div>
                    </>
                  );
                })()}
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
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Tipo de Protocolo</label>
                  <CustomSelect
                    value={editingTest.type}
                    options={[
                      { value: 'mfc', label: 'MFC (Psicometría)' },
                      { value: 'stroop', label: 'Stroop (Atención)' },
                      { value: 'bart', label: 'BART (Riesgo)' },
                      { value: 'gonogo', label: 'Go/No-Go (Impulso)' },
                      { value: 'likert', label: 'Likert (Autoinforme)' }
                    ]}
                    onChange={(val) => setEditingTest({ ...editingTest, type: val as any })}
                  />
                </div>
              </div>

              {editingTest.type === 'likert' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Preguntas del Autoinforme</label>
                    <button
                      type="button"
                      onClick={() => {
                        const questions = editingTest.config.questions || [];
                        setEditingTest({
                          ...editingTest,
                          config: {
                            ...editingTest.config,
                            questions: [...questions, { id: `q${Date.now()}`, text: '', trait: 'Lógica' }]
                          }
                        });
                      }}
                      className="px-3 py-1 bg-[#00F3FF]/10 text-[#00F3FF] rounded-lg text-[9px] font-black uppercase flex items-center gap-1 hover:bg-[#00F3FF]/20 transition-all"
                    >
                      <Plus className="w-3 h-3" /> Agregar Pregunta
                    </button>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {(editingTest.config.questions || []).map((q: any, idx: number) => (
                      <div key={q.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-white/40 uppercase">Pregunta {idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const questions = editingTest.config.questions || [];
                              setEditingTest({
                                ...editingTest,
                                config: {
                                  ...editingTest.config,
                                  questions: questions.filter((_: any, i: number) => i !== idx)
                                }
                              });
                            }}
                            className="text-white/20 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          value={q.text}
                          onChange={e => {
                            const questions = [...(editingTest.config.questions || [])];
                            questions[idx] = { ...questions[idx], text: e.target.value };
                            setEditingTest({ ...editingTest, config: { ...editingTest.config, questions } });
                          }}
                          placeholder="Ej: Me siento cómodo liderando equipos..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#00F3FF]"
                        />
                        <CustomSelect
                          value={q.trait}
                          onChange={val => {
                            const questions = [...(editingTest.config.questions || [])];
                            questions[idx] = { ...questions[idx], trait: val };
                            setEditingTest({ ...editingTest, config: { ...editingTest.config, questions } });
                          }}
                          options={[
                            { value: 'Lógica', label: 'Lógica' },
                            { value: 'Empatía', label: 'Empatía' },
                            { value: 'Creatividad', label: 'Creatividad' },
                            { value: 'Social', label: 'Social' },
                            { value: 'Resiliencia', label: 'Resiliencia' },
                            { value: 'Foco', label: 'Foco' }
                          ]}
                        />
                      </div>
                    ))}
                    {(!editingTest.config.questions || editingTest.config.questions.length === 0) && (
                      <div className="text-center py-8 text-white/10 text-xs italic">
                        No hay preguntas. Haz clic en "Agregar Pregunta" para comenzar.
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Escala (1 a N)</label>
                      <input
                        type="number"
                        min="3"
                        max="10"
                        value={editingTest.config.scaleSize || 5}
                        onChange={e => setEditingTest({ ...editingTest, config: { ...editingTest.config, scaleSize: parseInt(e.target.value) } })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00F3FF]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Etiqueta Mínima</label>
                      <input
                        type="text"
                        value={editingTest.config.minLabel || 'Totalmente en Desacuerdo'}
                        onChange={e => setEditingTest({ ...editingTest, config: { ...editingTest.config, minLabel: e.target.value } })}
                        placeholder="Ej: Totalmente en Desacuerdo"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#00F3FF]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">Etiqueta Máxima</label>
                    <input
                      type="text"
                      value={editingTest.config.maxLabel || 'Totalmente de Acuerdo'}
                      onChange={e => setEditingTest({ ...editingTest, config: { ...editingTest.config, maxLabel: e.target.value } })}
                      placeholder="Ej: Totalmente de Acuerdo"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-[#00F3FF]"
                    />
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

              <button type="submit" className="w-full py-4 bg-[#00F3FF] text-[#080A0F] font-black rounded-2xl uppercase tracking-widest flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Guardar en Núcleo
              </button>
            </motion.form>
          </div>
        )}

        {isUploadingNorms && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#080A0F]/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-[#11141D] border border-white/10 rounded-[40px] p-8 md:p-10 my-8 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setIsUploadingNorms(false)}
                className="absolute top-8 right-8 p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-white/30 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 rounded-2xl bg-[#7B2CBF]/10 text-[#7B2CBF]">
                  <CloudUpload className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-widest">Cargar Baremos</h2>
                  <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Sincronización de Motor Estadístico</p>
                </div>
              </div>

              <form onSubmit={handleUploadNorms} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#7B2CBF]">Protocolo / Test</label>
                    <CustomSelect
                      value={uploadMetadata.testId}
                      options={catalog.map(t => ({ value: t.id, label: t.title }))}
                      onChange={(val) => setUploadMetadata({ ...uploadMetadata, testId: val })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#7B2CBF]">Año de Referencia</label>
                    <input
                      type="number"
                      value={uploadMetadata.year}
                      onChange={(e) => setUploadMetadata({ ...uploadMetadata, year: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 font-bold outline-none focus:border-[#7B2CBF] transition-all"
                      placeholder="2025"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#7B2CBF]">País / Región</label>
                    <CustomSelect
                      value={uploadMetadata.country}
                      options={[
                        { value: 'AR', label: 'Argentina' },
                        { value: 'CL', label: 'Chile' },
                        { value: 'MX', label: 'México' },
                        { value: 'ES', label: 'España' }
                      ]}
                      onChange={(val) => setUploadMetadata({ ...uploadMetadata, country: val })}
                    />
                  </div>
                </div>

                <div className="p-8 border-2 border-dashed border-white/5 rounded-[32px] bg-white/[0.02] flex flex-col items-center justify-center gap-4 group hover:border-[#7B2CBF]/40 transition-all cursor-pointer relative overflow-hidden">
                  <div className="p-4 rounded-full bg-white/5 text-white/20 group-hover:text-[#7B2CBF] transition-all relative z-10">
                    <FileSpreadsheet className="w-8 h-8" />
                  </div>
                  <div className="text-center relative z-10">
                    <p className="text-xs font-black uppercase tracking-widest mb-1 text-white/40">Arrastra tu CSV aquí</p>
                    <p className="text-[9px] text-white/10 uppercase font-bold">O haz clic para seleccionar archivo</p>
                  </div>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".csv" />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!uploadMetadata.testId}
                    className="w-full py-6 bg-[#7B2CBF] text-white font-black rounded-[24px] uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-[0_20px_50px_rgba(123,44,191,0.2)] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" /> Confirmar Registro de Datos
                  </button>
                </div>
              </form>
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
