import React from 'react';
import { GalleryGrid } from '../../components/customer/GalleryGrid';
import { Sparkles } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-salon-gold inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 fill-salon-gold" />
          Real Client Transformations
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-salon-cream">
          Salon Gallery & Artistry
        </h1>
        <p className="text-sm text-salon-muted">
          Browse through our portfolio of bridal makeups, balayage hair colors, gel nail art extensions & hydra skin glows.
        </p>
      </div>

      <GalleryGrid />
    </div>
  );
};
