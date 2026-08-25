import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, ShieldCheck, Lock, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useToast } from '../../components/common/Toast';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@makeupwithart.com');
  const [password, setPassword] = useState('Admin@123456');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await login(email, password);
      if (data.success) {
        if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
          showToast('Welcome to Admin Portal', 'success');
          navigate('/admin/dashboard');
        } else {
          showToast('Access denied: Customer account detected', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Invalid admin credentials', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-salon-dark flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md p-8 rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-salon-gold-dark via-salon-gold to-salon-gold-light flex items-center justify-center text-salon-dark font-bold mx-auto shadow-xl shadow-salon-gold/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-salon-cream">Admin Portal</h2>
          <p className="text-xs text-salon-muted">
            MAKEUP WITH ART Business Administration
          </p>
        </div>

        <div className="p-3 rounded-xl bg-salon-gold/10 border border-salon-gold/20 text-xs text-salon-gold font-medium space-y-1">
          <p className="font-bold">Default Seed Credentials:</p>
          <p>Email: admin@makeupwithart.com</p>
          <p>Password: Admin@123456</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold text-salon-muted mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
              />
              <Mail className="w-4 h-4 text-salon-muted absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-salon-muted mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
              />
              <Lock className="w-4 h-4 text-salon-muted absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-salon-gold/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-salon-dark" />
            {isSubmitting ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
          </button>
        </form>
      </div>
    </div>
  );
};
