import React from 'react';

export const ServiceCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl glass-panel p-4 border border-salon-border animate-pulse space-y-4">
      <div className="w-full h-48 bg-salon-border/40 rounded-xl" />
      <div className="space-y-2">
        <div className="w-1/3 h-3 bg-salon-gold/20 rounded" />
        <div className="w-3/4 h-5 bg-salon-border/60 rounded" />
        <div className="w-full h-3 bg-salon-border/30 rounded" />
        <div className="w-5/6 h-3 bg-salon-border/30 rounded" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="w-20 h-6 bg-salon-gold/30 rounded" />
        <div className="w-24 h-8 bg-salon-border rounded-xl" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-salon-border/40">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-salon-border/50 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
};
