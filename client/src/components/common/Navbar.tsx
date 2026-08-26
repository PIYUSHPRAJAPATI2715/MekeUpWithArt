import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scissors,
  Bell,
  User as UserIcon,
  LogOut,
  Calendar,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { notificationApi } from '../../api';
import { INotification } from '../../types';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch notifications if user is logged in
  const loadNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationApi.getMy();
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [isAuthenticated, location.pathname]);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Packages', path: '/packages' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        isScrolled
          ? 'bg-salon-dark/90 backdrop-blur-md border-b border-salon-gold/20 py-3 shadow-xl'
          : 'bg-gradient-to-b from-salon-dark/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="MAKEUP WITH ART"
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-full border border-salon-gold/50 shadow-lg group-hover:scale-105 transition-transform bg-salon-dark p-0.5"
          />
          <div>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-gold-gradient uppercase block">
              MAKEUP WITH ART
            </span>
            <span className="text-[9px] tracking-[0.2em] text-salon-muted uppercase block font-sans">
              PREMIUM UNISEX SALON
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-salon-card/40 px-4 py-1.5 rounded-full border border-salon-border/60 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-salon-gold text-salon-dark font-bold shadow-md shadow-salon-gold/20'
                    : 'text-salon-cream/80 hover:text-salon-gold hover:bg-salon-dark/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Actions & CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Notification Bell (If Auth) */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserDropdownOpen(false);
                }}
                className="relative p-2.5 rounded-xl bg-salon-card/80 border border-salon-border text-salon-cream hover:text-salon-gold hover:border-salon-gold/40 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-salon-gold text-salon-dark font-bold text-[10px] flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 p-4 rounded-2xl glass-panel border border-salon-gold/30 shadow-2xl z-[1010]"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-salon-border">
                      <h4 className="text-xs font-bold text-salon-cream uppercase tracking-wider">
                        Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-salon-gold hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-salon-muted text-center py-6">No notifications yet.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            className={`p-2.5 rounded-xl border text-xs transition-colors ${
                              n.isRead
                                ? 'bg-salon-dark/40 border-salon-border/40 text-salon-muted'
                                : 'bg-salon-card border-salon-gold/30 text-salon-cream'
                            }`}
                          >
                            <p className="font-semibold text-salon-gold text-[12px]">{n.title}</p>
                            <p className="mt-0.5 leading-relaxed">{n.message}</p>
                            <span className="text-[9px] text-salon-muted mt-1 block">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User Account / Login */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-salon-card/80 border border-salon-border hover:border-salon-gold/40 transition-all"
              >
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=D4AF37&color=0B0B0E`
                  }
                  alt={user?.name}
                  className="w-7 h-7 rounded-full object-cover border border-salon-gold/50"
                />
                <span className="text-xs font-semibold text-salon-cream truncate max-w-[100px]">
                  {user?.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-salon-muted" />
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 p-2 rounded-2xl glass-panel border border-salon-gold/30 shadow-2xl z-[1010]"
                  >
                    <div className="p-3 mb-2 rounded-xl bg-salon-dark/60 border border-salon-border">
                      <p className="text-xs font-bold text-salon-cream truncate">{user?.name}</p>
                      <p className="text-[10px] text-salon-muted truncate">{user?.email}</p>
                    </div>

                    <div className="space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-salon-cream/90 hover:bg-salon-gold/10 hover:text-salon-gold transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-salon-gold" />
                        My Profile
                      </Link>

                      <Link
                        to="/profile?tab=bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-salon-cream/90 hover:bg-salon-gold/10 hover:text-salon-gold transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-salon-gold" />
                        My Bookings
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-salon-gold bg-salon-gold/10 border border-salon-gold/20 hover:bg-salon-gold hover:text-salon-dark transition-all"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-salon-cream/90 hover:text-salon-gold transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Book Appointment CTA */}
          <Link
            to="/services"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-bold shadow-lg shadow-salon-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 fill-salon-dark" />
            BOOK APPOINTMENT
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <Link
            to="/services"
            className="px-3.5 py-1.5 rounded-lg bg-salon-gold text-salon-dark text-xs font-bold"
          >
            BOOK NOW
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-salon-card border border-salon-border text-salon-cream hover:text-salon-gold transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-salon-dark/95 backdrop-blur-xl border-b border-salon-gold/20 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-salon-cream hover:bg-salon-gold/10 hover:text-salon-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="pt-4 border-t border-salon-border space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-salon-card border border-salon-border">
                      <img
                        src={user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.name}
                        alt={user?.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-salon-cream">{user?.name}</p>
                        <p className="text-[10px] text-salon-muted">{user?.email}</p>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center px-4 py-2.5 rounded-xl text-xs font-bold bg-salon-card border border-salon-border text-salon-cream"
                    >
                      My Account & Bookings
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-center px-4 py-2.5 rounded-xl text-xs font-bold bg-salon-gold text-salon-dark"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center px-4 py-2.5 rounded-xl text-xs font-bold bg-salon-card border border-salon-border text-salon-cream"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center px-4 py-2.5 rounded-xl text-xs font-bold bg-salon-gold text-salon-dark"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
