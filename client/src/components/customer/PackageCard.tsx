import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, Sparkles, Tag } from 'lucide-react';
import { IPackage } from '../../types';

interface PackageCardProps {
  pkg: IPackage;
  onBookNow: (pkg: IPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg, onBookNow }) => {
  const savings = pkg.originalPrice - pkg.discountPrice;

  return (
    <div className="group relative rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col h-full border border-salon-gold/25 shadow-xl">
      {/* Popular / Featured Banner */}
      {pkg.featured && (
        <div className="absolute top-0 right-0 z-10 px-4 py-1 rounded-bl-xl bg-gradient-to-r from-salon-gold-dark to-salon-gold text-salon-dark text-[10px] font-extrabold tracking-widest uppercase">
          EXCLUSIVE OFFER
        </div>
      )}

      {/* Image Header */}
      <div className="relative h-56 overflow-hidden bg-salon-dark">
        <img
          src={pkg.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-salon-card via-black/30 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-salon-dark/80 backdrop-blur-md border border-salon-gold/40 text-[11px] font-bold text-salon-gold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {pkg.duration} Mins Total
          </span>

          {savings > 0 && (
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-salon-dark text-[11px] font-extrabold flex items-center gap-1">
              <Tag className="w-3 h-3" />
              SAVE ₹{savings}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-3">
          <Link
            to={`/packages/${pkg.slug}`}
            className="font-serif text-xl font-bold text-salon-cream hover:text-salon-gold transition-colors block line-clamp-1"
          >
            {pkg.name}
          </Link>
          <p className="text-xs text-salon-muted leading-relaxed line-clamp-2">
            {pkg.description}
          </p>

          {/* Key Inclusions */}
          {pkg.benefits && pkg.benefits.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] uppercase tracking-wider text-salon-gold font-bold block">
                Package Inclusions:
              </span>
              <div className="space-y-1">
                {pkg.benefits.slice(0, 3).map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-salon-cream/90">
                    <CheckCircle2 className="w-3.5 h-3.5 text-salon-gold shrink-0" />
                    <span className="line-clamp-1">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-salon-border/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-salon-muted uppercase block">Bundle Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-salon-muted line-through">₹{pkg.originalPrice}</span>
              <span className="text-2xl font-extrabold text-gold-gradient">₹{pkg.discountPrice}</span>
            </div>
          </div>

          <button
            onClick={() => onBookNow(pkg)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-bold shadow-lg shadow-salon-gold/20 hover:scale-105 transition-transform"
          >
            <Sparkles className="w-4 h-4 fill-salon-dark" />
            BOOK PACKAGE
          </button>
        </div>
      </div>
    </div>
  );
};
