import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { IBusinessSettings } from '../../types';
import { Lock, ShieldCheck, Mail, Phone, Eye } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
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

  const defaultPrivacy = `### 1. Information We Collect
- Contact Information: Name, phone number, email address, and appointment preferences provided when booking or contacting MAKEUP WITH ART.
- Usage Data: Information collected via Google Analytics 4 and Google Ads conversion tracking to measure site interactions and enhance user experience.

### 2. How We Use Your Information
- To confirm, schedule, reschedule, or notify you regarding your salon bookings.
- To send important appointment reminders and exclusive VIP offers via SMS or WhatsApp (only with your prior engagement).
- To optimize our salon services and marketing campaigns.

### 3. Data Protection & Sharing
- We respect your privacy. Your personal phone numbers and booking details are never sold, traded, or shared with unauthorized third-party advertisers.
- Access to client data is strictly restricted to salon management and authorized administrative staff.

### 4. Contact Us
For any privacy concerns or to request data removal, contact us at makeupwitharto@gmail.com or call +91 9352769045.`;

  const privacyContent = settings?.privacyPolicy || defaultPrivacy;

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-salon-gold inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-salon-gold/10 border border-salon-gold/20">
          <Lock className="w-3.5 h-3.5 text-salon-gold" />
          Data Security & Trust
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-salon-cream">
          Privacy Policy
        </h1>
        <p className="text-sm text-salon-muted">
          Committed to protecting your personal information and booking confidentiality.
        </p>
      </div>

      {/* Main Privacy Card */}
      <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl space-y-8 text-salon-cream/90 leading-relaxed text-sm">
        <div className="pb-6 border-b border-salon-border/60">
          <p className="text-sm text-salon-muted leading-relaxed">
            At <strong className="text-salon-gold">MAKEUP WITH ART</strong>, located at Pillar No. 113, Shyam Nagar Metro Station, Jaipur, we value the trust you place in us when sharing your phone numbers and contact details for salon services and appointments.
          </p>
        </div>

        {/* Content Render */}
        <div className="space-y-6">
          {privacyContent.split('\n\n').map((block, idx) => {
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

        {/* Contact info */}
        <div className="pt-8 border-t border-salon-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-salon-muted">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-salon-gold" />
            <span>Email: makeupwitharto@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-salon-gold" />
            <span>Phone: +91 9352769045 / +91 7575939735</span>
          </div>
        </div>
      </div>
    </div>
  );
};
