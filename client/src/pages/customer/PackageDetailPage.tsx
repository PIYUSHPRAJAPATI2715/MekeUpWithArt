import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { packageApi } from '../../api';
import { IPackage } from '../../types';
import { Clock, CheckCircle2, Sparkles, ArrowLeft, Tag, Calendar } from 'lucide-react';
import { BookingModal } from '../../components/customer/BookingModal';

export const PackageDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [pkg, setPkg] = useState<IPackage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      packageApi
        .getBySlug(slug)
        .then((res) => {
          if (res.data.success) {
            setPkg(res.data.data);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 text-center text-salon-muted animate-pulse">
        Loading package details...
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl text-salon-cream">Package Not Found</h2>
        <Link to="/packages" className="inline-block px-6 py-2 rounded-xl bg-salon-gold text-salon-dark text-xs font-bold">
          Back to Packages
        </Link>
      </div>
    );
  }

  const savings = pkg.originalPrice - pkg.discountPrice;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <Link
        to="/packages"
        className="inline-flex items-center gap-2 text-xs font-semibold text-salon-muted hover:text-salon-gold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Packages
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Media Banner */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-salon-gold/30 shadow-2xl h-[450px]">
          <img
            src={pkg.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80'}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-salon-dark via-transparent to-transparent" />
          {savings > 0 && (
            <span className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-emerald-500 text-salon-dark text-xs font-extrabold flex items-center gap-1.5 shadow-lg">
              <Tag className="w-4 h-4" />
              SAVE ₹{savings} (BUNDLE DEAL)
            </span>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-salon-gold">
              Exclusive Salon Package
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-salon-cream">
              {pkg.name}
            </h1>
            <p className="text-xs text-salon-muted leading-relaxed">
              {pkg.description}
            </p>
          </div>

          {/* Price & Meta Box */}
          <div className="p-4 rounded-2xl bg-salon-card/80 border border-salon-gold/25 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-salon-muted">
                <Clock className="w-4 h-4 text-salon-gold" />
                <span>{pkg.duration} Mins Duration</span>
              </div>
              {pkg.validityDays && (
                <div className="flex items-center gap-1.5 text-[11px] text-salon-muted">
                  <Calendar className="w-3.5 h-3.5 text-salon-gold" />
                  <span>Valid for {pkg.validityDays} Days</span>
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-salon-muted line-through">₹{pkg.originalPrice}</span>
                <span className="text-3xl font-extrabold text-gold-gradient">₹{pkg.discountPrice}</span>
              </div>
            </div>
          </div>

          {/* Included Services Breakdown */}
          {pkg.servicesIncluded && pkg.servicesIncluded.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-salon-gold">
                Services Included in Package:
              </h4>
              <div className="space-y-2">
                {pkg.servicesIncluded.map((s: any) => (
                  <div
                    key={s._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-salon-dark/60 border border-salon-border text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-salon-gold shrink-0" />
                      <span className="font-bold text-salon-cream">{s.name}</span>
                      <span className="text-[10px] text-salon-muted">({s.category})</span>
                    </div>
                    <span className="text-salon-gold font-medium">{s.duration} mins</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {pkg.benefits && pkg.benefits.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-salon-cream">
                Package Perks & Terms
              </h4>
              <ul className="space-y-1 text-xs text-salon-cream/80">
                {pkg.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-salon-gold" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Book CTA */}
          <div className="pt-4">
            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-bold shadow-xl shadow-salon-gold/20 hover:scale-[1.02] transition-transform"
            >
              <Sparkles className="w-4 h-4 fill-salon-dark" />
              BOOK THIS PACKAGE NOW
            </button>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        item={pkg}
        itemType="package"
      />
    </div>
  );
};
