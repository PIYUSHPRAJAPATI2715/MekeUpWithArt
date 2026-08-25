import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Phone, Mail, MapPin, Instagram, Clock, ArrowUpRight } from 'lucide-react';
import { adminApi } from '../../api';
import { IBusinessSettings } from '../../types';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<IBusinessSettings | null>(null);

  useEffect(() => {
    adminApi
      .getSettingsPublic()
      .then((res) => {
        if (res.data.success) {
          setSettings(res.data.data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <footer className="bg-salon-dark border-t border-salon-gold/20 pt-16 pb-8 text-salon-cream relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-salon-gold/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-salon-border/60">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-salon-gold-dark via-salon-gold to-salon-gold-light flex items-center justify-center text-salon-dark font-bold shadow-lg shadow-salon-gold/20">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-wider text-gold-gradient uppercase block">
                  MAKEUP WITH ART
                </span>
                <span className="text-[10px] tracking-[0.2em] text-salon-muted uppercase block font-sans">
                  PREMIUM UNISEX SALON
                </span>
              </div>
            </div>

            <p className="text-xs text-salon-muted leading-relaxed">
              {settings?.aboutContent ||
                'Jaipur premier luxury unisex salon dedicated to bespoke hair sculpting, high-definition bridal makeup, hydra skincare, and artistic nail extensions.'}
            </p>

            {/* Instagram link */}
            <a
              href={`https://instagram.com/${settings?.instagram || 'makeup.with.art'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-salon-card border border-salon-border text-xs font-semibold text-salon-cream hover:border-salon-gold hover:text-salon-gold transition-colors"
            >
              <Instagram className="w-4 h-4 text-salon-gold" />
              <span>@{settings?.instagram || 'makeup.with.art'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-salon-muted" />
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-salon-gold">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-salon-cream/80 hover:text-salon-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-salon-cream/80 hover:text-salon-gold transition-colors">
                  Services & Pricing
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-salon-cream/80 hover:text-salon-gold transition-colors">
                  Special Packages
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-salon-cream/80 hover:text-salon-gold transition-colors">
                  Gallery & Transformations
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-salon-cream/80 hover:text-salon-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-salon-cream/80 hover:text-salon-gold transition-colors">
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-salon-gold">
              Salon Specialties
            </h4>
            <ul className="space-y-2 text-xs text-salon-cream/80">
              <li>Hair Cut & Styling</li>
              <li>Keratin & Hair Botox Spa</li>
              <li>HD Airbrush Bridal Makeup</li>
              <li>Hydra-Glow Facial Therapy</li>
              <li>Gel Nail Extension & Art</li>
              <li>Russian Volume Eyelashes</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-salon-gold">
              Salon Studio
            </h4>
            <div className="space-y-3 text-xs text-salon-cream/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-salon-gold shrink-0 mt-0.5" />
                <span>{settings?.address || 'Pillar No. 113, Shyam Nagar Metro Station, Jaipur'}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-salon-gold shrink-0" />
                <div className="flex flex-col">
                  <span>+91 8949009360</span>
                  <span>+91 7357496309</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-salon-gold shrink-0" />
                <span>{settings?.email || 'makeupwitharto@gmail.com'}</span>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-salon-gold shrink-0" />
                <span>Open Daily: 9:30 AM – 8:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-salon-muted">
          <p>{settings?.footerNotice || '© 2026 MAKEUP WITH ART. All Rights Reserved.'}</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-salon-gold transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="hover:text-salon-gold transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/admin/login" className="hover:text-salon-gold transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
