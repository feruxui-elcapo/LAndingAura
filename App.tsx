
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { RolesSection } from './components/RolesSection';
import { DataVisuals } from './components/DataVisuals';
import { Navbar } from './components/Navbar';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { ScrollPhrase } from './components/ScrollPhrase';
import { Airlock } from './components/Airlock';
import { IdentityCore } from './components/IdentityCore';
import { EvaluationEngine } from './components/EvaluationEngine';
import { NexusPanel } from './components/NexusPanel';
import { ProfessionalPanel } from './components/ProfessionalPanel';
import { CorporatePanel } from './components/CorporatePanel';
import { SystemBottomNav } from './components/SystemBottomNav';
import LiquidEther from './components/LiquidEther';

export type UserRole = 'explorer' | 'professional' | 'corporate' | 'architect';
export type ViewState = 'landing' | 'airlock' | 'interface' | 'evaluation' | 'nexus' | 'pro_dash' | 'corp_dash';

export interface BiometricPoint {
  subject: string;
  A: number;
  fullMark: number;
  ideal?: number;
}

export interface TestDefinition {
  id: string;
  type: 'mfc' | 'stroop' | 'bart' | 'gonogo' | 'likert';
  title: string;
  description: string;
  config: any;
  color: string;
}

const DEFAULT_TESTS: TestDefinition[] = [
  {
    id: 'cognitive',
    type: 'mfc',
    title: 'Motor A: MFC',
    description: 'Jerarquía de personalidad ipsativa.',
    color: '#00F3FF',
    config: {
      triads: [
        {
          id: 1,
          options: [
            { id: 'a', label: 'Soy una persona extremadamente organizada y metódica', trait: 'Lógica' },
            { id: 'b', label: 'Tengo una facilidad natural para conectar con otros', trait: 'Social' },
            { id: 'c', label: 'Me apasiona explorar conceptos abstractos', trait: 'Creatividad' }
          ]
        },
        {
          id: 2,
          options: [
            { id: 'd', label: 'Mantengo la calma bajo altos niveles de estrés', trait: 'Resiliencia' },
            { id: 'e', label: 'Puedo mantener el foco por horas', trait: 'Foco' },
            { id: 'f', label: 'Priorizo la armonía del equipo', trait: 'Empatía' }
          ]
        }
      ]
    }
  },
  {
    id: 'attention',
    type: 'stroop',
    title: 'Motor B1: Stroop',
    description: 'Atención selectiva y control inhibitorio.',
    color: '#00F3FF',
    config: {}
  },
  {
    id: 'impulse',
    type: 'gonogo',
    title: 'Motor B2: Impulso',
    description: 'Inhibición motora Go/No-Go.',
    color: '#7B2CBF',
    config: { totalTrials: 10, goProbability: 0.7 }
  },
  {
    id: 'risk',
    type: 'bart',
    title: 'Motor C: Riesgo',
    description: 'Decisión bajo presión.',
    color: '#FF9FFC',
    config: { rounds: 3, maxPumps: 15 }
  },
  {
    id: 'self-report',
    type: 'likert',
    title: 'Motor D: Autoinforme',
    description: 'Percepción subjetiva de competencias.',
    color: '#FF9FFC',
    config: { questions: [], scaleSize: 5 }
  }
];

const DEFAULT_DATA: BiometricPoint[] = [
  { subject: 'Lógica', A: 70, fullMark: 150, ideal: 130 },
  { subject: 'Empatía', A: 70, fullMark: 150, ideal: 110 },
  { subject: 'Creatividad', A: 70, fullMark: 150, ideal: 140 },
  { subject: 'Social', A: 70, fullMark: 150, ideal: 100 },
  { subject: 'Resiliencia', A: 70, fullMark: 150, ideal: 120 },
  { subject: 'Foco', A: 70, fullMark: 150, ideal: 125 },
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [role, setRole] = useState<UserRole>('explorer');
  const [testCatalog, setTestCatalog] = useState<TestDefinition[]>(() => {
    const saved = localStorage.getItem('aura_catalog');
    if (!saved) return DEFAULT_TESTS;

    const parsedSaved = JSON.parse(saved) as TestDefinition[];
    // Merge missing default tests into saved catalog
    const merged = [...parsedSaved];
    DEFAULT_TESTS.forEach(def => {
      if (!merged.find(t => t.id === def.id)) {
        merged.push(def);
      }
    });
    return merged;
  });
  const [evaluations, setEvaluations] = useState<any[]>(() => {
    const saved = localStorage.getItem('aura_evals');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [biometricData, setBiometricData] = useState<BiometricPoint[]>(DEFAULT_DATA);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  useEffect(() => {
    localStorage.setItem('aura_catalog', JSON.stringify(testCatalog));
  }, [testCatalog]);

  useEffect(() => {
    localStorage.setItem('aura_evals', JSON.stringify(evaluations));
  }, [evaluations]);

  const handleStartAuth = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setView('airlock'), 300);
  };

  const handleLoginSuccess = (selectedRole: UserRole) => {
    setRole(selectedRole);
    switch (selectedRole) {
      case 'architect': setView('nexus'); break;
      case 'professional': setView('pro_dash'); break;
      case 'corporate': setView('corp_dash'); break;
      default: setView('interface');
    }
  };

  const handleLogout = () => {
    setView('landing');
    setIsAnalyzed(false);
    setBiometricData(DEFAULT_DATA);
  };

  const handleEvaluationComplete = (results: BiometricPoint[]) => {
    setEvaluations(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      results,
      user: 'Explorer_Alpha',
      role: role
    }]);
    setBiometricData(results);
    setIsAnalyzed(true);
    setView('interface');
  };

  const isSystemView = ['interface', 'evaluation', 'nexus', 'pro_dash', 'corp_dash'].includes(view);
  const showBackground = view === 'landing' || view === 'airlock';

  return (
    <div className="min-h-screen bg-[#080A0F] text-white selection:bg-[#00F3FF]/30 overflow-x-hidden font-['Plus_Jakarta_Sans']">
      <AnimatePresence>
        {showBackground && (
          <motion.div
            key="ether-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 pointer-events-none z-0"
          >
            <LiquidEther colors={['#00F3FF', '#7B2CBF', '#080A0F']} autoSpeed={0.2} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Navbar scrolled={false} onStart={handleStartAuth} />
            <main className="relative z-10">
              <Hero onStart={handleStartAuth} />
              <ScrollPhrase />
              <Features />
              <DataVisuals />
              <RolesSection onStart={handleStartAuth} />
              <CTA onStart={handleStartAuth} />
            </main>
            <Footer />
          </motion.div>
        )}

        {view === 'airlock' && (
          <motion.div key="airlock" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Airlock onBack={() => setView('landing')} onSuccess={handleLoginSuccess} />
          </motion.div>
        )}

        {view === 'interface' && (
          <motion.div key="interface" className="relative z-20">
            <IdentityCore
              role={role}
              onLogout={handleLogout}
              onStartEvaluation={(id) => { setActiveModule(id); setView('evaluation'); }}
              data={biometricData}
              isAnalyzed={isAnalyzed}
              onNexus={() => setView('nexus')}
              catalog={testCatalog}
            />
          </motion.div>
        )}

        {view === 'nexus' && (
          <NexusPanel
            key="nexus"
            onBack={() => setView('interface')}
            onLogout={handleLogout}
            catalog={testCatalog}
            setCatalog={setTestCatalog}
            evaluations={evaluations}
          />
        )}

        {view === 'pro_dash' && <ProfessionalPanel key="pro" onBack={() => setView('interface')} onLogout={handleLogout} />}
        {view === 'corp_dash' && <CorporatePanel key="corp" onBack={() => setView('interface')} onLogout={handleLogout} evaluations={evaluations} />}

        {view === 'evaluation' && (
          <motion.div key="evaluation" className="relative z-40">
            <EvaluationEngine
              testDef={testCatalog.find(t => t.id === activeModule) || testCatalog[0]}
              onComplete={handleEvaluationComplete}
              onCancel={() => setView('interface')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSystemView && (
          <SystemBottomNav
            activeView={view}
            setView={setView}
            onLogout={handleLogout}
            role={role}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
