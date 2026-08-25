import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonialApi } from '../../api';
import { ITestimonial } from '../../types';

export const TestimonialSlider: React.FC = () => {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    testimonialApi
      .getAllPublic()
      .then((res) => {
        if (res.data.success) {
          setTestimonials(res.data.data);
        }
      })
      .catch(console.error);
  }, []);

  if (testimonials.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto px-4">
      <div className="relative rounded-3xl glass-panel p-8 sm:p-12 border border-salon-gold/25 text-center shadow-2xl overflow-hidden">
        <Quote className="w-16 h-16 text-salon-gold/15 absolute top-6 left-6 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 relative z-10"
          >
            {/* Rating Stars */}
            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < current.rating ? 'text-salon-gold fill-salon-gold' : 'text-salon-border'
                  }`}
                />
              ))}
            </div>

            {/* Review Quote */}
            <p className="font-serif text-lg sm:text-xl italic text-salon-cream/90 leading-relaxed max-w-2xl mx-auto">
              "{current.review}"
            </p>

            {/* Customer Avatar & Name */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <img
                src={
                  current.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(current.customerName)}&background=D4AF37&color=0B0B0E`
                }
                alt={current.customerName}
                className="w-12 h-12 rounded-full object-cover border-2 border-salon-gold/50 shadow-md"
              />
              <div>
                <h5 className="font-bold text-salon-cream text-sm">{current.customerName}</h5>
                <span className="text-[10px] text-salon-gold uppercase tracking-wider font-semibold">
                  Verified Salon Client
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="flex items-center justify-between absolute inset-x-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <button
            onClick={handlePrev}
            className="pointer-events-auto p-3 rounded-full bg-salon-dark/80 border border-salon-gold/30 text-salon-gold hover:bg-salon-gold hover:text-salon-dark transition-all shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="pointer-events-auto p-3 rounded-full bg-salon-dark/80 border border-salon-gold/30 text-salon-gold hover:bg-salon-gold hover:text-salon-dark transition-all shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
