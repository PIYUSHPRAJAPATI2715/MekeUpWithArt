import React, { useState, useEffect } from 'react';
import { serviceApi } from '../../api';
import { IService } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';
import { AIImageGeneratorModal } from '../../components/common/AIImageGeneratorModal';
import { Plus, Edit2, Trash2, Wand2, Sparkles, Image as ImageIcon, Check } from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const { showToast } = useToast();

  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<IService | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Bridal Makeup');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState<number>(500);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [duration, setDuration] = useState<number>(45);
  const [benefitsInput, setBenefitsInput] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [featured, setFeatured] = useState<boolean>(false);

  // AI Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await serviceApi.getAll({ status: 'All', _t: Date.now() });
      if (res.data.success) setServices(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingService(null);
    setName('');
    setCategory('Hair');
    setDescription('');
    setShortDescription('');
    setPrice(799);
    setDiscountPrice(649);
    setDuration(45);
    setBenefitsInput('Scalp cleanse, Hair repair blow dry');
    setImageUrl('https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80');
    setStatus('Active');
    setFeatured(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (s: IService) => {
    setEditingService(s);
    setName(s.name);
    setCategory(s.category);
    setDescription(s.description);
    setShortDescription(s.shortDescription);
    setPrice(s.price);
    setDiscountPrice(s.discountPrice);
    setDuration(s.duration);
    setBenefitsInput(s.benefits ? s.benefits.join(', ') : '');
    setImageUrl(s.images && s.images[0] ? s.images[0] : '');
    setStatus(s.status);
    setFeatured(s.featured);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const benefitsArr = benefitsInput.split(',').map((b) => b.trim()).filter(Boolean);

    const payload = {
      name,
      category,
      description,
      shortDescription,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      duration: Number(duration),
      benefits: benefitsArr,
      images: imageUrl ? [imageUrl] : [],
      status,
      featured,
    };

    try {
      if (editingService) {
        await serviceApi.update(editingService._id, payload);
        showToast('Service updated successfully', 'success');
      } else {
        await serviceApi.create(payload);
        showToast('Service created successfully', 'success');
      }
      setModalOpen(false);
      fetchServices();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save service', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await serviceApi.delete(id);
      showToast('Service deleted', 'info');
      fetchServices();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete service', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-salon-border/60 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-salon-cream">Service Catalogue</h1>
          <p className="text-xs text-salon-muted">Manage salon services, pricing & DALL-E AI image generation</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-salon-gold text-salon-dark text-xs font-bold shadow-lg hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          Create New Service
        </button>
      </div>

      {/* Services Table */}
      <div className="rounded-2xl glass-panel border border-salon-gold/20 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-salon-dark/80 text-salon-gold uppercase font-bold text-[10px] tracking-wider border-b border-salon-border">
            <tr>
              <th className="p-4">Visual</th>
              <th className="p-4">Service Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price / Discount</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-salon-border/40 text-salon-cream">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-salon-muted animate-pulse">Loading services...</td>
              </tr>
            ) : services.map((s) => (
              <tr key={s._id} className="hover:bg-salon-card/50 transition-colors">
                <td className="p-4">
                  <img
                    src={s.images && s.images[0] ? s.images[0] : 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=200&q=80'}
                    alt={s.name}
                    className="w-12 h-12 rounded-xl object-cover border border-salon-border"
                  />
                </td>
                <td className="p-4">
                  <p className="font-bold text-salon-cream text-sm">{s.name}</p>
                  <p className="text-[10px] text-salon-muted line-clamp-1">{s.shortDescription}</p>
                </td>
                <td className="p-4 font-semibold text-salon-gold">{s.category}</td>
                <td className="p-4 font-bold">
                  ₹{s.discountPrice || s.price}
                  {s.discountPrice && <span className="text-[10px] text-salon-muted line-through ml-1">₹{s.price}</span>}
                </td>
                <td className="p-4">{s.duration} mins</td>
                <td className="p-4">
                  <StatusBadge status={s.status} />
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-1.5 rounded-lg bg-salon-dark border border-salon-border text-salon-cream hover:text-salon-gold"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Service Drawer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl p-6 rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-salon-border">
              <h3 className="font-serif text-xl font-bold text-salon-cream">
                {editingService ? 'Edit Service' : 'Create New Service'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-salon-muted hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">Service Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                  >
                    <option value="Bridal Makeup">Bridal Makeup</option>
                    <option value="Groom Makeup">Groom Makeup</option>
                    <option value="Hair Art">Hair Art</option>
                    <option value="Nail Art">Nail Art</option>
                    <option value="Skin">Skin</option>
                    <option value="Eyelashes">Eyelashes</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Full Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={discountPrice || ''}
                    onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                  />
                </div>
              </div>

              {/* Image Input + AI Generation Trigger */}
              <div className="space-y-1.5">
                <label className="block uppercase font-bold text-salon-gold mb-1">
                  Service Image URL & AI Generator
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                  />
                  <button
                    type="button"
                    onClick={() => setAiModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-salon-gold-dark to-salon-gold text-salon-dark text-xs font-bold shrink-0 shadow-md"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    GENERATE AI IMAGE
                  </button>
                </div>
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="w-20 h-20 rounded-xl object-cover border mt-2" />
                )}
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Benefits (Comma Separated)</label>
                <input
                  type="text"
                  value={benefitsInput}
                  onChange={(e) => setBenefitsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={status === 'Active'}
                    onChange={(e) => setStatus(e.target.checked ? 'Active' : 'Inactive')}
                  />
                  <span>Active Service</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                  <span>Featured on Home Page</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-salon-border">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-salon-muted">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-salon-gold text-salon-dark font-bold">
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DALL-E AI Image Generator Modal */}
      <AIImageGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        category={category}
        defaultPrompt={`Luxury ${name || category} styling for Indian salon client`}
        onSelectImage={(url) => setImageUrl(url)}
      />
    </div>
  );
};
