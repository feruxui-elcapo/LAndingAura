
import React from 'react';
import { Menu } from 'lucide-react';

interface NavbarProps {
  scrolled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#080A0F]/90 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <span className="text-xl font-bold tracking-tighter text-white uppercase tracking-[0.2em]">PROYECTO AURA</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
          <a href="#" className="hover:text-[#00F3FF] transition-colors">Tecnología</a>
          <a href="#" className="hover:text-[#00F3FF] transition-colors">Visualización</a>
          <a href="#" className="hover:text-[#00F3FF] transition-colors">Seguridad</a>
          <button className="px-5 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all">
            Acceso
          </button>
        </div>

        <button className="md:hidden text-white/70">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};
