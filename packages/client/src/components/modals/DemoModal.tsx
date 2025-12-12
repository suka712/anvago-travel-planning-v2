import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Button, Card } from '@/components/ui';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const demoSlides = [
  {
    title: 'Welcome to Anvago',
    description: 'Your AI-powered travel companion for Vietnam',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
    features: ['AI-generated itineraries', 'Local insights', 'Live navigation'],
  },
  {
    title: 'Smart Onboarding',
    description: 'Tell us your travel style in 2 minutes',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    features: ['Swipe to discover vibes', 'Pick your persona', 'Set your pace'],
  },
  {
    title: 'AI Trip Planning',
    description: 'Get personalized itineraries instantly',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    features: ['Match score for each trip', 'Weather-aware planning', 'Budget optimization'],
  },
  {
    title: 'Live Trip Tracking',
    description: 'Navigate your adventure with ease',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
    features: ['Real-time navigation', 'Smart rerouting', 'Grab integration'],
  },
];

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % demoSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + demoSlides.length) % demoSlides.length);
  };

  // Auto-advance slides
  useState(() => {
    if (isOpen && isPlaying) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  });

  if (!isOpen) return null;

  const slide = demoSlides[currentSlide];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-4xl"
        >
          <Card padding="none" className="overflow-hidden">
            {/* Video/Image Area */}
            <div className="relative aspect-video bg-black">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={slide.image}
                  alt={slide.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
                  <p className="text-lg text-white/80 mb-4">{slide.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {slide.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Controls */}
              <div className="absolute top-4 left-4 flex gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-4 bg-white">
              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mb-4">
                {demoSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      idx === currentSlide ? 'bg-[#4FC3F7]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                >
                  Previous
                </Button>
                
                <span className="text-sm text-gray-500">
                  {currentSlide + 1} / {demoSlides.length}
                </span>

                {currentSlide === demoSlides.length - 1 ? (
                  <Button onClick={onClose}>
                    Start Planning
                  </Button>
                ) : (
                  <Button onClick={nextSlide}>
                    Next
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

