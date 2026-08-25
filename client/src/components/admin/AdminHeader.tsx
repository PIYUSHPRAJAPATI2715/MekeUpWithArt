import React from 'react';
import { Menu, ShieldCheck, Bell } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export const AdminHeader: React.FC<{ onMenuToggle: () => void }> = ({ onMenuToggle }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-[1000] bg-salon-dark/90 backdrop-blur-md border-b border-salon-border/60 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl bg-salon-card border border-salon-border text-salon-cream lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="font-serif text-lg font-bold text-salon-cream hidden sm:block">
            MAKEUP WITH ART Admin Portal
          </h2>
          <p className="text-[10px] text-salon-gold font-semibold uppercase tracking-wider">
            Live Business Management Dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-salon-card border border-salon-gold/30">
          <ShieldCheck className="w-4 h-4 text-salon-gold" />
          <span className="text-xs font-bold text-salon-cream">{user?.name || 'Admin'}</span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-salon-gold/20 text-salon-gold font-bold uppercase">
            {user?.role}
          </span>
        </div>
      </div>
    </header>
  );
};
