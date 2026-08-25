import React from 'react';

interface BadgeProps {
  status: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
  let style = 'bg-gray-500/10 text-gray-400 border-gray-500/20';

  if (status === 'Confirmed' || status === 'Active' || status === 'Approved') {
    style = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (status === 'Pending') {
    style = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (status === 'Completed') {
    style = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
  } else if (status === 'Cancelled' || status === 'Inactive') {
    style = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (status === 'No-Show') {
    style = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border ${style}`}>
      {status}
    </span>
  );
};
