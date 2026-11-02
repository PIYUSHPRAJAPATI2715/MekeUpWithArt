import React, { useState, useEffect } from 'react';
import { userApi, authApi } from '../../api';
import { IUser } from '../../types';
import { useToast } from '../../components/common/Toast';
import {
  Search,
  UserCheck,
  UserX,
  Shield,
  Plus,
  MessageCircle,
  Phone,
  Mail,
  RefreshCw,
  UserPlus,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { showToast } = useToast();

  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  // Add Customer Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Customer@123');
  const [role, setRole] = useState<'CUSTOMER' | 'ADMIN'>('CUSTOMER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAll({ search });
      if (res.data.success) setUsers(res.data.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await userApi.toggleStatus(id);
      if (res.data.success) {
        showToast(res.data.message, 'success');
        fetchUsers();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update user status', 'error');
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Customer Name and Phone number are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      let res;
      try {
        res = await userApi.create({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          password: password.trim() || undefined,
          role,
        });
      } catch (err: any) {
        // Fallback to authApi.register if server is still restarting/deploying
        if (err.response?.status === 404) {
          const cleanPhone = phone.replace(/\D/g, '');
          const customerEmail = email.trim() || `client_${cleanPhone}@makeupwithart.local`;
          res = await authApi.register({
            name: name.trim(),
            phone: cleanPhone,
            email: customerEmail,
            password: password.trim() || 'Customer@123',
          });
        } else {
          throw err;
        }
      }

      if (res?.data?.success) {
        showToast('New customer added successfully!', 'success');
        setModalOpen(false);
        setName('');
        setPhone('');
        setEmail('');
        setPassword('Customer@123');
        fetchUsers();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create customer', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-salon-border/60 pb-4 gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-salon-cream flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-salon-gold" />
            Customer & Client Accounts
          </h1>
          <p className="text-xs text-salon-muted">
            Manage registered clients, add walk-in customer profiles, or toggle account access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="p-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream hover:border-salon-gold text-xs transition-all"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4 text-salon-gold" />
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-salon-gold hover:bg-salon-gold/90 text-salon-dark font-bold text-xs uppercase tracking-wider shadow-lg shadow-salon-gold/20 transition-all hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-salon-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or email..."
          className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-salon-card/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-salon-gold text-salon-dark text-xs font-bold"
        >
          Search
        </button>
      </form>

      {/* Users Table */}
      <div className="rounded-2xl glass-panel border border-salon-gold/20 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-salon-dark/80 text-salon-gold uppercase font-bold text-[10px] tracking-wider border-b border-salon-border">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Phone & WhatsApp</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-salon-border/40 text-salon-cream">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-salon-muted animate-pulse">
                  Loading client list...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-salon-muted">
                  No customers found. Click "Add Customer" to register your first client profile!
                </td>
              </tr>
            ) : (
              users.map((u: any) => (
                <tr key={u._id} className="hover:bg-salon-card/50 transition-colors">
                  <td className="p-4 font-bold flex items-center gap-3">
                    <img
                      src={
                        u.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=D4AF37&color=0B0B0E`
                      }
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover border border-salon-gold/40"
                    />
                    <span>{u.name}</span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-salon-cream">{u.phone || 'No phone'}</span>
                      {u.phone && (
                        <a
                          href={`https://wa.me/91${u.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                            u.name
                          )}%2C%20greetings%20from%20MAKEUP%20WITH%20ART!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-salon-muted">{u.email}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        u.role === 'SUPER_ADMIN'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : u.role === 'ADMIN'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-salon-gold/15 text-salon-gold border border-salon-gold/20'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        u.isActive
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    {u.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleToggleStatus(u._id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          u.isActive
                            ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white'
                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black'
                        }`}
                      >
                        {u.isActive ? 'Disable Account' : 'Enable Account'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Customer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md p-6 rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-salon-border">
              <h3 className="font-serif text-lg font-bold text-salon-cream flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-salon-gold" />
                Add New Customer
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-salon-dark text-salon-muted hover:text-salon-cream"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pooja Khandelwal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">
                  Phone Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9352769045"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream font-mono focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. pooja@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">
                  Default Login Password
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream font-mono focus:outline-none focus:border-salon-gold"
                />
                <span className="text-[10px] text-salon-muted block mt-1">
                  Client can use this password or phone login.
                </span>
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">
                  User Role
                </label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream focus:outline-none focus:border-salon-gold"
                >
                  <option value="CUSTOMER">Customer / Client</option>
                  <option value="ADMIN">Salon Admin</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-salon-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-salon-dark text-salon-muted hover:text-salon-cream font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-salon-gold hover:bg-salon-gold/90 text-salon-dark font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
