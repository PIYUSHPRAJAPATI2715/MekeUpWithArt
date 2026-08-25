import React, { useState } from 'react';
import { Phone, Mail, MapPin, Instagram, Clock, Send, Sparkles } from 'lucide-react';
import { contactApi } from '../../api';
import { useToast } from '../../components/common/Toast';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await contactApi.submit({ name, email, phone, message });
      if (res.data.success) {
        showToast('Your message has been sent to MAKEUP WITH ART!', 'success');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-salon-gold inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 fill-salon-gold" />
          Get In Touch With Us
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-salon-cream">
          Contact MAKEUP WITH ART
        </h1>
        <p className="text-sm text-salon-muted">
          Have questions about bridal packages, hair botox spa, or custom makeup appointments? Reach out to our Jaipur salon team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Information & Hours */}
        <div className="space-y-8">
          <div className="rounded-3xl glass-panel p-8 border border-salon-gold/20 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-salon-cream">Studio Information</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-salon-dark/60 border border-salon-border">
                <MapPin className="w-5 h-5 text-salon-gold shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-salon-cream text-sm">Salon Address</h5>
                  <p className="text-salon-muted leading-relaxed mt-0.5">
                    Pillar No. 113, Shyam Nagar Metro Station, Jaipur, Rajasthan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-salon-dark/60 border border-salon-border">
                <Phone className="w-5 h-5 text-salon-gold shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-salon-cream text-sm">Phone Numbers</h5>
                  <p className="text-salon-muted mt-0.5">+91 8949009360</p>
                  <p className="text-salon-muted">+91 7357496309</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-salon-dark/60 border border-salon-border">
                <Mail className="w-5 h-5 text-salon-gold shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-salon-cream text-sm">Email Address</h5>
                  <p className="text-salon-muted mt-0.5">makeupwitharto@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-salon-dark/60 border border-salon-border">
                <Instagram className="w-5 h-5 text-salon-gold shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-salon-cream text-sm">Instagram Handle</h5>
                  <a
                    href="https://instagram.com/makeup.with.art"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-salon-gold hover:underline mt-0.5 block"
                  >
                    @makeup.with.art
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-3xl glass-panel p-8 border border-salon-gold/30 shadow-2xl space-y-6">
          <h3 className="font-serif text-2xl font-bold text-salon-cream">Send Us a Message</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider mb-1.5">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ananya Roy"
                className="w-full px-4 py-3 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9829012345"
                  className="w-full px-4 py-3 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-salon-muted tracking-wider mb-1.5">
                Message / Inquiry Details
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="I would like to inquire about HD Airbrush bridal makeup availability..."
                className="w-full px-4 py-3 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-salon-gold/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'SENDING...' : 'SUBMIT INQUIRY'}
            </button>
          </form>
        </div>
      </div>

      {/* Map Embed */}
      <div className="rounded-3xl overflow-hidden glass-panel border border-salon-gold/20 h-96">
        <iframe
          title="Makeup With Art Map"
          src="https://maps.google.com/maps?q=Shyam+Nagar+Metro+Station+Jaipur&t=&z=15&ie=UTF8&iwloc=&output=embed"
          className="w-full h-full border-0 filter invert contrast-[1.2] opacity-80"
          loading="lazy"
        />
      </div>
    </div>
  );
};
