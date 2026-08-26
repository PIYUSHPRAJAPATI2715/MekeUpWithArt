import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Scissors,
  Package,
  Users,
  UserCheck,
  Image as ImageIcon,
  MessageSquareQuote,
  Bell,
  Mail,
  Clock,
  Settings,
  History,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export const AdminSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Services', path: '/admin/services', icon: Scissors },
    { name: 'Packages', path: '/admin/packages', icon: Package },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Staff', path: '/admin/staff', icon: UserCheck },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Inquiries', path: '/admin/messages', icon: Mail },
    { name: 'Working Hours', path: '/admin/working-hours', icon: Clock },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: History },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[1005] bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[1010] w-64 bg-salon-dark/95 backdrop-blur-xl border-r border-salon-border/60 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
      <div className="p-5 space-y-6 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 pb-4 border-b border-salon-border/60">
          <img
            src="/logo.png"
            alt="MWA ADMIN"
            className="w-9 h-9 object-contain rounded-full border border-salon-gold/50 bg-salon-dark p-0.5"
          />
          <div>
            <h3 className="font-serif text-sm font-bold text-salon-cream uppercase tracking-wider">
              MWA ADMIN
            </h3>
            <span className="text-[10px] text-salon-gold uppercase font-semibold">
              Salon SaaS Platform
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-salon-gold text-salon-dark font-bold shadow-md shadow-salon-gold/20'
                    : 'text-salon-cream/80 hover:bg-salon-card hover:text-salon-gold'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-5 border-t border-salon-border/60 space-y-3">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-center gap-2 py-2 rounded-xl bg-salon-card text-salon-gold text-xs font-bold border border-salon-gold/20 hover:bg-salon-gold hover:text-salon-dark transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Live Website ↗
        </Link>

        <button
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Admin Logout</span>
        </button>
      </div>
    </aside>
    </>
  );
};
