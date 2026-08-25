import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scissors, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useToast } from '../../components/common/Toast';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await login(email, password);
      if (data.success) {
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
          navigate('/admin/dashboard');
        } else {
          const from = (location.state as any)?.from?.pathname || '/profile';
          navigate(from);
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 relative">
      <div className="w-full max-w-md space-y-8 p-8 rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-salon-gold-dark via-salon-gold to-salon-gold-light flex items-center justify-center text-salon-dark font-bold mx-auto shadow-lg shadow-salon-gold/20">
            <Scissors className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-salon-cream">Sign In</h2>
          <p className="text-xs text-salon-muted">
            Access your MAKEUP WITH ART account & bookings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold transition-colors"
              />
              <Mail className="w-4 h-4 text-salon-muted absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider">
                Password
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent if account exists', 'info'); }} className="text-[11px] text-salon-gold hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold transition-colors"
              />
              <Lock className="w-4 h-4 text-salon-muted absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-salon-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-salon-dark" />
            {isSubmitting ? 'SIGNING IN...' : 'LOG IN TO ACCOUNT'}
          </button>
        </form>

        <div className="text-center text-xs text-salon-muted pt-4 border-t border-salon-border">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-salon-gold font-bold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};
