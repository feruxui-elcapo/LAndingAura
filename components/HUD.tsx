
import React from 'react';
import { User, Globe, Activity } from 'lucide-react';

export const HUD: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#00F3FF] to-[#7B2CBF] flex items-center justify-center font-black text-[#080A0F] text-[10px]">A</div>
            <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase hidden sm:block">Nucleus Core</span>
          </div>
          
          <div className="flex items-center gap-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-[9px] font-bold uppercase tracking-widest text-white/40">
            <div className="flex items-center gap-2 text-[#00F3FF]">
                <Globe className="w-3 h-3" />
                <span className="hidden md:inline">Node: Latin_South_1</span>
            </div>
            <div className="w-[1px] h-3 bg-white/10"></div>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00F3FF] animate-pulse"></div>
                <span className="hidden md:inline">Sync: 100%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
              <div className="text-[9px] font-bold uppercase tracking-widest">Alex Explorer</div>
              <div className="text-[8px] text-[#00F3FF] font-mono opacity-50">AUTH_VERIFIED</div>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 border border-white/20 p-1">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#00F3FF]/20 to-[#7B2CBF]/20 flex items-center justify-center">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-[#00F3FF]" />
              </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
