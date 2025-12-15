import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, RefreshCw, Map, Clock, DollarSign, Cloud, Sun, CloudRain,
  MapPin, Star, Calendar, Bike,
  Lock, User, LayoutGrid, Check, ArrowRight
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import Header from '@/components/layouts/Header';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useAuthStore } from '@/stores/authStore';
import { itinerariesAPI } from '@/services/api';

// Mock generated itineraries
const mockItineraries = [
  {
    id: '1',
    name: 'Beach & Culture Explorer',
    description: 'Perfect blend of relaxation and discovery',
    matchScore: 95,
    duration: 3,
    estimatedCost: 2500000,
    highlights: ['My Khe Beach', 'Marble Mountains', 'Han Market'],
    tags: ['beach', 'culture', 'food'],
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600',
    days: [
      {
        day: 1,
        title: 'Beach Vibes & Local Flavors',
        activities: [
          { time: '7:00', name: 'Sunrise at My Khe Beach', type: 'beach', duration: '2h' },
          { time: '9:30', name: 'Breakfast at Bánh Mì Bà Lan', type: 'food', duration: '1h' },
          { time: '11:00', name: 'Explore Han Market', type: 'shopping', duration: '2h' },
          { time: '14:00', name: 'Lunch at Madame Lan', type: 'food', duration: '1.5h' },
          { time: '16:00', name: 'Relax at Beach Club', type: 'beach', duration: '3h' },
          { time: '19:30', name: 'Seafood dinner at Bé Mặn', type: 'food', duration: '2h' },
        ],
      },
      {
        day: 2,
        title: 'Mountains & Mysticism',
        activities: [
          { time: '6:00', name: 'Marble Mountains sunrise', type: 'nature', duration: '4h' },
          { time: '11:00', name: 'Brunch at The Fig', type: 'food', duration: '1.5h' },
          { time: '13:00', name: 'Non Nuoc Stone Village', type: 'culture', duration: '2h' },
          { time: '15:30', name: 'Cham Museum', type: 'museum', duration: '2h' },
          { time: '18:00', name: 'Dragon Bridge show', type: 'attraction', duration: '1h' },
          { time: '20:00', name: 'Rooftop bar sunset', type: 'nightlife', duration: '2h' },
        ],
      },
      {
        day: 3,
        title: 'Peninsula Adventure',
        activities: [
          { time: '5:30', name: 'Son Tra Peninsula drive', type: 'nature', duration: '3h' },
          { time: '9:00', name: 'Linh Ung Pagoda', type: 'temple', duration: '1.5h' },
          { time: '11:00', name: 'Brunch at Bảo Ngư', type: 'food', duration: '1.5h' },
          { time: '13:00', name: 'Free time / Shopping', type: 'leisure', duration: '3h' },
          { time: '16:30', name: 'Coffee at 43 Factory', type: 'cafe', duration: '1.5h' },
          { time: '18:30', name: 'Farewell dinner', type: 'food', duration: '2h' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Foodie Paradise Trail',
    description: 'A culinary journey through Danang',
    matchScore: 88,
    duration: 3,
    estimatedCost: 2200000,
    highlights: ['Street Food Tour', 'Cooking Class', 'Night Markets'],
    tags: ['food', 'local', 'culture'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
    days: [],
  },
  {
    id: '3',
    name: 'Adventure Seeker\'s Dream',
    description: 'Action-packed exploration',
    matchScore: 82,
    duration: 3,
    estimatedCost: 3500000,
    highlights: ['Ba Na Hills', 'Water Sports', 'Jungle Trek'],
    tags: ['adventure', 'nature', 'photography'],
    image: 'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?w=600',
    days: [],
  },
];

type ItineraryDisplay = typeof mockItineraries[0] & { matchScore?: number };
type ViewMode = 'suggested' | 'all';

// Weather icon mapper
const getWeatherIcon = (condition: string) => {
  if (condition.toLowerCase().includes('rain')) return CloudRain;
  if (condition.toLowerCase().includes('sun') || condition.toLowerCase().includes('clear')) return Sun;
  return Cloud;
};

export default function Results() {
  const navigate = useNavigate();
  const { answers, reset } = useOnboardingStore();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItinerary, setSelectedItinerary] = useState<ItineraryDisplay | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [suggestedItineraries, setSuggestedItineraries] = useState<ItineraryDisplay[]>([]);
  const [allItineraries, setAllItineraries] = useState<ItineraryDisplay[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('suggested');
  const [_error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number>(1);

  // Weather data
  const weather = {
    condition: 'Partly Cloudy',
    temp: 28,
    advisory: 'Great for outdoor activities',
  };
  const WeatherIcon = getWeatherIcon(weather.condition);

  // Map API template to display format
  const mapTemplateToDisplay = (template: any, idx: number): ItineraryDisplay => ({
    id: template.itinerary?.id || template.id || `template-${idx}`,
    name: template.name || template.itinerary?.title || 'Untitled',
    description: template.tagline || template.description || template.itinerary?.description || '',
    matchScore: template.matchScore || 0,
    duration: template.durationDays || template.itinerary?.durationDays || 3,
    estimatedCost: template.itinerary?.estimatedBudget || 2500000,
    highlights: template.highlights || [],
    tags: template.badges || [],
    image: template.coverImage || template.itinerary?.coverImage || mockItineraries[idx % mockItineraries.length].image,
    days: template.itinerary?.items?.reduce((acc: any[], item: any) => {
      const dayIdx = (item.dayNumber || 1) - 1;
      if (!acc[dayIdx]) {
        acc[dayIdx] = {
          day: item.dayNumber || 1,
          title: `Day ${item.dayNumber || 1}`,
          activities: [],
        };
      }
      acc[dayIdx].activities.push({
        time: item.startTime || '09:00',
        name: item.location?.name || 'Activity',
        type: item.location?.category || 'activity',
        duration: item.location?.avgDurationMins ? `${item.location.avgDurationMins}min` : '1h',
      });
      return acc;
    }, []) || [],
  });

  useEffect(() => {
    const fetchItineraries = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const city = answers.destination || 'Danang';
        const [suggestedRes, allRes] = await Promise.all([
          itinerariesAPI.getSuggestedTemplates({
            city,
            personas: answers.personas || [],
            vibes: answers.vibesLiked || [],
            budget: answers.budgetLevel,
            interests: answers.interests || [],
            duration: answers.duration,
          }),
          itinerariesAPI.getTemplates(city),
        ]);

        const suggestedTemplates = suggestedRes.data.data || [];
        const allTemplates = allRes.data.data || [];

        if (suggestedTemplates.length > 0) {
          const mappedSuggested = suggestedTemplates.map(mapTemplateToDisplay);
          setSuggestedItineraries(mappedSuggested);
          setSelectedItinerary(mappedSuggested[0]);
        } else {
          setSuggestedItineraries(mockItineraries);
          setSelectedItinerary(mockItineraries[0]);
        }

        if (allTemplates.length > 0) {
          const mappedAll = allTemplates.map(mapTemplateToDisplay);
          setAllItineraries(mappedAll);
        } else {
          setAllItineraries(mockItineraries);
        }
      } catch (err) {
        console.error('Failed to fetch itineraries:', err);
        setSuggestedItineraries(mockItineraries);
        setAllItineraries(mockItineraries);
        setSelectedItinerary(mockItineraries[0]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItineraries();
  }, [answers]);

  const displayedItineraries = viewMode === 'suggested' ? suggestedItineraries : allItineraries;

  const handleReroll = () => {
    reset();
    navigate('/discover');
  };

  const handleAction = (action: 'customize' | 'schedule' | 'go') => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (action === 'customize') {
      navigate(`/plan/${selectedItinerary?.id}`);
    } else if (action === 'schedule') {
      navigate(`/itinerary/${selectedItinerary?.id}?schedule=true`);
    } else {
      navigate(`/trip/${selectedItinerary?.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <Card className="py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-6"
            >
              <Sparkles className="w-full h-full text-sky-primary" />
            </motion.div>
            <h2 className="text-xl font-bold mb-2">Creating Your Perfect Trip</h2>
            <p className="text-gray-600 text-sm mb-6">Analyzing preferences & local insights</p>

            <div className="space-y-2 text-left">
              {['Finding best locations', 'Checking weather patterns', 'Optimizing routes', 'Adding local gems'].map((text, idx) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.4 }}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Check className="w-4 h-4 text-green-500" />
                  {text}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <Header />

      {/* Trip Info Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-lg font-bold">{answers.destination || 'Danang'}</h1>
                <p className="text-sm text-gray-500">
                  {answers.duration || 3} days • {answers.activityLevel || 'balanced'} pace
                </p>
              </div>
              {/* Compact Weather Indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-sky-primary/10 rounded-full">
                <WeatherIcon className="w-4 h-4 text-sky-primary" />
                <span className="text-sm font-medium">{weather.temp}°C</span>
                <span className="text-xs text-gray-500">{weather.advisory}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="hidden sm:flex">
                <Bike className="w-3 h-3 mr-1" />
                Grab Bike recommended
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReroll}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Reroll
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column - Itinerary List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Styled Tabs */}
            <Card className="p-1.5">
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setViewMode('suggested');
                    if (suggestedItineraries.length > 0) {
                      setSelectedItinerary(suggestedItineraries[0]);
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'suggested'
                      ? 'bg-sky-primary text-black shadow-[2px_2px_0px_#000] border-2 border-black'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  For You
                </button>
                <button
                  onClick={() => {
                    setViewMode('all');
                    if (allItineraries.length > 0) {
                      setSelectedItinerary(allItineraries[0]);
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    viewMode === 'all'
                      ? 'bg-sky-primary text-black shadow-[2px_2px_0px_#000] border-2 border-black'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  All Trips
                </button>
              </div>
            </Card>

            {/* Section Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-primary" />
                {viewMode === 'suggested' ? 'Recommended' : 'All Trips'}
              </h2>
              <span className="text-sm text-gray-500">
                {displayedItineraries.length} {displayedItineraries.length === 1 ? 'trip' : 'trips'}
              </span>
            </div>

            {/* Itinerary Cards */}
            <div className="space-y-3">
              {displayedItineraries.map((itinerary, idx) => (
                <motion.div
                  key={itinerary.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card
                    hoverable
                    padding="none"
                    className={`cursor-pointer overflow-hidden transition-all ${
                      selectedItinerary?.id === itinerary.id
                        ? 'ring-2 ring-sky-primary ring-offset-2'
                        : ''
                    }`}
                    onClick={() => setSelectedItinerary(itinerary)}
                  >
                    <div className="flex">
                      {/* Thumbnail */}
                      <div className="relative w-28 h-28 flex-shrink-0">
                        <img
                          src={itinerary.image}
                          alt={itinerary.name}
                          className="w-full h-full object-cover"
                        />
                        {viewMode === 'suggested' && itinerary.matchScore !== undefined && itinerary.matchScore > 0 && (
                          <div className="absolute top-2 left-2">
                            <Badge
                              variant={itinerary.matchScore >= 90 ? 'success' : 'primary'}
                              className="text-[10px] px-1.5 py-0.5"
                            >
                              {itinerary.matchScore}%
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-3 min-w-0">
                        <h3 className="font-bold text-sm truncate mb-1">{itinerary.name}</h3>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {itinerary.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {itinerary.duration}d
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {(itinerary.estimatedCost / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Detail View (Sticky) */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <AnimatePresence mode="wait">
                {selectedItinerary && (
                  <motion.div
                    key={selectedItinerary.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden">
                      {/* Hero Image */}
                      <div className="relative h-48 -m-5 mb-4">
                        <img
                          src={selectedItinerary.image}
                          alt={selectedItinerary.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-5 right-5 text-white">
                          <div className="flex items-start justify-between">
                            <div>
                              <h2 className="text-2xl font-bold mb-1">{selectedItinerary.name}</h2>
                              <p className="text-sm opacity-90">{selectedItinerary.description}</p>
                            </div>
                            {viewMode === 'suggested' && selectedItinerary.matchScore !== undefined && selectedItinerary.matchScore > 0 && (
                              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-sm">{selectedItinerary.matchScore}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock className="w-4 h-4 text-sky-primary" />
                          <span className="font-medium">{selectedItinerary.duration} days</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <DollarSign className="w-4 h-4 text-sky-primary" />
                          <span className="font-medium">
                            {(selectedItinerary.estimatedCost / 1000000).toFixed(1)}M VND
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <MapPin className="w-4 h-4 text-sky-primary" />
                          <span className="font-medium">
                            {selectedItinerary.days.reduce((sum, d) => sum + d.activities.length, 0)} stops
                          </span>
                        </div>
                      </div>

                      {/* Highlights */}
                      {selectedItinerary.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {selectedItinerary.highlights.map(h => (
                            <Badge key={h} variant="secondary" className="text-xs">
                              {h}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Day Tabs */}
                      {selectedItinerary.days.length > 0 && (
                        <>
                          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                            {selectedItinerary.days.map((day) => (
                              <button
                                key={day.day}
                                onClick={() => setExpandedDay(day.day)}
                                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  expandedDay === day.day
                                    ? 'bg-sky-primary text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                                }`}
                              >
                                Day {day.day}
                              </button>
                            ))}
                          </div>

                          {/* Activities for Selected Day */}
                          <AnimatePresence mode="wait">
                            {selectedItinerary.days.filter(d => d.day === expandedDay).map((day) => (
                              <motion.div
                                key={day.day}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4"
                              >
                                <p className="text-sm font-medium text-gray-500 mb-3">{day.title}</p>
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                  {day.activities.map((activity, idx) => (
                                    <motion.div
                                      key={idx}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.03 }}
                                      className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                      <span className="font-mono text-xs text-gray-500 w-10">
                                        {activity.time}
                                      </span>
                                      <div className="w-2 h-2 rounded-full bg-sky-primary flex-shrink-0" />
                                      <span className="flex-1 text-sm truncate">{activity.name}</span>
                                      <span className="text-xs text-gray-400">{activity.duration}</span>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                        <Button
                          variant="secondary"
                          onClick={() => handleAction('customize')}
                          className="flex-col h-auto py-3"
                        >
                          <Map className="w-5 h-5 mb-1" />
                          <span className="text-xs font-semibold">Customize</span>
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleAction('schedule')}
                          className="flex-col h-auto py-3"
                        >
                          <Calendar className="w-5 h-5 mb-1" />
                          <span className="text-xs font-semibold">Schedule</span>
                        </Button>
                        <Button
                          onClick={() => handleAction('go')}
                          className="flex-col h-auto py-3"
                        >
                          <ArrowRight className="w-5 h-5 mb-1" />
                          <span className="text-xs font-semibold">Start Trip</span>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Login Prompt Modal */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLoginPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <Card className="max-w-sm text-center">
                <div className="w-16 h-16 bg-sky-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-sky-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">Sign in to Continue</h2>
                <p className="text-gray-600 text-sm mb-6">
                  Create a free account to save your itinerary and start your adventure.
                </p>
                <div className="space-y-3">
                  <Button
                    fullWidth
                    onClick={() => navigate('/login', { state: { from: '/results' } })}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => navigate('/register', { state: { from: '/results' } })}
                  >
                    Create Free Account
                  </Button>
                </div>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                >
                  Continue browsing
                </button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
