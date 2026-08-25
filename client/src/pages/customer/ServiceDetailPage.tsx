import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { serviceApi } from '../../api';
import { IService } from '../../types';
import { Clock, CheckCircle2, Sparkles, ArrowLeft, Tag } from 'lucide-react';
import { ServiceCard } from '../../components/customer/ServiceCard';
import { BookingModal } from '../../components/customer/BookingModal';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [service, setService] = useState<IService | null>(null);
  const [related, setRelated] = useState<IService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVariant, setSelectedVariant] = useState<string>('');

  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      serviceApi
        .getBySlug(slug)
        .then((res) => {
          if (res.data.success) {
            setService(res.data.data);
            setRelated(res.data.related || []);
            if (res.data.data.variants && res.data.data.variants.length > 0) {
              setSelectedVariant(res.data.data.variants[0].name);
            }
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 text-center text-salon-muted animate-pulse">
        Loading service details...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="pt-32 pb-20 max-w-5xl mx-auto px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl text-salon-cream">Service Not Found</h2>
        <Link to="/services" className="inline-block px-6 py-2 rounded-xl bg-salon-gold text-salon-dark text-xs font-bold">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Back Link */}
      <Link
        to="/services"
        className="inline-flex items-center gap-2 text-xs font-semibold text-salon-muted hover:text-salon-gold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Services
      </Link>

      {/* Detail Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Large Media Image */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-salon-gold/30 shadow-2xl h-[450px]">
          <img
            src={service.images && service.images[0] ? service.images[0] : 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80'}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-salon-dark via-transparent to-transparent" />
          <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-salon-dark/80 backdrop-blur-md border border-salon-gold/40 text-xs font-bold text-salon-gold uppercase tracking-wider">
            {service.category}
          </span>
        </div>

        {/* Info & Variants */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-salon-gold">
              {service.category} Service
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-salon-cream">
              {service.name}
            </h1>
            <p className="text-xs text-salon-muted leading-relaxed">
              {service.shortDescription}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-salon-card/80 border border-salon-gold/25 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-salon-muted">
              <Clock className="w-4 h-4 text-salon-gold" />
              <span>{service.duration} Mins Session</span>
            </div>

            <div className="text-right">
              {service.discountPrice ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-salon-muted line-through">₹{service.price}</span>
                  <span className="text-2xl font-extrabold text-gold-gradient">
                    ₹{service.discountPrice}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-extrabold text-gold-gradient">₹{service.price}</span>
              )}
            </div>
          </div>

          {/* Service Variants (If Configured) */}
          {service.variants && service.variants.length > 0 && (
            <div className="space-y-3 pt-2">
              <label className="block text-xs uppercase font-bold text-salon-gold tracking-wider">
                Select Package Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {service.variants.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => setSelectedVariant(v.name)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedVariant === v.name
                        ? 'bg-salon-gold/15 border-salon-gold text-salon-cream'
                        : 'bg-salon-dark/60 border-salon-border text-salon-muted hover:border-salon-gold/40'
                    }`}
                  >
                    <p className="text-xs font-bold">{v.name}</p>
                    <p className="text-sm font-extrabold text-salon-gold mt-0.5">₹{v.price}</p>
                    <p className="text-[10px] text-salon-muted">{v.duration} mins</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-salon-cream">
              Service Description
            </h4>
            <p className="text-xs text-salon-cream/80 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Benefits */}
          {service.benefits && service.benefits.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-salon-gold">
                Key Benefits & Included Treatment
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-salon-cream/90 p-2 rounded-lg bg-salon-dark/40 border border-salon-border/40">
                    <CheckCircle2 className="w-4 h-4 text-salon-gold shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Book CTA */}
          <div className="pt-4">
            <button
              onClick={() => setBookingModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-bold shadow-xl shadow-salon-gold/20 hover:scale-[1.02] transition-transform"
            >
              <Sparkles className="w-4 h-4 fill-salon-dark" />
              BOOK THIS SERVICE NOW
            </button>
          </div>
        </div>
      </div>

      {/* Related Services */}
      {related.length > 0 && (
        <div className="space-y-8 pt-12 border-t border-salon-border/60">
          <h3 className="font-serif text-2xl font-bold text-salon-cream">
            Related {service.category} Services
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((r) => (
              <ServiceCard
                key={r._id}
                service={r}
                onBookNow={() => {
                  setService(r);
                  setBookingModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        item={service}
        itemType="service"
      />
    </div>
  );
};
