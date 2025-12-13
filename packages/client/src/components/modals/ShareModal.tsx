import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Link, Copy, Check, Mail, MessageCircle, 
  Facebook, Download, QrCode, Share2
} from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  shareUrl?: string;
  itineraryId?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  description,
  shareUrl = window.location.href,
  itineraryId,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (platform: string) => {
    const text = `Check out my trip: ${title}`;
    
    switch (platform) {
      case 'native':
        if (navigator.share) {
          await navigator.share({
            title,
            text: description || text,
            url: shareUrl,
          });
        }
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description || text + '\n\n' + shareUrl)}`, '_blank');
        break;
    }
  };

  const handleExport = (format: 'pdf' | 'calendar' | 'json') => {
    // In real implementation, would call API to generate export
    console.log(`Exporting as ${format} for itinerary ${itineraryId}`);
    
    // Simulate download
    const data = {
      title,
      description,
      exportedAt: new Date().toISOString(),
      format,
    };
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#4FC3F7]" />
                Share Trip
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Copy Link */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Share Link</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={shareUrl}
                    readOnly
                    leftIcon={<Link className="w-4 h-4" />}
                  />
                </div>
                <Button
                  variant={copied ? 'primary' : 'secondary'}
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Share via</label>
              <div className="grid grid-cols-4 gap-3">
                {'share' in navigator && (
                  <button
                    onClick={() => handleShare('native')}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-[#4FC3F7]/10 rounded-full flex items-center justify-center">
                      <Share2 className="w-6 h-6 text-[#4FC3F7]" />
                    </div>
                    <span className="text-xs">Share</span>
                  </button>
                )}
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs">WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Facebook className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs">Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-gray-600" />
                  </div>
                  <span className="text-xs">Email</span>
                </button>
              </div>
            </div>

            {/* Export Options */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium mb-3">Export As</label>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => handleExport('pdf')}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  PDF
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => handleExport('calendar')}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Calendar
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => handleExport('json')}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  JSON
                </Button>
              </div>
            </div>

            {/* QR Code Toggle */}
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full mt-4 py-3 text-center text-sm text-[#2196F3] hover:underline flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              {showQR ? 'Hide QR Code' : 'Show QR Code'}
            </button>

            {/* QR Code */}
            <AnimatePresence>
              {showQR && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 flex justify-center">
                    {/* Placeholder QR - in real app would use qrcode library */}
                    <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">QR Code</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

