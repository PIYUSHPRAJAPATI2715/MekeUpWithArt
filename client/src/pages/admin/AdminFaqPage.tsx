import React, { useState, useEffect } from 'react';
import { faqApi } from '../../api';
import { IFAQ } from '../../types';
import { useToast } from '../../components/common/Toast';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const AdminFaqPage: React.FC = () => {
  const { showToast } = useToast();

  const [faqs, setFaqs] = useState<IFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<IFAQ | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [order, setOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'General',
    'Bridal & Groom',
    'Hair & Styling',
    'Skin & Facials',
    'Nail Art & Lashes',
    'Appointments & Pricing',
  ];

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await faqApi.getAdmin();
      if (res.data.success && Array.isArray(res.data.data)) {
        setFaqs(res.data.data);
      }
    } catch (err: any) {
      console.error(err);
      showToast('Failed to load FAQs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setOrder(faqs.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (faq: IFAQ) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setOrder(faq.order ?? 0);
    setIsActive(faq.isActive);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      showToast('Question and answer are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingFaq) {
        const res = await faqApi.update(editingFaq._id, {
          question,
          answer,
          category,
          order,
          isActive,
        });
        if (res.data.success) {
          showToast('FAQ updated successfully!', 'success');
          setModalOpen(false);
          fetchFaqs();
        }
      } else {
        const res = await faqApi.create({
          question,
          answer,
          category,
          order,
          isActive,
        });
        if (res.data.success) {
          showToast('FAQ created successfully!', 'success');
          setModalOpen(false);
          fetchFaqs();
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save FAQ', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await faqApi.delete(id);
      showToast('FAQ deleted successfully', 'success');
      setFaqs((prev) => prev.filter((f) => f._id !== id));
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete FAQ', 'error');
    }
  };

  const handleToggleActive = async (faq: IFAQ) => {
    try {
      const res = await faqApi.update(faq._id, { isActive: !faq.isActive });
      if (res.data.success) {
        setFaqs((prev) =>
          prev.map((f) => (f._id === faq._id ? { ...f, isActive: !f.isActive } : f))
        );
        showToast(`FAQ marked as ${!faq.isActive ? 'Active' : 'Inactive'}`, 'success');
      }
    } catch (err: any) {
      showToast('Failed to update FAQ status', 'error');
    }
  };

  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-salon-cream flex items-center gap-2.5">
            <HelpCircle className="w-7 h-7 text-salon-gold" />
            FAQ & Knowledge Manager
          </h1>
          <p className="text-xs sm:text-sm text-salon-muted">
            Manage frequently asked questions displayed on the customer FAQ page and boost salon SEO rankings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFaqs}
            className="p-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream hover:border-salon-gold text-xs transition-all"
            title="Refresh FAQs"
          >
            <RefreshCw className="w-4 h-4 text-salon-gold" />
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-salon-gold hover:bg-salon-gold/90 text-salon-dark font-bold text-xs uppercase tracking-wider shadow-lg shadow-salon-gold/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add New FAQ
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-salon-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs by keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-salon-card/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-salon-card/80 border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
          >
            <option value="All">All Categories ({faqs.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQs Table */}
      <div className="rounded-2xl glass-panel border border-salon-border/60 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-salon-cream">
            <thead className="bg-salon-card/80 border-b border-salon-border uppercase tracking-wider text-[10px] text-salon-muted font-bold">
              <tr>
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">Category</th>
                <th className="p-4">Question</th>
                <th className="p-4">Answer Preview</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-salon-border/40">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-salon-muted">
                    Loading FAQs...
                  </td>
                </tr>
              ) : filteredFaqs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-salon-muted">
                    No FAQs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredFaqs.map((faq, idx) => (
                  <tr key={faq._id} className="hover:bg-salon-card/40 transition-colors">
                    <td className="p-4 text-center text-salon-muted font-mono">{faq.order ?? idx + 1}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-salon-gold/10 text-salon-gold border border-salon-gold/20 whitespace-nowrap">
                        {faq.category}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-salon-cream max-w-xs">{faq.question}</td>
                    <td className="p-4 text-salon-muted max-w-md truncate">{faq.answer}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleActive(faq)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          faq.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {faq.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(faq)}
                        className="p-1.5 rounded-lg bg-salon-dark border border-salon-border text-salon-cream hover:text-salon-gold"
                        title="Edit Question"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq._id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
                        title="Delete Question"
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

      {/* Add / Edit FAQ Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl p-6 rounded-3xl glass-panel border border-salon-gold/30 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-salon-border">
              <h3 className="font-serif text-lg font-bold text-salon-cream">
                {editingFaq ? 'Edit FAQ Item' : 'Create New FAQ Item'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl bg-salon-dark text-salon-muted hover:text-salon-cream"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-salon-muted mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-salon-muted mb-1.5">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. How far in advance should I book bridal makeup?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-salon-muted mb-1.5">
                  Answer *
                </label>
                <textarea
                  required
                  rows={5}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Provide detailed, helpful salon answers..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-salon-muted mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark border border-salon-border text-salon-cream text-xs focus:outline-none focus:border-salon-gold"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-salon-cream">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-salon-gold accent-salon-gold bg-salon-dark border-salon-border"
                    />
                    Display on Public FAQ Page
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-salon-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-salon-dark text-salon-muted hover:text-salon-cream text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-xl bg-salon-gold hover:bg-salon-gold/90 text-salon-dark font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingFaq ? 'Save Changes' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
