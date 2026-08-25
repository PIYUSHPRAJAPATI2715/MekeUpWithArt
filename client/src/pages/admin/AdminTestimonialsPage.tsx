import React, { useState, useEffect } from 'react';
import { testimonialApi } from '../../api';
import { ITestimonial } from '../../types';
import { useToast } from '../../components/common/Toast';
import { StatusBadge } from '../../components/common/Badge';
import { Star, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminTestimonialsPage: React.FC = () => {
  const { showToast } = useToast();

  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await testimonialApi.getAllAdmin();
      if (res.data.success) setTestimonials(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      await testimonialApi.toggleStatus(id);
      showToast('Testimonial status updated', 'success');
      fetchTestimonials();
    } catch (err: any) {
      showToast('Failed to update testimonial status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete testimonial?')) return;
    try {
      await testimonialApi.delete(id);
      showToast('Testimonial deleted', 'info');
      fetchTestimonials();
    } catch (err: any) {
      showToast('Failed to delete testimonial', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-salon-border/60 pb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-salon-cream">Customer Testimonials</h1>
          <p className="text-xs text-salon-muted">Approve or hide customer reviews displayed on home page</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-16 text-center text-xs text-salon-muted animate-pulse">
            Loading reviews...
          </div>
        ) : (
          testimonials.map((t) => (
            <div key={t._id} className="p-5 rounded-2xl glass-panel border border-salon-gold/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? 'text-salon-gold fill-salon-gold' : 'text-salon-border'}`}
                    />
                  ))}
                </div>
                <StatusBadge status={t.status} />
              </div>

              <p className="text-xs text-salon-cream/90 italic">"{t.review}"</p>

              <div className="flex items-center justify-between pt-2 border-t border-salon-border">
                <span className="font-bold text-xs text-salon-gold">{t.customerName}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(t._id)}
                    className="px-2.5 py-1 rounded-lg bg-salon-gold/15 text-salon-gold font-bold text-[10px]"
                  >
                    Toggle Status
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-1 rounded-lg bg-rose-500/20 text-rose-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
