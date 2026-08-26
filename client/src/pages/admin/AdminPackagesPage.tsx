import React, { useState, useEffect } from 'react';
import { packageApi, serviceApi } from '../../api';
import { IPackage, IService } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { useToast } from '../../components/common/Toast';
import { AIImageGeneratorModal } from '../../components/common/AIImageGeneratorModal';
import { Plus, Edit2, Trash2, Wand2, Package as PackageIcon } from 'lucide-react';

export const AdminPackagesPage: React.FC = () => {
  const { showToast } = useToast();

  const [packages, setPackages] = useState<IPackage[]>([]);
  const [servicesList, setServicesList] = useState<IService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<IPackage | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [originalPrice, setOriginalPrice] = useState<number>(5000);
  const [discountPrice, setDiscountPrice] = useState<number>(3999);
  const [duration, setDuration] = useState<number>(180);
  const [validityDays, setValidityDays] = useState<number>(30);
  const [benefitsInput, setBenefitsInput] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [featured, setFeatured] = useState<boolean>(false);

  // AI Modal
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resPkg, resSvc] = await Promise.all([
        packageApi.getAll({ status: 'Active', _t: Date.now() }),
        serviceApi.getAll({ status: 'Active', _t: Date.now() }),
      ]);
      if (resPkg.data.success) setPackages(resPkg.data.data);
      if (resSvc.data.success) setServicesList(resSvc.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingPackage(null);
    setName('');
    setDescription('');
    setSelectedServices([]);
    setOriginalPrice(10000);
    setDiscountPrice(7999);
    setDuration(240);
    setValidityDays(30);
    setBenefitsInput('VIP Private Bridal Suite, Complimentary Sample Kit');
    setImage('https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80');
    setStatus('Active');
    setFeatured(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: IPackage) => {
    setEditingPackage(p);
    setName(p.name);
    setDescription(p.description);
    setSelectedServices(p.servicesIncluded ? p.servicesIncluded.map((s: any) => s._id || s) : []);
    setOriginalPrice(p.originalPrice);
    setDiscountPrice(p.discountPrice);
    setDuration(p.duration);
    setValidityDays(p.validityDays || 30);
    setBenefitsInput(p.benefits ? p.benefits.join(', ') : '');
    setImage(p.image);
    setStatus(p.status);
    setFeatured(p.featured);
    setModalOpen(true);
  };

  const handleToggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const benefitsArr = benefitsInput.split(',').map((b) => b.trim()).filter(Boolean);

    const payload = {
      name,
      description,
      servicesIncluded: selectedServices,
      originalPrice: Number(originalPrice),
      discountPrice: Number(discountPrice),
      duration: Number(duration),
      validityDays: Number(validityDays),
      benefits: benefitsArr,
      image,
      status,
      featured,
    };

    try {
      if (editingPackage) {
        await packageApi.update(editingPackage._id, payload);
        showToast('Package updated successfully', 'success');
      } else {
        await packageApi.create(payload);
        showToast('Package created successfully', 'success');
      }
      setModalOpen(false);
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save package', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await packageApi.delete(id);
      showToast('Package deleted', 'info');
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete package', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-salon-border/60 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-salon-cream">Package Offers</h1>
          <p className="text-xs text-salon-muted">Manage bundled salon packages & DALL-E AI visuals</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-salon-gold text-salon-dark text-xs font-bold shadow-lg hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          Create Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs text-salon-muted animate-pulse">
            Loading packages...
          </div>
        ) : (
          packages.map((pkg) => (
            <div
              key={pkg._id}
              className="p-5 rounded-2xl glass-panel border border-salon-gold/20 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <img
                  src={pkg.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80'}
                  alt={pkg.name}
                  className="w-full h-40 object-cover rounded-xl border border-salon-border"
                />
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-salon-cream text-base">{pkg.name}</h3>
                  <StatusBadge status={pkg.status} />
                </div>
                <p className="text-xs text-salon-muted line-clamp-2">{pkg.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-salon-muted line-through">₹{pkg.originalPrice}</span>
                  <span className="text-lg font-extrabold text-salon-gold">₹{pkg.discountPrice}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-salon-border">
                <button
                  onClick={() => handleOpenEdit(pkg)}
                  className="p-2 rounded-lg bg-salon-dark border text-salon-cream hover:text-salon-gold"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Package Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl p-6 rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-salon-border">
              <h3 className="font-serif text-xl font-bold text-salon-cream">
                {editingPackage ? 'Edit Package' : 'Create New Package'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-salon-muted">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream resize-none"
                />
              </div>

              {/* Select Included Services */}
              <div className="space-y-1">
                <label className="block uppercase font-bold text-salon-gold mb-1">
                  Select Included Database Services
                </label>
                <div className="max-h-36 overflow-y-auto p-3 rounded-xl bg-salon-dark/80 border border-salon-border grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {servicesList.map((svc) => (
                    <label key={svc._id} className="flex items-center gap-2 cursor-pointer text-xs text-salon-cream">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(svc._id)}
                        onChange={() => handleToggleService(svc._id)}
                      />
                      <span className="truncate">{svc.name} (₹{svc.price})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-salon-muted mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(Number(e.target.value))}
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

              {/* Image & AI Generation */}
              <div className="space-y-1">
                <label className="block uppercase font-bold text-salon-gold mb-1">Package Visual & AI Generator</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                  />
                  <button
                    type="button"
                    onClick={() => setAiModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-salon-gold-dark to-salon-gold text-salon-dark text-xs font-bold shrink-0"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    GENERATE AI IMAGE
                  </button>
                </div>
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
                  <span>Active Package</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                  <span>Featured Package</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-salon-border">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-salon-muted">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-salon-gold text-salon-dark font-bold">
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Image Generator Modal */}
      <AIImageGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        category="Bridal"
        defaultPrompt={`Luxury pamper package photography for ${name || 'salon package'}`}
        onSelectImage={(url) => setImage(url)}
      />
    </div>
  );
};
