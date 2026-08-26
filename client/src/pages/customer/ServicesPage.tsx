import React, { useState, useEffect } from 'react';
import { serviceApi } from '../../api';
import { IService } from '../../types';
import { ServiceCard } from '../../components/customer/ServiceCard';
import { ServiceCardSkeleton } from '../../components/common/SkeletonLoader';
import { BookingModal } from '../../components/customer/BookingModal';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('popular');

  // Booking Modal
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);

  const categories = ['All', 'Bridal Makeup', 'Groom Makeup', 'Hair Art', 'Nail Art', 'Skin', 'Eyelashes', 'Other'];

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await serviceApi.getAll({
        category: activeCategory,
        search,
        sort,
      });
      if (res.data.success) {
        setServices(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [activeCategory, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  const handleBookNow = (service: IService) => {
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-salon-gold inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 fill-salon-gold" />
          Unisex Salon Catalogue
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-salon-cream">
          Services & Couture Pricing
        </h1>
        <p className="text-sm text-salon-muted">
          Explore our complete menu of master haircuts, keratin spas, hydra skin treatments, HD bridal makeup, gel nails & lashes.
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-salon-gold/20 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                activeCategory === cat
                  ? 'bg-salon-gold text-salon-dark shadow-md shadow-salon-gold/20'
                  : 'bg-salon-dark/80 text-salon-cream/80 hover:text-salon-gold border border-salon-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold transition-colors"
            />
            <Search className="w-4 h-4 text-salon-muted absolute left-3 top-2.5" />
          </form>

          <div className="relative shrink-0">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
            >
              <option value="popular">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <SlidersHorizontal className="w-10 h-10 text-salon-muted mx-auto" />
          <h3 className="font-serif text-lg font-bold text-salon-cream">No Services Found</h3>
          <p className="text-xs text-salon-muted">
            Try adjusting your search criteria or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} onBookNow={handleBookNow} />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        item={selectedService}
        itemType="service"
      />
    </div>
  );
};
