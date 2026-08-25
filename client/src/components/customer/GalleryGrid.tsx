import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryApi } from '../../api';
import { IGalleryItem } from '../../types';
import { Sparkles } from 'lucide-react';

export const GalleryGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [items, setItems] = useState<IGalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const categories = ['All', 'Hair', 'Makeup', 'Skin', 'Nails', 'Eyelash', 'Salon', 'Bridal'];

  useEffect(() => {
    setLoading(true);
    galleryApi
      .getAll(activeCategory)
      .then((res) => {
        if (res.data.success) {
          setItems(res.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-salon-gold text-salon-dark shadow-lg shadow-salon-gold/20'
                : 'bg-salon-card/80 border border-salon-border text-salon-cream/80 hover:border-salon-gold/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-salon-card/40 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-xs text-salon-muted">
          No gallery images available for this category yet.
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative h-72 rounded-2xl overflow-hidden glass-panel border border-salon-gold/20"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-salon-gold">
                    {item.category}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-salon-cream">{item.title}</h4>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
