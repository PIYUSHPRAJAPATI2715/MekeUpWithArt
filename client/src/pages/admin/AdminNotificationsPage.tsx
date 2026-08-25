import React, { useState } from 'react';
import { notificationApi } from '../../api';
import { useToast } from '../../components/common/Toast';
import { Bell, Send, Mail, MessageSquare } from 'lucide-react';

export const AdminNotificationsPage: React.FC = () => {
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<'Web' | 'Email' | 'WhatsApp'>('Web');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'CUSTOMERS'>('CUSTOMERS');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      showToast('Title and message are required', 'error');
      return;
    }

    setIsSending(true);
    try {
      const res = await notificationApi.broadcast({
        title,
        message,
        channel,
        targetAudience,
      });

      if (res.data.success) {
        showToast(res.data.message, 'success');
        setTitle('');
        setMessage('');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to dispatch notification', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-salon-border/60 pb-4">
        <h1 className="font-serif text-2xl font-bold text-salon-cream">Broadcast Center</h1>
        <p className="text-xs text-salon-muted">
          Send promotional announcements or booking reminders via In-App, Email & Meta WhatsApp API
        </p>
      </div>

      <form onSubmit={handleSend} className="p-8 rounded-3xl glass-panel border border-salon-gold/30 space-y-4 text-xs shadow-2xl">
        <div>
          <label className="block uppercase font-bold text-salon-muted mb-1.5">Notification Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Exclusive Festival Glam Offer - 20% Off"
            className="w-full px-4 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream focus:outline-none focus:border-salon-gold"
          />
        </div>

        <div>
          <label className="block uppercase font-bold text-salon-muted mb-1.5">Message Content</label>
          <textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Book your hair keratin spa or HD bridal session this weekend and receive a complimentary Hydra Facial session..."
            className="w-full px-4 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream focus:outline-none focus:border-salon-gold resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1.5">Delivery Channel</label>
            <select
              value={channel}
              onChange={(e: any) => setChannel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
            >
              <option value="Web">In-App Notification Bell</option>
              <option value="Email">Email Broadcast (SMTP)</option>
              <option value="WhatsApp">WhatsApp Meta Cloud API</option>
            </select>
          </div>

          <div>
            <label className="block uppercase font-bold text-salon-muted mb-1.5">Target Segment</label>
            <select
              value={targetAudience}
              onChange={(e: any) => setTargetAudience(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream"
            >
              <option value="CUSTOMERS">All Salon Customers</option>
              <option value="ALL">All Accounts (Customers + Staff)</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSending}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-extrabold uppercase tracking-wider shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSending ? 'DISPATCHING...' : 'SEND BROADCAST NOW'}
          </button>
        </div>
      </form>
    </div>
  );
};
