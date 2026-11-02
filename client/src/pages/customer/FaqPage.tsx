import React, { useState, useEffect } from 'react';
import { faqApi } from '../../api';
import { IFAQ } from '../../types';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  MessageCircle,
  Phone,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [faqs, setFaqs] = useState<IFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const categories = [
    'All',
    'Bridal & Groom',
    'Hair & Styling',
    'Skin & Facials',
    'Nail Art & Lashes',
    'Appointments & Pricing',
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    faqApi
      .getPublic()
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setFaqs(res.data.data);
          if (res.data.data.length > 0) {
            setOpenFaqId(res.data.data[0]._id);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-salon-gold inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-salon-gold/10 border border-salon-gold/20">
          <Sparkles className="w-3.5 h-3.5 fill-salon-gold" />
          Got Questions? We Have Answers
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-salon-cream">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-salon-muted leading-relaxed">
          Everything you need to know about our luxury bridal studio, hair styling, skin therapies, and salon appointments at Shyam Nagar, Jaipur.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-salon-gold/70" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions (e.g. bridal makeup, keratin, pricing)..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-salon-card/90 border border-salon-border text-salon-cream placeholder-salon-muted/60 focus:outline-none focus:border-salon-gold text-sm shadow-xl transition-all"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-salon-gold text-salon-dark font-bold shadow-md shadow-salon-gold/20'
                : 'bg-salon-card border border-salon-border/60 text-salon-cream/80 hover:border-salon-gold/50 hover:text-salon-gold'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-salon-card/40 animate-pulse border border-salon-border/40" />
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-3xl border border-salon-border p-8 space-y-3">
            <HelpCircle className="w-10 h-10 text-salon-gold/60 mx-auto" />
            <h3 className="font-serif text-lg text-salon-cream font-bold">No questions found</h3>
            <p className="text-xs text-salon-muted max-w-md mx-auto">
              We couldn't find any FAQs matching "{search}". Feel free to chat with our Art Director on WhatsApp directly!
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq._id;
            return (
              <div
                key={faq._id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'glass-panel border-salon-gold/40 shadow-xl bg-salon-card/90'
                    : 'bg-salon-card/50 border-salon-border/60 hover:border-salon-gold/30'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq._id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-salon-gold/10 border border-salon-gold/20 flex items-center justify-center text-salon-gold shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </span>
                    <span className="font-serif text-base font-semibold text-salon-cream">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-salon-gold shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-salon-cream/80 leading-relaxed border-t border-salon-border/40">
                    <p className="pt-2">{faq.answer}</p>
                    <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider text-salon-gold/80 bg-salon-gold/5 px-2.5 py-1 rounded-md border border-salon-gold/10">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still Have Questions CTA */}
      <div className="p-8 rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-salon-gold/10 blur-[90px] pointer-events-none" />
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-salon-gold">
            Need Personalized Beauty Guidance?
          </span>
          <h3 className="font-serif text-2xl font-bold text-salon-cream">
            Still have questions or special requirements?
          </h3>
          <p className="text-xs text-salon-muted max-w-lg">
            Our Master Art Director is available for instant WhatsApp consultations, bridal trials, and customized quotes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="https://wa.me/919352769045?text=Hello%20MAKEUP%20WITH%20ART%2C%20I%20have%20a%20question%20about%20your%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            Chat on WhatsApp
          </a>

          <a
            href="tel:+919352769045"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-salon-dark border border-salon-gold/50 text-salon-cream hover:text-salon-gold font-bold text-xs transition-all hover:scale-105"
          >
            <Phone className="w-4 h-4 text-salon-gold" />
            Call: 9352769045
          </a>
        </div>
      </div>
    </div>
  );
};
