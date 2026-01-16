
import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-24 border-t border-white/5 bg-[#080A0F]/50 relative z-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl font-bold tracking-tighter text-white uppercase tracking-[0.2em]">PROYECTO AURA</span>
            </div>
            <p className="text-white/40 max-w-sm mb-10 text-lg leading-relaxed">
              Damos claridad a la mente humana. Transformamos datos complejos en mapas visuales para el autoconocimiento y la gestión de talento.
            </p>
            <div className="flex gap-5">
              <a href="#" className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-[#00F3FF] transition-all border border-white/5"><Twitter className="w-6 h-6" /></a>
              <a href="#" className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-[#00F3FF] transition-all border border-white/5"><Github className="w-6 h-6" /></a>
              <a href="#" className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-[#00F3FF] transition-all border border-white/5"><Linkedin className="w-6 h-6" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#00F3FF] mb-8">Explorar</h4>
            <ul className="space-y-5 text-white/40 text-base font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Personal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Profesional</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Empresas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tecnología</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#7B2CBF] mb-8">Compañía</h4>
            <ul className="space-y-5 text-white/40 text-base font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Soporte</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">
          <span>© 2025 PROYECTO AURA. Todos los derechos reservados.</span>
          <div className="flex gap-10">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#00F3FF] rounded-full animate-pulse shadow-[0_0_8px_#00F3FF]"></div> Sistema Online</span>
            <span>v2.0 Beta</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
