import React, { useEffect, useState } from 'react';
import { adminApi, staffApi } from '../../api';
import { IBusinessSettings, IStaff } from '../../types';
import {
  Scissors,
  Award,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  Users,
  Star,
  Clock,
  MapPin,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const [settings, setSettings] = useState<IBusinessSettings | null>(null);
  const [staffList, setStaffList] = useState<IStaff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([adminApi.getSettingsPublic(), staffApi.getAllPublic()])
      .then(([settingsRes, staffRes]) => {
        if (settingsRes.data.success) setSettings(settingsRes.data.data);
        if (staffRes.data.success) setStaffList(staffRes.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = settings?.stats || {
    happyClients: 4500,
    experienceYears: 8,
    expertStylists: 12,
    rating: 4.9,
  };

  const whyChooseUs = settings?.whyChooseUs || [
    {
      title: 'Master Certified Art Directors',
      description: 'Expert stylists trained in international hair smoothing, Russian lash lifts & HD bridal makeup.',
    },
    {
      title: '100% Genuine Luxury Products',
      description: 'Only authentic L\'Oreal Professionnel, O3+, Streax Professional, and Rica Italian waxes used.',
    },
    {
      title: 'Clinical UV Sterilization',
      description: 'Hospital-grade sanitization, sealed single-use kits, and disposable salon linens for maximum hygiene.',
    },
    {
      title: 'VIP Bridal & Groom Lounge',
      description: 'Private relaxing suites for peaceful pre-wedding transformations and pampering rituals.',
    },
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-salon-gold inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-salon-gold/10 border border-salon-gold/20">
          <Sparkles className="w-3.5 h-3.5 fill-salon-gold" />
          The Art of Luxury Transformation
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-salon-cream">
          About {settings?.businessName || 'MAKEUP WITH ART'}
        </h1>
        <p className="text-sm sm:text-base text-salon-muted leading-relaxed">
          {settings?.heroSubheading ||
            'Jaipur\'s premier unisex salon destination for HD bridal makeup, couture hair smoothing, hydra facials & 3D chrome nail art.'}
        </p>
      </div>

      {/* Main Story & Ambience Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-salon-gold/30 shadow-2xl h-[460px] group">
          <img
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80"
            alt="MAKEUP WITH ART Luxury Salon Ambience"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-salon-dark via-salon-dark/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel border border-salon-gold/20">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-salon-gold shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-salon-cream block">
                  Pillar No. 113, Shyam Nagar Metro Station
                </span>
                <span className="text-salon-muted">New Sanganer Road, Jaipur, Rajasthan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-salon-cream">
            Our Artistic Philosophy
          </h2>
          <p className="text-sm text-salon-cream/80 leading-relaxed">
            {settings?.aboutContent ||
              'At MAKEUP WITH ART, beauty is an immersive art form. Founded in Jaipur, our unisex luxury salon combines state-of-the-art hair sculpting, dermatological skin therapies, and high-definition bridal artistry to create personalized aesthetic experiences.'}
          </p>

          {/* Mission & Vision Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl glass-panel border border-salon-gold/20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-salon-gold flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-salon-gold" />
                Our Mission
              </span>
              <p className="text-xs text-salon-cream/80 leading-relaxed">
                {settings?.aboutMission ||
                  'To deliver world-class salon artistry, clinical hygiene, and confidence-boosting transformations tailored to every individual using international organic formulations.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-salon-gold/20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-salon-gold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-salon-gold" />
                Our Vision
              </span>
              <p className="text-xs text-salon-cream/80 leading-relaxed">
                {settings?.aboutVision ||
                  'To be Rajasthan\'s most trusted bridal studio and trendsetting unisex grooming destination where luxury meets accessible artistry.'}
              </p>
            </div>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-salon-border/60">
            <div className="flex items-center gap-2 text-xs font-bold text-salon-gold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              100% UV Sterilized Tools
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-salon-gold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Certified Master Stylists
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-salon-gold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              L\'Oreal & O3+ Luxury Brands
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-salon-gold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              VIP Private Bridal Suites
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Key Performance Stats Bar */}
      <div className="p-8 rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-salon-border/60">
          <div className="space-y-1">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-salon-gold">
              {stats.happyClients.toLocaleString()}+
            </div>
            <div className="text-xs uppercase font-bold tracking-wider text-salon-muted">
              Happy Clients Served
            </div>
          </div>

          <div className="space-y-1 pt-4 md:pt-0">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-salon-gold">
              {stats.experienceYears}+ Years
            </div>
            <div className="text-xs uppercase font-bold tracking-wider text-salon-muted">
              Industry Experience
            </div>
          </div>

          <div className="space-y-1 pt-4 md:pt-0">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-salon-gold">
              {stats.expertStylists}+
            </div>
            <div className="text-xs uppercase font-bold tracking-wider text-salon-muted">
              Certified Stylists
            </div>
          </div>

          <div className="space-y-1 pt-4 md:pt-0">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-salon-gold flex items-center justify-center gap-1.5">
              <span>{stats.rating}</span>
              <Star className="w-5 h-5 fill-salon-gold text-salon-gold" />
            </div>
            <div className="text-xs uppercase font-bold tracking-wider text-salon-muted">
              Google Customer Rating
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-salon-gold">
            Uncompromising Excellence
          </span>
          <h2 className="font-serif text-3xl font-bold text-salon-cream">
            Why Discerning Clients Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChooseUs.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-panel border border-salon-border/60 hover:border-salon-gold/40 transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-salon-gold/10 border border-salon-gold/20 flex items-center justify-center text-salon-gold group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-salon-cream">
                {item.title}
              </h3>
              <p className="text-xs text-salon-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Master Art Directors Staff Showcase */}
      {staffList.length > 0 && (
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-salon-gold">
              Master Artists & Stylists
            </span>
            <h2 className="font-serif text-3xl font-bold text-salon-cream">
              Meet The Creative Minds
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {staffList.map((member) => (
              <div
                key={member._id}
                className="rounded-3xl glass-panel border border-salon-border/60 overflow-hidden group hover:border-salon-gold/40 transition-all p-5 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-salon-gold/50 shadow-xl bg-salon-dark p-1">
                  <img
                    src={member.photo || '/logo.png'}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-salon-cream">
                    {member.name}
                  </h4>
                  <span className="text-xs text-salon-gold font-semibold block">
                    {member.designation}
                  </span>
                </div>
                <p className="text-xs text-salon-muted line-clamp-3">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visit Us CTA Banner */}
      <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-salon-gold/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-salon-gold/10 blur-[100px] pointer-events-none" />
        <div className="space-y-3 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-salon-gold">
            Experience Jaipur's Finest Artistry
          </span>
          <h3 className="font-serif text-3xl font-bold text-salon-cream">
            Ready for your bespoke makeover?
          </h3>
          <p className="text-xs sm:text-sm text-salon-muted max-w-xl">
            Book an appointment online or contact our master artists for bridal packages, hair transformations, and nail art.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/services"
            className="px-6 py-3.5 rounded-xl bg-salon-gold hover:bg-salon-gold/90 text-salon-dark font-bold text-xs uppercase tracking-wider shadow-lg shadow-salon-gold/20 transition-all hover:scale-105"
          >
            Explore Services
          </Link>
          <a
            href="https://wa.me/919352769045"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all hover:scale-105"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            WhatsApp Art Director
          </a>
        </div>
      </div>
    </div>
  );
};
