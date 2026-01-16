
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';

const generateGaussData = () => {
  const data = [];
  const mean = 50;
  const stdDev = 12;
  for (let x = 0; x <= 100; x += 1) {
    const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
    const y = Math.exp(exponent);
    data.push({ x, y });
  }
  return data;
};

export const DataVisuals: React.FC = () => {
  const data = useMemo(() => generateGaussData(), []);

  return (
    <section className="py-20 md:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto bg-white/[0.03] border border-white/5 rounded-[32px] md:rounded-[48px] p-6 md:p-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7B2CBF]/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center relative z-10">
          <div>
            <div className="text-[#00F3FF] font-black uppercase tracking-[0.4em] text-[10px] md:text-xs mb-6">Tu perfil visual</div>
            <h2 className="text-3xl md:text-6xl font-bold mb-6 md:mb-8 leading-tight tracking-tight">Mirá cómo <br />funciona tu mente.</h2>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-8 md:mb-10">
              Cambiamos los tests aburridos por un mapa visual dinámico. Identificá dónde estás parado hoy y hacia dónde podés crecer con total precisión.
            </p>
            
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/5 border border-white/10">
                <div className="text-3xl md:text-4xl font-black text-[#00F3FF] mb-2">100%</div>
                <div className="text-[9px] md:text-xs text-white/40 uppercase tracking-widest font-bold">Visual</div>
              </div>
              <div className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/5 border border-white/10">
                <div className="text-3xl md:text-4xl font-black text-[#7B2CBF] mb-2">Preciso</div>
                <div className="text-[9px] md:text-xs text-white/40 uppercase tracking-widest font-bold">Protocolo</div>
              </div>
            </div>
          </div>

          <div className="h-[300px] md:h-[500px] w-full bg-[#080A0F]/80 rounded-[32px] md:rounded-[40px] border border-white/10 p-4 md:p-8 shadow-2xl relative group overflow-hidden">
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00F3FF] animate-pulse"></div>
                <span className="text-[8px] md:text-[10px] text-white/40 font-mono uppercase tracking-[0.2em]">Live Simulation...</span>
            </div>
            
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 60, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="neonCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F3FF" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#00F3FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="x" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#080A0F', borderColor: '#00F3FF', borderRadius: '16px', border: '1px solid rgba(0, 243, 255, 0.3)' }}
                  itemStyle={{ color: '#00F3FF', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="y" 
                  stroke="#00F3FF" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#neonCyan)" 
                  animationDuration={4000}
                />
                <ReferenceLine 
                  x={75} 
                  stroke="#7B2CBF" 
                  strokeWidth={3} 
                  strokeDasharray="8 8" 
                  label={{ position: 'top', value: 'TU MAPA', fill: '#7B2CBF', fontSize: 12, fontWeight: '900', letterSpacing: '0.1em' }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
