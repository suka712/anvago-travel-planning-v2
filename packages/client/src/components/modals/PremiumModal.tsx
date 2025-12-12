import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Sparkles, Zap, Star, Shield } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string; // Which feature triggered the modal
}

const premiumFeatures = [
  {
    icon: Sparkles,
    title: 'Go AI Optimization',
    description: 'Let AI optimize your route, budget, and timing',
  },
  {
    icon: Zap,
    title: 'Smart Search',
    description: 'Find perfect replacements by radius, budget, or category',
  },
  {
    icon: Star,
    title: 'Local Gems',
    description: 'Access Anva-verified authentic local spots',
  },
  {
    icon: Shield,
    title: 'Priority Support',
    description: '24/7 support for all your travel needs',
  },
];

export default function PremiumModal({ isOpen, onClose, feature }: PremiumModalProps) {
  const handleUpgrade = () => {
    // In real app, would redirect to payment flow
    console.log('Upgrading to premium');
    onClose();
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
          className="w-full max-w-lg"
        >
          <Card className="overflow-hidden">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white p-8 -m-6 mb-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Crown className="w-10 h-10" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-center mb-2">Unlock Premium</h2>
              <p className="text-center text-white/80">
                {feature 
                  ? `Access ${feature} and all premium features`
                  : 'Get the most out of your travel experience'}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-6">
              {premiumFeatures.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                </motion.div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-4xl font-black">$9.99</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-center text-sm text-gray-500">
                Cancel anytime • 7-day free trial
              </p>
            </div>

            {/* CTA */}
            <div className="space-y-3">
              <Button fullWidth size="lg" onClick={handleUpgrade}>
                <Crown className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <button
                onClick={onClose}
                className="w-full py-2 text-center text-sm text-gray-500 hover:text-gray-700"
              >
                Maybe later
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex justify-center gap-4 mt-6 pt-6 border-t">
              <Badge variant="ghost" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Secure Payment
              </Badge>
              <Badge variant="ghost" className="text-xs">
                <Check className="w-3 h-3 mr-1" />
                Cancel Anytime
              </Badge>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

