import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, X, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { aiApi } from '../../api';
import { useToast } from './Toast';

interface AIImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  category?: string;
  defaultPrompt?: string;
}

export const AIImageGeneratorModal: React.FC<AIImageGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  category = 'Hair',
  defaultPrompt = '',
}) => {
  const { showToast } = useToast();
  const [prompt, setPrompt] = useState(defaultPrompt || `Luxury ${category.toLowerCase()} salon styling for Indian customer`);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('Please enter an image description prompt', 'error');
      return;
    }
    setIsGenerating(true);
    setGeneratedUrl(null);
    setStatusMessage(null);

    try {
      const res = await aiApi.generateImage(prompt, category);
      if (res.data.success) {
        setGeneratedUrl(res.data.imageUrl);
        setStatusMessage(res.data.status);
        showToast('AI Image generated successfully!', 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to generate AI image', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = () => {
    if (generatedUrl) {
      onSelectImage(generatedUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl p-6 overflow-hidden rounded-2xl glass-panel border border-salon-gold/30 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-salon-border">
            <div className="flex items-center gap-2 text-salon-gold">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <h3 className="text-xl font-serif font-bold text-salon-cream">AI Image Generator</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-salon-border transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-salon-muted font-medium mb-1.5">
                Image Style Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="e.g. Luxury bridal makeup with elegant Indian styling, editorial lighting"
                className="w-full px-3.5 py-2.5 rounded-xl bg-salon-dark/80 border border-salon-border text-salon-cream text-sm focus:outline-none focus:border-salon-gold transition-colors resize-none"
              />
              <p className="mt-1 text-xs text-salon-muted">
                System automatically appends luxury salon photography aesthetics, 8K resolution & Indian customer styling parameters.
              </p>
            </div>

            {/* Status / Preview */}
            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-12 space-y-3 bg-salon-dark/50 rounded-xl border border-salon-border/50">
                <Wand2 className="w-10 h-10 text-salon-gold animate-bounce" />
                <p className="text-sm font-medium text-salon-gold animate-pulse">
                  Synthesizing High-Fashion Salon Visual...
                </p>
                <p className="text-xs text-salon-muted">Connecting to DALL-E AI Engine</p>
              </div>
            )}

            {generatedUrl && !isGenerating && (
              <div className="space-y-2">
                <div className="relative group overflow-hidden rounded-xl border border-salon-gold/40 max-h-72">
                  <img
                    src={generatedUrl}
                    alt="AI Generated"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-xs text-salon-cream">Click Accept to use this image in your service/package</p>
                  </div>
                </div>
                {statusMessage && (
                  <div className="flex items-center gap-2 text-xs text-salon-gold/80 bg-salon-gold/10 p-2.5 rounded-lg border border-salon-gold/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-salon-border">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-salon-muted hover:text-white transition-colors"
            >
              Cancel
            </button>

            {generatedUrl ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-salon-border hover:bg-salon-border/80 text-salon-cream text-xs font-semibold transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </button>
                <button
                  onClick={handleAccept}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-bold shadow-lg hover:shadow-salon-gold/20 transition-all"
                >
                  <Check className="w-4 h-4" />
                  Accept Image
                </button>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-salon-gold-dark via-salon-gold to-salon-gold-light text-salon-dark text-xs font-bold shadow-lg hover:shadow-salon-gold/20 transition-all"
              >
                <Wand2 className="w-4 h-4" />
                GENERATE AI IMAGE
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
