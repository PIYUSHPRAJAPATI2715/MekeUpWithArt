import React, { useState, useEffect } from 'react';
import { contactApi } from '../../api';
import { useToast } from '../../components/common/Toast';
import { Mail, CheckCircle2, Phone } from 'lucide-react';

export const AdminMessagesPage: React.FC = () => {
  const { showToast } = useToast();

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await contactApi.getAllAdmin();
      if (res.data.success) setMessages(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await contactApi.markRead(id);
      showToast('Marked as read', 'success');
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-salon-border/60 pb-4">
        <h1 className="font-serif text-2xl font-bold text-salon-cream">Contact Inquiries</h1>
        <p className="text-xs text-salon-muted">Client messages submitted from the contact page form</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-salon-muted animate-pulse">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-xs text-salon-muted">No inquiry messages received yet.</div>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={`p-6 rounded-2xl glass-panel border space-y-3 ${
                m.status === 'Unread' ? 'border-salon-gold/40 bg-salon-card/80' : 'border-salon-border/40 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-salon-cream text-sm">{m.name}</h4>
                  <p className="text-xs text-salon-gold flex items-center gap-2">
                    <span>{m.email}</span> • <span>{m.phone}</span>
                  </p>
                </div>
                <span className="text-[10px] text-salon-muted">{new Date(m.createdAt).toLocaleString()}</span>
              </div>

              <p className="text-xs text-salon-cream/90 bg-salon-dark/50 p-3 rounded-xl">{m.message}</p>

              {m.status === 'Unread' && (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleMarkRead(m._id)}
                    className="px-3 py-1 rounded-lg bg-salon-gold/15 text-salon-gold text-[10px] font-bold"
                  >
                    Mark as Read
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
