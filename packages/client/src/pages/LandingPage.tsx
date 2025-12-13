import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Clock,
  Navigation,
  CloudSun,
  Car,
  ArrowRight,
  Star,
  Zap,
  Heart
} from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-[#4FC3F7]/20 via-[#FAFAF8] to-[#81D4FA]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 border-black shadow-[3px_3px_0px_#000] mb-6">
                <Sparkles className="w-4 h-4 text-[#4FC3F7]" />
                <span className="text-sm font-medium">AI-Powered Travel Planning</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Travel the world
                <span className="block text-[#2196F3]">your way</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-xl">
                Discover personalized itineraries, live routing, and seamless transportation — 
                all powered by AI that thinks like a local.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/discover">
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Start Your Adventure
                  </Button>
                </Link>
                <Link to="/discover">
                  <Button variant="secondary" size="lg">
                    See How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-10 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>4.9 rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>10k+ travelers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-[#4FC3F7]" />
                  <span>Grab integrated</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Hero Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <Card className="p-0 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800"
                  alt="Marble Mountains, Danang"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">Marble Mountains, Danang</p>
                        <p className="text-sm text-gray-600">Day 1 • 2:00 PM</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                          On Schedule
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white rounded-xl border-2 border-black p-3 shadow-[4px_4px_0px_#000]"
              >
                <div className="flex items-center gap-2">
                  <CloudSun className="w-6 h-6 text-yellow-500" />
                  <div>
                    <p className="text-sm font-bold">28°C</p>
                    <p className="text-xs text-gray-500">Perfect weather!</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 bg-[#4FC3F7] rounded-xl border-2 border-black p-3 shadow-[4px_4px_0px_#000]"
              >
                <div className="flex items-center gap-2">
                  <Car className="w-6 h-6" />
                  <div>
                    <p className="text-sm font-bold">Grab arriving</p>
                    <p className="text-xs">3 min away</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why travelers love Anvago</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From planning to exploring, we've reimagined every step of your journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card hoverable>
              <div className="w-12 h-12 bg-[#4FC3F7]/20 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#2196F3]" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Planning</h3>
              <p className="text-gray-600">
                Tell us your vibe, and our AI creates personalized itineraries that match your style, budget, and interests.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card hoverable>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <CloudSun className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Weather-Smart Routes</h3>
              <p className="text-gray-600">
                Real-time weather integration adjusts your plans automatically. Rain coming? We'll suggest indoor alternatives.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card hoverable>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Navigation className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Live Tracking</h3>
              <p className="text-gray-600">
                Follow your journey in real-time with smart notifications and automatic schedule adjustments.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card hoverable>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                <Car className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Seamless Transport</h3>
              <p className="text-gray-600">
                Book Grab rides directly from your itinerary. No app switching, no hassle — just smooth travel.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card hoverable>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Local Gems</h3>
              <p className="text-gray-600">
                Discover Anva-verified spots that locals love. Skip the tourist traps, find authentic experiences.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card hoverable>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Adaptive Schedule</h3>
              <p className="text-gray-600">
                Enjoying a spot longer? We'll automatically adjust your schedule and suggest what to skip.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Your adventure in 3 steps</h2>
            <p className="text-xl text-gray-600">From zero to itinerary in under 2 minutes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#4FC3F7] rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Tell us your vibe</h3>
              <p className="text-gray-600">
                Answer fun questions about your travel style. Swipe through destinations, pick your interests.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#4FC3F7] rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Get your itinerary</h3>
              <p className="text-gray-600">
                Our AI generates personalized plans considering weather, traffic, and your preferences.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#4FC3F7] rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Explore & enjoy</h3>
              <p className="text-gray-600">
                Follow your trip with live guidance, book transportation, and let Anvago handle the logistics.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/discover">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Start Planning Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#4FC3F7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to explore Danang?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who've discovered their perfect trip with Anvago.
          </p>
          <Link to="/discover">
            <Button 
              variant="secondary" 
              size="lg" 
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Start Your Free Adventure
            </Button>
          </Link>
          <p className="text-sm mt-4 opacity-75">No credit card required • Free to explore</p>
        </div>
      </section>
    </div>
  );
}

