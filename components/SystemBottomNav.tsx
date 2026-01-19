
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Database, LogOut, Users, Building2, User } from 'lucide-react';
import { ViewState, UserRole } from '../App';

interface SystemBottomNavProps {
  activeView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
  role: UserRole;
}

// Define NavItem interface to fix type errors regarding optional 'action' property
interface NavItem {
  id: string;
  label: string;
  icon: any;
  action?: () => void;
}

export const SystemBottomNav: React.FC<SystemBottomNavProps> = ({ activeView, setView, onLogout, role }) => {
  
  const getNavItems = (): NavItem[] => {
    const common: NavItem[] = [{ id: 'interface', label: 'Mi Core', icon: User }];
    
    switch(role) {
      case 'architect': 
        return [...common, { id: 'nexus', label: 'El Nexo', icon: Database }];
      case 'professional':
        return [...common, { id: 'pro_dash', label: 'Pacientes', icon: Users }];
      case 'corporate':
        return [...common, { id: 'corp_dash', label: 'Empresa', icon: Building2 }];
      default:
        return common;
    }
  };

  const navItems: NavItem[] = [...getNavItems(), { id: 'logout', label: 'Cerrar', icon: LogOut, action: onLogout }];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center p-4 md:p-8 pointer-events-none">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="flex items-center gap-1 md:gap-2 px-3 py-2 bg-[#080A0F]/80 backdrop-blur-3xl border border-white/10 rounded-[40px] pointer-events-auto shadow-2xl shadow-black/50"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            // Use the action property if it exists, otherwise use setView
            onClick={() => item.action ? item.action() : setView(item.id as ViewState)}
            className="relative flex flex-col items-center justify-center min-w-[70px] md:min-w-[100px] h-12 md:h-16 group outline-none"
          >
            <AnimatePresence>
              {activeView === item.id && (
                <motion.div 
                  layoutId="activePill"
                  className="absolute inset-x-2 md:inset-x-4 h-8 md:h-10 bg-[#00F3FF]/10 rounded-full z-0 border border-[#00F3FF]/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </AnimatePresence>
            
            <item.icon className={`w-5 h-5 md:w-6 md:h-6 relative z-10 transition-colors duration-300 ${activeView === item.id ? 'text-[#00F3FF] drop-shadow-[0_0_8px_#00F3FF]' : 'text-white/30 group-hover:text-white/60'}`} />
            
            <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] relative z-10 mt-1 transition-colors duration-300 ${activeView === item.id ? 'text-[#00F3FF]' : 'text-white/20'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </motion.nav>
    </div>
  );
};
