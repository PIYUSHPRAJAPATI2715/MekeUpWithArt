import React, { useState, useEffect } from 'react';
import { galleryApi } from '../../api';
import { IGalleryItem } from '../../types';
import { useToast } from '../../components/common/Toast';
import { AIImageGeneratorModal } from '../../components/common/AIImageGeneratorModal';
import { Plus, Trash2, Wand2 } from 'lucide-react';

export const AdminGalleryPage: React.FC = () => {
  const { showToast } = useToast();

  const [items, setItems] = useState<IGalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hair');
  const [imageUrl, setImageUrl] = useState('');

  // AI Generator Modal
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await galleryApi.getAll();
      if (res.data.success) setItems(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      showToast('Title and Image URL are required', 'error');
      return;
    }
    try {
      await galleryApi.create({ title, category, imageUrl });
      showToast('Gallery image added', 'success');
      setModalOpen(false);
      setTitle('');
      setImageUrl('');
      fetchGallery();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to add item', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this gallery item?')) return;
    try {
      await galleryApi.delete(id);
      showToast('Gallery item deleted', 'info');
      fetchGallery();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete item', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-salon-border/60 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-salon-cream">Gallery Manager</h1>
          <p className="text-xs text-salon-muted">Upload and generate AI images for customer transformation gallery</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-salon-gold text-salon-dark text-xs font-bold shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Gallery Image
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-16 text-center text-xs text-salon-muted animate-pulse">Loading gallery...</div>
        ) : (
          items.map((item) => (
            <div key={item._id} className="relative h-64 rounded-2xl overflow-hidden glass-panel border border-salon-gold/20 group">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-between">
                <span className="self-start px-2.5 py-0.5 rounded-full bg-salon-dark/80 text-salon-gold font-bold text-[10px] uppercase">
                  {item.category}
                </span>

                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-salon-cream text-sm">{item.title}</h4>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
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
            <h3 className="font-serif text-xl font-bold text-salon-cream">Add Gallery Photo</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Couture Hair Transformation"
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-salon-muted mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                >
                  <option value="Hair">Hair</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Skin">Skin</option>
                  <option value="Nails">Nails</option>
                  <option value="Eyelash">Eyelash</option>
                  <option value="Salon">Salon</option>
                  <option value="Bridal">Bridal</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block uppercase font-bold text-salon-gold mb-1">Image URL & AI Generator</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
                  />
                  <button
                    type="button"
                    onClick={() => setAiModalOpen(true)}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-salon-gold text-salon-dark font-bold shrink-0 text-[10px]"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    AI IMAGE
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-salon-muted">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-salon-gold text-salon-dark font-bold">
                  Save Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Modal */}
      <AIImageGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        category={category}
        defaultPrompt={`Luxury ${title || category} salon transformation photography`}
        onSelectImage={(url) => setImageUrl(url)}
      />
    </div>
  );
};
