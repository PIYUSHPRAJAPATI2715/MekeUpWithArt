import React, { useState, useEffect } from 'react';
import { packageApi } from '../../api';
import { IPackage } from '../../types';
import { PackageCard } from '../../components/customer/PackageCard';
import { BookingModal } from '../../components/customer/BookingModal';
import { Sparkles, Tag } from 'lucide-react';

export const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedPackage, setSelectedPackage] = useState<IPackage | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);

  useEffect(() => {
    packageApi
      .getAll()
      .then((res) => {
        if (res.data.success) {
          setPackages(res.data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleBookNow = (pkg: IPackage) => {
    setSelectedPackage(pkg);
    setBookingModalOpen(true);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-salon-gold inline-flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-salon-gold" />
          Exclusive Bundles & Pamper Deals
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-salon-cream">
          Signature Salon Packages
        </h1>
        <p className="text-sm text-salon-muted">
          Indulge in our curated head-to-toe beauty packages. Save up to 40% when bundling bridal makeup, hair keratin, hydra facials & nail extensions.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-salon-card/40 animate-pulse" />
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="py-16 text-center text-xs text-salon-muted">
          No special packages available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} onBookNow={handleBookNow} />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        item={selectedPackage}
        itemType="package"
      />
    </div>
  );
};
