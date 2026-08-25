import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Mail, Lock, User, Phone, Sparkles } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useToast } from '../../components/common/Toast';

export const SignupPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await register(name, email, phone, password);
      if (data.success) {
        showToast('Account created successfully!', 'success');
        navigate('/profile');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create account', 'error');
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
          <h2 className="font-serif text-3xl font-bold text-salon-cream">Create Account</h2>
          <p className="text-xs text-salon-muted">
            Join MAKEUP WITH ART for exclusive offers & online booking
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
              />
              <User className="w-4 h-4 text-salon-muted absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
              />
              <Mail className="w-4 h-4 text-salon-muted absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider mb-1">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9829012345"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
              />
              <Phone className="w-4 h-4 text-salon-muted absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
              />
              <Lock className="w-4 h-4 text-salon-muted absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
              />
              <Lock className="w-4 h-4 text-salon-muted absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-salon-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-salon-dark" />
            {isSubmitting ? 'CREATING...' : 'CREATE MY ACCOUNT'}
          </button>
        </form>

        <div className="text-center text-xs text-salon-muted pt-4 border-t border-salon-border">
          Already have an account?{' '}
          <Link to="/login" className="text-salon-gold font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
