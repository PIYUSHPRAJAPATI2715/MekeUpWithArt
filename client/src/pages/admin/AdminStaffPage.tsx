import React, { useState, useEffect } from 'react';
import { staffApi } from '../../api';
import { IStaff } from '../../types';
import { useToast } from '../../components/common/Toast';
import { Plus, Edit2, Trash2, UserCheck } from 'lucide-react';

export const AdminStaffPage: React.FC = () => {
  const { showToast } = useToast();

  const [staffList, setStaffList] = useState<IStaff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await staffApi.getAllAdmin();
      if (res.data.success) setStaffList(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await staffApi.create({
        name,
        photo: photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        designation,
        bio,
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      });
      showToast('Staff member added successfully', 'success');
      setModalOpen(false);
      setName('');
      setDesignation('');
      setBio('');
      fetchStaff();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to add staff', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete staff member?')) return;
    try {
      await staffApi.delete(id);
      showToast('Staff member removed', 'info');
      fetchStaff();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to remove staff', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-salon-border/60 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-salon-cream">Staff Roster</h1>
          <p className="text-xs text-salon-muted">Manage artists, cosmetologists & stylists</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-salon-gold text-salon-dark text-xs font-bold shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs text-salon-muted animate-pulse">Loading staff...</div>
        ) : (
          staffList.map((s) => (
            <div key={s._id} className="p-5 rounded-2xl glass-panel border border-salon-gold/20 flex items-start gap-4">
              <img
                src={s.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}`}
                alt={s.name}
                className="w-16 h-16 rounded-xl object-cover border border-salon-border shrink-0"
              />
              <div className="flex-1 space-y-1">
                <h4 className="font-serif font-bold text-salon-cream text-base">{s.name}</h4>
                <p className="text-xs font-semibold text-salon-gold">{s.designation}</p>
                <p className="text-[11px] text-salon-muted line-clamp-2">{s.bio}</p>

                <div className="pt-3 flex justify-end">
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md p-6 rounded-3xl glass-panel border border-salon-gold/30 space-y-4">
            <h3 className="font-serif text-xl font-bold text-salon-cream">Add Staff Member</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Master Hair Artist"
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Photo URL</label>
                <input
                  type="text"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-salon-muted">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-salon-gold text-salon-dark font-bold">
                  Save Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
