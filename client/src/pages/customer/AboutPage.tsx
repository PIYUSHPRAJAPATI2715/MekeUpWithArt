import React from 'react';
import { Scissors, Award, ShieldCheck, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-salon-gold inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 fill-salon-gold" />
          The Legacy of Beauty
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-salon-cream">
          About MAKEUP WITH ART
        </h1>
        <p className="text-sm text-salon-muted">
          Crafting bespoke hair, skin, bridal makeup & nail art at Pillar No. 113, Shyam Nagar Metro Station, Jaipur.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-salon-gold/30 shadow-2xl h-[450px]">
          <img
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80"
            alt="Salon Ambience"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-salon-dark via-transparent to-transparent" />
        </div>

        <div className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-salon-cream">
            Our Artistic Philosophy
          </h2>
          <p className="text-sm text-salon-cream/80 leading-relaxed">
            At MAKEUP WITH ART, we believe true beauty is an expression of individuality. Founded in Jaipur, our unisex luxury salon combines state-of-the-art hair techniques, dermatological skin therapies, and high-definition bridal artistry to create personalized aesthetic experiences.
          </p>
          <p className="text-sm text-salon-cream/80 leading-relaxed">
            Whether you are visiting us for a precision haircut, a soothing keratin hair spa, or getting glammed up for your dream wedding day, our certified master stylists ensure unmatched comfort and flawless outcomes.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-salon-border">
            <div className="flex items-center gap-2 text-xs font-bold text-salon-gold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              100% Hygienic UV Sterilization
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-salon-gold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              International Certified Stylists
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-salon-gold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Cruelty-Free Luxury Brands
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-salon-gold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              VIP Private Bridal Suites
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
