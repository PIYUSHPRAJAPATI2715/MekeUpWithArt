import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { IBusinessSettings } from '../../types';
import { RotateCcw, ShieldAlert, CheckCircle2, Clock, Phone, Sparkles } from 'lucide-react';

export const RefundPolicyPage: React.FC = () => {
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

  const defaultCancellation = `### 1. Appointment Rescheduling & Cancellations
- Clients can reschedule or cancel an appointment up to 2 hours before the scheduled time slot free of charge by calling us or managing via their profile.
- For bridal and premium groom packages, cancellations must be communicated at least 48 hours prior to the date.

### 2. Refunds & Satisfaction Guarantee
- Service fees once rendered are non-refundable; however, if you are not 100% satisfied with a haircut, nail shape, or treatment, our Art Director will gladly offer a complimentary correction within 48 hours.
- Advance deposits for bulk packages can be retained as salon credit valid for 6 months.

### 3. Late Arrival Policy
- Please arrive 10 minutes early. If running late, please call us immediately so we can hold your chair or adjust the service duration.`;

  const cancellationContent = settings?.cancellationPolicy || defaultCancellation;

  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-salon-gold inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-salon-gold/10 border border-salon-gold/20">
          <RotateCcw className="w-3.5 h-3.5 text-salon-gold" />
          Customer Satisfaction
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-salon-cream">
          Cancellation & Refund Policy
        </h1>
        <p className="text-sm text-salon-muted">
          Transparent policies designed to give you complete peace of mind.
        </p>
      </div>

      {/* Main Card */}
      <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl space-y-8 text-salon-cream/90 leading-relaxed text-sm">
        <div className="pb-6 border-b border-salon-border/60">
          <p className="text-sm text-salon-muted leading-relaxed">
            At <strong className="text-salon-gold">MAKEUP WITH ART</strong>, we respect your time and schedule. We strive to provide the ultimate salon experience in Jaipur, backed by our master stylist quality commitment.
          </p>
        </div>

        {/* Content Render */}
        <div className="space-y-6">
          {cancellationContent.split('\n\n').map((block, idx) => {
            if (block.startsWith('### ')) {
              const lines = block.split('\n');
              const heading = lines[0].replace('### ', '');
              const items = lines.slice(1);
              return (
                <div key={idx} className="space-y-3">
                  <h3 className="font-serif text-xl font-bold text-salon-gold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-salon-gold shrink-0" />
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

        {/* Need assistance */}
        <div className="pt-8 border-t border-salon-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-salon-muted">
          <div>
            Need to reschedule right now? Call our reception at <a href="tel:+919352769045" className="text-salon-gold font-bold underline">+91 9352769045</a>
          </div>
          <div>
            Open Daily: 10:30 AM to 9:30 PM
          </div>
        </div>
      </div>
    </div>
  );
};
