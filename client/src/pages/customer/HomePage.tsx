import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Scissors,
  Award,
  ShieldCheck,
  HeartHandshake,
  Clock,
  MapPin,
  ArrowRight,
  Instagram,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { serviceApi, packageApi, adminApi } from '../../api';
import { IService, IPackage, IBusinessSettings } from '../../types';
import { ServiceCard } from '../../components/customer/ServiceCard';
import { PackageCard } from '../../components/customer/PackageCard';
import { GalleryGrid } from '../../components/customer/GalleryGrid';
import { TestimonialSlider } from '../../components/customer/TestimonialSlider';
import { BookingModal } from '../../components/customer/BookingModal';

export const HomePage: React.FC = () => {
  const [featuredServices, setFeaturedServices] = useState<IService[]>([]);
  const [popularPackages, setPopularPackages] = useState<IPackage[]>([]);
  const [settings, setSettings] = useState<IBusinessSettings | null>(null);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedBookingItem, setSelectedBookingItem] = useState<IService | IPackage | null>(null);
  const [selectedBookingType, setSelectedBookingType] = useState<'service' | 'package'>('service');

  useEffect(() => {
    // Fetch Featured Services
    serviceApi
      .getAll({ limit: 6, sort: 'popular' })
      .then((res) => {
        if (res.data.success) setFeaturedServices(res.data.data);
      })
      .catch(console.error);

    // Fetch Packages
    packageApi
      .getAll()
      .then((res) => {
        if (res.data.success) setPopularPackages(res.data.data);
      })
      .catch(console.error);

    // Fetch Business Settings
    adminApi
      .getSettingsPublic()
      .then((res) => {
        if (res.data.success) setSettings(res.data.data);
      })
      .catch(console.error);
  }, []);

  const handleOpenBooking = (item: IService | IPackage, type: 'service' | 'package') => {
    setSelectedBookingItem(item);
    setSelectedBookingType(type);
    setBookingModalOpen(true);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=2000&q=80"
            alt="Salon Background"
            className="w-full h-full object-cover scale-105 filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-salon-dark via-salon-dark/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-salon-dark via-transparent to-salon-dark" />
        </div>

        {/* Ambient Gold Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-salon-gold/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-salon-dark/80 backdrop-blur-md border border-salon-gold/40 text-salon-gold text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 fill-salon-gold animate-pulse" />
            <span>Jaipur’s Premier Unisex Salon & Studio</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-salon-cream leading-[1.1]"
          >
            {settings?.heroTitle || 'Your Beauty. Your Style. Your Art.'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-lg text-salon-cream/80 max-w-2xl mx-auto leading-relaxed font-sans"
          >
            {settings?.heroSubheading || 'Premium Unisex Salon Services Crafted Around You.'} Located at Shyam Nagar Metro Station, Jaipur.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/services"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-extrabold uppercase tracking-wider shadow-xl shadow-salon-gold/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-salon-dark" />
              BOOK APPOINTMENT
            </Link>

            <Link
              to="/services"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-salon-card/80 backdrop-blur-md border border-salon-gold/40 text-salon-cream text-xs font-extrabold uppercase tracking-wider hover:bg-salon-gold hover:text-salon-dark transition-all flex items-center justify-center gap-2"
            >
              EXPLORE SERVICES
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-12 border-t border-salon-border/40 text-left"
          >
            <div className="p-3 rounded-xl bg-salon-card/40 border border-salon-border/40">
              <span className="text-2xl font-serif font-bold text-salon-gold block">10+</span>
              <span className="text-[11px] text-salon-muted">Years Crafting Art</span>
            </div>
            <div className="p-3 rounded-xl bg-salon-card/40 border border-salon-border/40">
              <span className="text-2xl font-serif font-bold text-salon-gold block">5,000+</span>
              <span className="text-[11px] text-salon-muted">Satisfied Clients</span>
            </div>
            <div className="p-3 rounded-xl bg-salon-card/40 border border-salon-border/40">
              <span className="text-2xl font-serif font-bold text-salon-gold block">100%</span>
              <span className="text-[11px] text-salon-muted">Hygienic Sterilized</span>
            </div>
            <div className="p-3 rounded-xl bg-salon-card/40 border border-salon-border/40">
              <span className="text-2xl font-serif font-bold text-salon-gold block">4.9 ★</span>
              <span className="text-[11px] text-salon-muted">Customer Rating</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. ABOUT MAKEUP WITH ART */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Showcase */}
          <div className="relative">
            <div className="relative h-[450px] rounded-3xl overflow-hidden glass-panel border border-salon-gold/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
                alt="Makeup With Art Salon Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-salon-dark via-transparent to-transparent" />
            </div>

            {/* Float Card */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-4 p-5 rounded-2xl glass-panel border border-salon-gold/40 shadow-2xl max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-salon-gold flex items-center justify-center text-salon-dark font-bold shrink-0">
                <Scissors className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-salon-cream">Unisex Hair & Beauty</h5>
                <p className="text-[10px] text-salon-muted">Pillar 113, Shyam Nagar Metro</p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-salon-gold">
              Welcome to Luxury
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-salon-cream leading-tight">
              About MAKEUP WITH ART
            </h2>
            <p className="text-sm text-salon-cream/80 leading-relaxed">
              {settings?.aboutContent ||
                'MAKEUP WITH ART is Jaipur premier unisex salon dedicated to elevating your personal style. We blend modern techniques with artistic elegance to deliver bespoke hair, skin, makeup, and nail transformations.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-salon-card/60 border border-salon-border">
                <CheckCircle2 className="w-5 h-5 text-salon-gold shrink-0 mt-0.5" />
                <div>
                  <h6 className="text-xs font-bold text-salon-cream">Couture Bridal Studio</h6>
                  <p className="text-[11px] text-salon-muted">Airbrush & HD Indian bridal transformations</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-salon-card/60 border border-salon-border">
                <CheckCircle2 className="w-5 h-5 text-salon-gold shrink-0 mt-0.5" />
                <div>
                  <h6 className="text-xs font-bold text-salon-cream">Master Stylists</h6>
                  <p className="text-[11px] text-salon-muted">UK & Japanese certified hair artisans</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-salon-card border border-salon-gold/40 text-salon-gold text-xs font-bold hover:bg-salon-gold hover:text-salon-dark transition-all"
              >
                DISCOVER OUR STORY
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-salon-border/60 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-salon-gold">
              Tailored Beautification
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-salon-cream mt-1">
              Featured Salon Services
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-bold text-salon-gold hover:underline"
          >
            VIEW ALL SERVICES ({featuredServices.length}+)
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onBookNow={(s) => handleOpenBooking(s, 'service')}
            />
          ))}
        </div>
      </section>

      {/* 4. POPULAR PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-salon-border/60 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-salon-gold">
              Curated Bundles & Savings
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-salon-cream mt-1">
              Popular Pamper Packages
            </h2>
          </div>
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 text-xs font-bold text-salon-gold hover:underline"
          >
            EXPLORE ALL PACKAGES
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularPackages.map((pkg) => (
            <PackageCard
              key={pkg._id}
              pkg={pkg}
              onBookNow={(p) => handleOpenBooking(p, 'package')}
            />
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-salon-gold/20 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-salon-gold">
              The Art of Excellence
            </span>
            <h2 className="font-serif text-3xl font-bold text-salon-cream">
              Why Choose MAKEUP WITH ART?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-salon-dark/60 border border-salon-border/60">
              <Award className="w-10 h-10 text-salon-gold" />
              <h4 className="font-serif text-lg font-bold text-salon-cream">Experienced Professionals</h4>
              <p className="text-xs text-salon-muted leading-relaxed">
                Master stylists and cosmetologists trained in international techniques with over a decade of couture artistry.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-salon-dark/60 border border-salon-border/60">
              <Sparkles className="w-10 h-10 text-salon-gold" />
              <h4 className="font-serif text-lg font-bold text-salon-cream">Premium Products</h4>
              <p className="text-xs text-salon-muted leading-relaxed">
                Top-tier dermatologist tested & cruelty-free luxury cosmetics imported for sensitive Indian skin types.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-salon-dark/60 border border-salon-border/60">
              <HeartHandshake className="w-10 h-10 text-salon-gold" />
              <h4 className="font-serif text-lg font-bold text-salon-cream">Personalized Service</h4>
              <p className="text-xs text-salon-muted leading-relaxed">
                Tailored beauty consultations designed around your unique features, facial geometry, and personal style.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-salon-dark/60 border border-salon-border/60">
              <ShieldCheck className="w-10 h-10 text-salon-gold" />
              <h4 className="font-serif text-lg font-bold text-salon-cream">Hygienic Environment</h4>
              <p className="text-xs text-salon-muted leading-relaxed">
                Hospital-grade UV sanitization, disposable single-use client kits, and pristine private treatment suites.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-salon-dark/60 border border-salon-border/60">
              <Scissors className="w-10 h-10 text-salon-gold" />
              <h4 className="font-serif text-lg font-bold text-salon-cream">Modern Techniques</h4>
              <p className="text-xs text-salon-muted leading-relaxed">
                Latest Japanese keratin hair botox, airbrush bridal foundation, and Russian volume eyelash extension art.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-salon-dark/60 border border-salon-border/60">
              <Clock className="w-10 h-10 text-salon-gold" />
              <h4 className="font-serif text-lg font-bold text-salon-cream">Seamless Scheduling</h4>
              <p className="text-xs text-salon-muted leading-relaxed">
                Real-time online booking system with zero waiting time and automatic instant WhatsApp confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRANSFORMATIONS GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-salon-gold">
            Visual Proof of Artistry
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-salon-cream">
            Transformation Gallery
          </h2>
        </div>

        <GalleryGrid />
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-salon-gold">
            Client Appreciation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-salon-cream">
            What Our Clients Say
          </h2>
        </div>

        <TestimonialSlider />
      </section>

      {/* 8. INSTAGRAM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 text-salon-gold text-xs font-bold uppercase tracking-widest">
          <Instagram className="w-4 h-4" />
          <span>Follow Us On Instagram</span>
        </div>
        <h3 className="font-serif text-3xl font-bold text-salon-cream">
          @makeup.with.art
        </h3>
        <p className="text-xs text-salon-muted max-w-md mx-auto">
          Get inspired by daily bridal transformations, hair styling reels, and salon BTS footage.
        </p>
        <a
          href="https://instagram.com/makeup.with.art"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-salon-card border border-salon-gold/40 text-salon-gold text-xs font-bold hover:bg-salon-gold hover:text-salon-dark transition-all"
        >
          FOLLOW ON INSTAGRAM
          <ArrowRight className="w-4 h-4" />
        </a>
      </section>

      {/* 9. LOCATION & GOOGLE MAPS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 rounded-3xl glass-panel p-8 border border-salon-gold/20 overflow-hidden">
          <div className="lg:col-span-1 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-salon-gold">
                Visit Our Studio
              </span>
              <h3 className="font-serif text-2xl font-bold text-salon-cream">
                Location & Contact
              </h3>
              <p className="text-xs text-salon-muted leading-relaxed">
                Conveniently located at Shyam Nagar Metro Station in Jaipur with ample client parking.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-salon-dark/60 border border-salon-border">
                <MapPin className="w-4 h-4 text-salon-gold shrink-0 mt-0.5" />
                <span className="text-salon-cream">{settings?.address || 'Pillar No. 113, Shyam Nagar Metro Station, Jaipur'}</span>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-salon-dark/60 border border-salon-border">
                <Phone className="w-4 h-4 text-salon-gold shrink-0" />
                <div className="flex flex-col text-salon-cream">
                  <span>+91 8949009360</span>
                  <span>+91 7357496309</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 h-72 lg:h-auto rounded-2xl overflow-hidden border border-salon-border">
            <iframe
              title="Makeup With Art Location Map"
              src={settings?.googleMapsIframeUrl || 'https://maps.google.com/maps?q=Shyam+Nagar+Metro+Station+Jaipur&t=&z=15&ie=UTF8&iwloc=&output=embed'}
              className="w-full h-full border-0 filter invert contrast-[1.2] opacity-80"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA BANNER */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="relative rounded-3xl p-10 sm:p-16 bg-gradient-to-br from-salon-card via-salon-dark to-salon-card border border-salon-gold/30 shadow-2xl overflow-hidden space-y-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-salon-gold/10 rounded-full blur-[80px] pointer-events-none" />

          <span className="text-xs font-bold uppercase tracking-widest text-salon-gold">
            Elevate Your Style Today
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-salon-cream">
            Ready for your next look?
          </h2>
          <p className="text-xs sm:text-sm text-salon-muted max-w-xl mx-auto">
            Book your appointment now with MAKEUP WITH ART and experience luxury unisex salon services in Jaipur.
          </p>

          <div className="pt-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-extrabold uppercase tracking-wider shadow-2xl shadow-salon-gold/30 hover:scale-105 transition-transform"
            >
              <Sparkles className="w-4 h-4 fill-salon-dark" />
              BOOK YOUR APPOINTMENT NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal Handler */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        item={selectedBookingItem}
        itemType={selectedBookingType}
      />
    </div>
  );
};
