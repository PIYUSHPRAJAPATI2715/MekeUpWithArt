import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Sparkles, ArrowRight } from 'lucide-react';
import { IService } from '../../types';

interface ServiceCardProps {
  service: IService;
  onBookNow: (service: IService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookNow }) => {
  return (
    <div className="group relative rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col h-full border border-salon-gold/15">
      {/* Image Banner */}
      <div className="relative h-52 overflow-hidden bg-salon-dark">
        <img
          src={
            service.images && service.images[0]
              ? service.images[0]
              : 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80'
          }
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-salon-card via-black/20 to-transparent" />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-salon-dark/80 backdrop-blur-md border border-salon-gold/30 text-[10px] font-bold text-salon-gold uppercase tracking-wider">
          {service.category}
        </span>

        {/* Discount Badge */}
        {service.discountPrice && service.price > service.discountPrice && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-salon-gold text-salon-dark text-[10px] font-extrabold uppercase tracking-wider">
            SAVE ₹{service.price - service.discountPrice}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link
            to={`/services/${service.slug}`}
            className="font-serif text-lg font-bold text-salon-cream hover:text-salon-gold transition-colors line-clamp-1"
          >
            {service.name}
          </Link>
          <p className="text-xs text-salon-muted leading-relaxed line-clamp-2">
            {service.shortDescription}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-3 border-t border-salon-border/60 text-xs">
          <div className="flex items-center gap-1.5 text-salon-muted font-medium">
            <Clock className="w-3.5 h-3.5 text-salon-gold" />
            <span>{service.duration} mins</span>
          </div>

          <div className="text-right">
            {service.discountPrice ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-salon-muted line-through">₹{service.price}</span>
                <span className="text-base font-extrabold text-gold-gradient">
                  ₹{service.discountPrice}
                </span>
              </div>
            ) : (
              <span className="text-base font-extrabold text-gold-gradient">₹{service.price}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            to={`/services/${service.slug}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-salon-card border border-salon-border text-salon-cream text-xs font-semibold hover:border-salon-gold/40 hover:text-salon-gold transition-colors"
          >
            Details
            <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            onClick={() => onBookNow(service)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <Sparkles className="w-3.5 h-3.5 fill-salon-dark" />
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
