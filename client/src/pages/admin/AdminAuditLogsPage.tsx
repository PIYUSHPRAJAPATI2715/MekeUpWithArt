import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { IAuditLog } from '../../types';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    adminApi
      .getAuditLogs()
      .then((res) => {
        if (res.data.success) setLogs(res.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-salon-border/60 pb-4">
        <h1 className="font-serif text-2xl font-bold text-salon-cream">System Audit Trail</h1>
        <p className="text-xs text-salon-muted">Security and operational audit history of all admin actions</p>
      </div>

      <div className="rounded-2xl glass-panel border border-salon-gold/20 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-salon-dark/80 text-salon-gold uppercase font-bold text-[10px] tracking-wider border-b border-salon-border">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Admin Email</th>
              <th className="p-4">Action</th>
              <th className="p-4">Entity</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-salon-border/40 text-salon-cream">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-salon-muted animate-pulse">Loading audit logs...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-salon-muted">No audit logs recorded yet.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-salon-card/50 transition-colors">
                  <td className="p-4 text-salon-muted">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="p-4 font-bold text-salon-gold">{log.adminEmail}</td>
                  <td className="p-4 font-bold uppercase text-[10px] text-sky-300">{log.action}</td>
                  <td className="p-4">{log.entity}</td>
                  <td className="p-4 text-salon-muted">{log.details || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
