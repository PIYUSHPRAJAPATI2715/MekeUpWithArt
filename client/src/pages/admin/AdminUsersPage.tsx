import React, { useState, useEffect } from 'react';
import { userApi } from '../../api';
import { IUser } from '../../types';
import { useToast } from '../../components/common/Toast';
import { Search, UserCheck, UserX, Shield } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { showToast } = useToast();

  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAll({ search });
      if (res.data.success) setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-salon-border/60 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-salon-cream">Customer Accounts</h1>
          <p className="text-xs text-salon-muted">View registered salon customers & manage active status</p>
        </div>
      </div>

      <div className="rounded-2xl glass-panel border border-salon-gold/20 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-salon-dark/80 text-salon-gold uppercase font-bold text-[10px] tracking-wider border-b border-salon-border">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-salon-border/40 text-salon-cream">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-salon-muted animate-pulse">Loading users...</td>
              </tr>
            ) : (
              users.map((u: any) => (
                <tr key={u._id} className="hover:bg-salon-card/50 transition-colors">
                  <td className="p-4 font-bold flex items-center gap-3">
                    <img
                      src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=D4AF37&color=0B0B0E`}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <span>{u.name}</span>
                  </td>
                  <td className="p-4">{u.phone}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-salon-gold/15 text-salon-gold font-bold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${u.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {u.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {u.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleToggleStatus(u._id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${u.isActive ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-black'}`}
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
    </div>
  );
};
