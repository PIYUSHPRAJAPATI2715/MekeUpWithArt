import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { IBusinessSettings } from '../../types';
import { FileText, ShieldCheck, Clock, Phone, Sparkles } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const [settings, setSettings] = useState<IBusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    adminApi
      .getSettingsPublic()
      .then((res) => {
        if (res.data.success && res.data.data) {
          setSettings(res.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const defaultTerms = `### 1. Appointment Bookings & Schedule
- We recommend booking your appointments at least 24 hours in advance to secure your preferred slot and stylist.
- Walk-ins are accepted subject to daily chair and artist availability.
- Please arrive 10 minutes prior to your scheduled appointment. In case of delays exceeding 15 minutes, your slot may need to be rescheduled to prevent inconvenience to other clients.

### 2. Bridal & Groom Couture Packages
- Bridal, Pre-Bridal, and Grooming packages require a confirmed booking and an initial advance deposit.
- Complimentary consultations and patch tests are available for bridal makeup and hair smoothing treatments prior to the main ceremony.

### 3. Health & Hygiene Protocols
- All our styling tools and equipment undergo clinical UV sterilization between sessions. Single-use disposable aprons, blades, and towels are used for all grooming and facial procedures.
- Please notify our stylists of any allergies, sensitive skin conditions, or past reactions before receiving chemical treatments, hair colors, or facials.

### 4. Pricing & Payments
- All service rates displayed are inclusive of standard salon taxes and master stylist charges.
- Any additional requests, hair length upgrades, or premium custom nail charms will be quoted transparently before service commencement.
- We accept Cash, UPI, Credit/Debit cards, and Net Banking.`;

  const termsContent = settings?.termsAndConditions || defaultTerms;

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-salon-gold inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-salon-gold/10 border border-salon-gold/20">
          <FileText className="w-3.5 h-3.5 text-salon-gold" />
          Legal & Guidelines
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-salon-cream">
          Terms & Conditions
        </h1>
        <p className="text-sm text-salon-muted">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} | MAKEUP WITH ART Salon & Studio
        </p>
      </div>

      {/* Main Legal Card */}
      <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl space-y-8 text-salon-cream/90 leading-relaxed text-sm">
        <div className="pb-6 border-b border-salon-border/60">
          <p className="text-sm text-salon-muted leading-relaxed">
            Welcome to <strong className="text-salon-gold">MAKEUP WITH ART</strong>. By accessing our website, booking appointments, or receiving beauty and grooming services at our studio located at Pillar No. 113, Shyam Nagar Metro Station, Jaipur, you agree to comply with and be bound by the following terms and salon policies.
          </p>
        </div>

        {/* Dynamic Content Markdown-like renderer */}
        <div className="space-y-6">
          {termsContent.split('\n\n').map((block, idx) => {
            if (block.startsWith('### ')) {
              const lines = block.split('\n');
              const heading = lines[0].replace('### ', '');
              const items = lines.slice(1);
              return (
                <div key={idx} className="space-y-3">
                  <h3 className="font-serif text-xl font-bold text-salon-gold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-salon-gold shrink-0" />
                    {heading}
                  </h3>
                  <div className="space-y-2 pl-7">
                    {items.map((it, itemIdx) => (
                      <p key={itemIdx} className="text-salon-cream/80 text-sm">
                        {it.replace(/^- /, '• ')}
                      </p>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <p key={idx} className="text-salon-cream/80 text-sm">
                {block}
              </p>
            );
          })}
        </div>

        {/* Help & Contact Footer in Document */}
        <div className="pt-8 border-t border-salon-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-salon-muted">
          <div>
            Questions about our terms? Call <a href="tel:+919352769045" className="text-salon-gold font-bold underline">+91 9352769045</a>
          </div>
          <div>
            Studio Address: Pillar No. 113, Shyam Nagar Metro Station, Jaipur
          </div>
        </div>
      </div>
    </div>
  );
};
