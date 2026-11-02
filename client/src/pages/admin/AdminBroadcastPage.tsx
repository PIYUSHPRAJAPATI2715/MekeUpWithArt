import React, { useState, useEffect } from 'react';
import { broadcastApi } from '../../api';
import { IBroadcast } from '../../types';
import { useToast } from '../../components/common/Toast';
import { AIImageGeneratorModal } from '../../components/common/AIImageGeneratorModal';
import {
  MessageSquare,
  Send,
  Users,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Eye,
  RefreshCw,
  ExternalLink,
  PhoneCall,
  Search,
  Check,
} from 'lucide-react';

export const AdminBroadcastPage: React.FC = () => {
  const { showToast } = useToast();

  const [broadcasts, setBroadcasts] = useState<IBroadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalUniqueAudience: number;
    totalCustomers: number;
    totalBookings: number;
    totalContacts: number;
    status: { isWebReady: boolean; hasMetaConfigured: boolean; hasWaapiConfigured: boolean };
  } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState(
    'Hello {name}! ✨\n\nExclusive festive offer from {salon_name}! Enjoy a flat 20% discount on HD Airbrush Bridal Makeup, Hair Botox Spa & 3D Gel Nail Art this week.\n\n📍 Pillar No. 113, Shyam Nagar Metro Station, Jaipur\n📞 Call/WhatsApp: 9352769045 / 7575939735\n\nBook your chair online now!'
  );
  const [imageUrl, setImageUrl] = useState('');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'CUSTOMERS' | 'BOOKINGS' | 'CONTACTS' | 'CUSTOM'>('ALL');
  const [customNumbersInput, setCustomNumbersInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Detail Modal
  const [selectedBroadcast, setSelectedBroadcast] = useState<IBroadcast | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const fetchBroadcastData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        broadcastApi.getAll(),
        broadcastApi.getAudienceStats(),
      ]);
      if (listRes.data.success) setBroadcasts(listRes.data.data);
      if (statsRes.data.success) setStats(statsRes.data.data);
    } catch (err: any) {
      console.error(err);
      showToast('Failed to load broadcasts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcastData();
  }, []);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast('Title and message are required', 'error');
      return;
    }

    const customNumbers = customNumbersInput
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n.length >= 10);

    if (targetAudience === 'CUSTOM' && customNumbers.length === 0) {
      showToast('Please enter at least one valid phone number', 'error');
      return;
    }

    if (!confirm(`Are you sure you want to push this WhatsApp broadcast to all selected clients?`)) {
      return;
    }

    setIsSending(true);
    try {
      const res = await broadcastApi.send({
        title,
        message,
        imageUrl: imageUrl.trim() || undefined,
        targetAudience,
        customNumbers: targetAudience === 'CUSTOM' ? customNumbers : undefined,
      });

      if (res.data.success) {
        showToast(res.data.message || 'WhatsApp broadcast dispatched successfully!', 'success');
        setTitle('');
        setImageUrl('');
        fetchBroadcastData();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to dispatch broadcast', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteBroadcast = async (id: string) => {
    if (!confirm('Are you sure you want to delete this broadcast log?')) return;
    try {
      await broadcastApi.delete(id);
      showToast('Broadcast deleted', 'success');
      setBroadcasts((prev) => prev.filter((b) => b._id !== id));
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete broadcast', 'error');
    }
  };

  const handleInsertTag = (tag: string) => {
    setMessage((prev) => `${prev} ${tag}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-salon-cream flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-emerald-400" />
            WhatsApp Client Broadcast System
          </h1>
          <p className="text-xs sm:text-sm text-salon-muted">
            Upload images, craft personalized promotional campaigns, and broadcast instantly to all client WhatsApp numbers.
          </p>
        </div>

        <button
          onClick={fetchBroadcastData}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-salon-dark border border-salon-border text-salon-cream hover:border-salon-gold text-xs font-semibold transition-all"
        >
          <RefreshCw className="w-4 h-4 text-salon-gold" />
          Refresh Stats
        </button>
      </div>

      {/* Audience Reach Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-salon-border/60 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-salon-muted">Total Reachable</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-salon-cream">
            {stats?.totalUniqueAudience ?? 0}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold block">Unique WhatsApp contacts</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-salon-border/60 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-salon-muted">Registered Users</span>
            <CheckCircle2 className="w-4 h-4 text-salon-gold" />
          </div>
          <div className="text-2xl font-bold text-salon-cream">
            {stats?.totalCustomers ?? 0}
          </div>
          <span className="text-[11px] text-salon-muted block">Direct accounts</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-salon-border/60 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-salon-muted">Past Bookings</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-salon-cream">
            {stats?.totalBookings ?? 0}
          </div>
          <span className="text-[11px] text-salon-muted block">Client appointment phone numbers</span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-salon-border/60 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-salon-muted">Contact Inquiries</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-salon-cream">
            {stats?.totalContacts ?? 0}
          </div>
          <span className="text-[11px] text-salon-muted block">Website lead inquiries</span>
        </div>
      </div>

      {/* Main Composer & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Broadcast Form (2 Cols) */}
        <form
          onSubmit={handleSendBroadcast}
          className="lg:col-span-2 p-6 sm:p-8 rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-salon-border/60">
            <div>
              <h3 className="font-serif text-lg font-bold text-salon-cream">
                Compose New WhatsApp Broadcast
              </h3>
              <p className="text-xs text-salon-muted">
                Push special discounts, bridal offers, or salon announcements to customer smartphones.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              WhatsApp Engine Ready
            </span>
          </div>

          {/* Broadcast Title */}
          <div>
            <label className="block text-xs uppercase font-bold text-salon-muted mb-1.5">
              Broadcast Title / Internal Campaign Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Festive 20% Off Pre-Bridal & Groom Makeup"
              className="w-full px-4 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream placeholder-salon-muted/60 text-sm focus:outline-none focus:border-salon-gold"
            />
          </div>

          {/* Target Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-salon-muted mb-1.5">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e: any) => setTargetAudience(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream text-sm focus:outline-none focus:border-salon-gold"
              >
                <option value="ALL">All Unique Clients ({stats?.totalUniqueAudience ?? 0})</option>
                <option value="CUSTOMERS">Registered Customers ({stats?.totalCustomers ?? 0})</option>
                <option value="BOOKINGS">Past Bookings Clients ({stats?.totalBookings ?? 0})</option>
                <option value="CONTACTS">Website Inquiries ({stats?.totalContacts ?? 0})</option>
                <option value="CUSTOM">Custom Phone Number List</option>
              </select>
            </div>

            {targetAudience === 'CUSTOM' && (
              <div>
                <label className="block text-xs uppercase font-bold text-salon-muted mb-1.5">
                  Comma-Separated Numbers
                </label>
                <input
                  type="text"
                  placeholder="9352769045, 7575939735"
                  value={customNumbersInput}
                  onChange={(e) => setCustomNumbersInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream text-sm focus:outline-none focus:border-salon-gold"
                />
              </div>
            )}
          </div>

          {/* Image Upload / URL & AI Generator */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs uppercase font-bold text-salon-muted">
                Campaign Image (Optional)
              </label>
              <button
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="text-xs font-semibold text-salon-gold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 fill-salon-gold" />
                Generate AI Salon Image
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL or use AI generator..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream text-sm focus:outline-none focus:border-salon-gold"
              />
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="px-3 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Message Textarea & Variable Helper Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs uppercase font-bold text-salon-muted">
                WhatsApp Message Body *
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-salon-muted">Insert Tag:</span>
                <button
                  type="button"
                  onClick={() => handleInsertTag('{name}')}
                  className="px-2 py-0.5 rounded bg-salon-dark border border-salon-border text-salon-gold text-[10px] font-mono hover:border-salon-gold"
                >
                  {'{name}'}
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTag('{salon_name}')}
                  className="px-2 py-0.5 rounded bg-salon-dark border border-salon-border text-salon-gold text-[10px] font-mono hover:border-salon-gold"
                >
                  {'{salon_name}'}
                </button>
              </div>
            </div>
            <textarea
              required
              rows={7}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-salon-dark border border-salon-border text-salon-cream text-sm focus:outline-none focus:border-salon-gold leading-relaxed"
            />
          </div>

          {/* Submit / Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-salon-border/60">
            <div className="text-xs text-salon-muted">
              Personalized delivery with individual name greetings.
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Broadcasting to Clients...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Launch WhatsApp Broadcast
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Smartphone Preview Card (1 Col) */}
        <div className="space-y-4">
          <span className="text-xs uppercase font-bold text-salon-muted block text-center">
            Live WhatsApp Message Preview
          </span>
          <div className="rounded-[36px] bg-[#0c1317] border-4 border-neutral-700 p-4 shadow-2xl space-y-4 max-w-sm mx-auto">
            {/* WhatsApp Chat Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-800">
              <div className="w-9 h-9 rounded-full bg-salon-gold/20 border border-salon-gold flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover p-1" />
              </div>
              <div className="leading-tight">
                <div className="text-xs font-bold text-neutral-200">MAKEUP WITH ART Studio</div>
                <div className="text-[10px] text-emerald-400 font-semibold">Official Business Account</div>
              </div>
            </div>

            {/* Bubble */}
            <div className="bg-[#005c4b] rounded-2xl rounded-tl-sm p-3.5 space-y-2.5 text-neutral-100 shadow-md">
              {imageUrl && (
                <div className="rounded-xl overflow-hidden max-h-48 border border-black/20">
                  <img src={imageUrl} alt="Campaign Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-xs whitespace-pre-wrap leading-relaxed">
                {message.replace('{name}', 'Priya').replace('{salon_name}', 'MAKEUP WITH ART')}
              </p>
              <div className="text-[9px] text-neutral-300 text-right">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Past Broadcast History Table */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-salon-cream">
          Broadcast History & Delivery Reports
        </h3>

        <div className="rounded-2xl glass-panel border border-salon-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-salon-cream">
              <thead className="bg-salon-card/80 border-b border-salon-border uppercase tracking-wider text-[10px] text-salon-muted font-bold">
                <tr>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Campaign Title</th>
                  <th className="p-4">Image</th>
                  <th className="p-4">Audience</th>
                  <th className="p-4">Delivery Stats</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-salon-border/40">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-salon-muted">
                      Loading broadcast history...
                    </td>
                  </tr>
                ) : broadcasts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-salon-muted">
                      No broadcasts sent yet. Compose your first campaign above!
                    </td>
                  </tr>
                ) : (
                  broadcasts.map((b) => (
                    <tr key={b._id} className="hover:bg-salon-card/40 transition-colors">
                      <td className="p-4 text-salon-muted font-mono whitespace-nowrap">
                        {new Date(b.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 font-bold text-salon-cream">{b.title}</td>
                      <td className="p-4">
                        {b.imageUrl ? (
                          <img
                            src={b.imageUrl}
                            alt="Campaign"
                            className="w-10 h-10 object-cover rounded-lg border border-salon-border"
                          />
                        ) : (
                          <span className="text-[10px] text-salon-muted">Text Only</span>
                        )}
                      </td>
                      <td className="p-4 text-salon-muted font-semibold">{b.targetAudience}</td>
                      <td className="p-4">
                        <span className="text-emerald-400 font-bold">{b.sentCount} sent</span>
                        {b.failedCount > 0 && (
                          <span className="text-rose-400 font-bold ml-2">/ {b.failedCount} failed</span>
                        )}
                        <span className="text-salon-muted ml-1">({b.recipientCount} total)</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : b.status === 'SENDING'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBroadcast(b);
                            setDetailModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-salon-dark border border-salon-border text-salon-cream hover:text-salon-gold"
                          title="View Delivery Logs"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBroadcast(b._id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
                          title="Delete Log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Broadcast Log Details Modal */}
      {detailModalOpen && selectedBroadcast && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl p-6 rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-salon-border">
              <div>
                <h3 className="font-serif text-lg font-bold text-salon-cream">
                  Broadcast Delivery Log
                </h3>
                <span className="text-xs text-salon-gold">{selectedBroadcast.title}</span>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-2 rounded-xl bg-salon-dark text-salon-muted hover:text-salon-cream"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-salon-dark/80 border border-salon-border text-xs whitespace-pre-wrap leading-relaxed text-salon-cream/80 max-h-40 overflow-y-auto">
              {selectedBroadcast.message}
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2">
              <div className="text-xs uppercase font-bold text-salon-muted">
                Recipient Transmissions ({selectedBroadcast.logs?.length || 0})
              </div>
              {selectedBroadcast.logs && selectedBroadcast.logs.length > 0 ? (
                selectedBroadcast.logs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-salon-card border border-salon-border/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-salon-cream block">
                        {log.name || 'Valued Client'}
                      </span>
                      <span className="text-salon-muted font-mono">{log.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'SENT'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {log.status}
                      </span>
                      <a
                        href={`https://wa.me/91${log.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          selectedBroadcast.message.replace('{name}', log.name || 'Client')
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 text-[10px] font-semibold transition-colors flex items-center gap-1"
                        title="Open WhatsApp Web chat"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open Web
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-salon-muted">
                  No individual recipient logs found for this transmission.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Image Generator Modal */}
      <AIImageGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        category="Bridal Makeup"
        onSelectImage={(url: string) => {
          setImageUrl(url);
          setAiModalOpen(false);
          showToast('Campaign image selected from AI generator!', 'success');
        }}
      />
    </div>
  );
};
