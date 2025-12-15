import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Plus, Map, Calendar, ChevronRight, Settings,
  Crown, Heart, Sparkles, MapPin, Clock, ArrowRight
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { PremiumModal } from '@/components/modals';

const mockTrips = [
  {
    id: '1',
    name: 'Beach & Culture Explorer',
    destination: 'Danang',
    date: '2024-12-15',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400',
    duration: 3,
    stops: 12,
  },
  {
    id: '2',
    name: 'Foodie Paradise Trail',
    destination: 'Danang',
    date: '2024-11-20',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    duration: 3,
    stops: 8,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { favorites, removeFavorite } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState<'trips' | 'saved'>('trips');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id);
    toast('Removed from favorites', { icon: '💔' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-sky-primary rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}!
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{user?.email}</span>
                  {user?.isPremium && (
                    <Badge variant="warning" className="text-[10px] px-1.5 py-0.5">
                      <Crown className="w-3 h-3 mr-0.5" />
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/settings')}
              leftIcon={<Settings className="w-4 h-4" />}
            >
              Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card
            hoverable
            className="bg-sky-primary cursor-pointer"
            onClick={() => navigate('/discover')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Plan New Trip</h3>
                <p className="text-sm opacity-80">Start a new adventure</p>
              </div>
            </div>
          </Card>

          <Card hoverable className="cursor-pointer" onClick={() => navigate('/discover')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center border-2 border-black">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold">AI Recommendations</h3>
                <p className="text-sm text-gray-600">Get personalized trips</p>
              </div>
            </div>
          </Card>

          <Card hoverable className="cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center border-2 border-black">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold">Explore Destinations</h3>
                <p className="text-sm text-gray-600">Discover new places</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="p-1.5 mb-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('trips')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'trips'
                  ? 'bg-sky-primary text-black shadow-[2px_2px_0px_#000] border-2 border-black'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Map className="w-4 h-4" />
              My Trips
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'saved'
                  ? 'bg-sky-primary text-black shadow-[2px_2px_0px_#000] border-2 border-black'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className="w-4 h-4" />
              Saved Itineraries
            </button>
          </div>
        </Card>

        {/* Content */}
        {activeTab === 'trips' && (
          <div className="space-y-4">
            {mockTrips.length === 0 ? (
              <Card className="text-center py-12">
                <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No trips yet</h3>
                <p className="text-gray-600 mb-6">Start planning your first adventure!</p>
                <Button onClick={() => navigate('/discover')}>
                  Plan Your First Trip
                </Button>
              </Card>
            ) : (
              mockTrips.map((trip, idx) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card
                    hoverable
                    padding="none"
                    className="overflow-hidden cursor-pointer"
                    onClick={() => navigate(trip.status === 'upcoming' ? `/trip/${trip.id}` : `/itinerary/${trip.id}`)}
                  >
                    <div className="flex">
                      <div className="w-36 h-36 flex-shrink-0 relative">
                        <img
                          src={trip.image}
                          alt={trip.name}
                          className="w-full h-full object-cover"
                        />
                        <Badge
                          variant={trip.status === 'upcoming' ? 'primary' : 'success'}
                          className="absolute top-2 left-2 text-[10px]"
                        >
                          {trip.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                        </Badge>
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg mb-1">{trip.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {trip.destination}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(trip.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {trip.duration} days
                            </span>
                            <span>{trip.stops} stops</span>
                          </div>
                        </div>

                        {trip.status === 'upcoming' && (
                          <div className="flex items-center justify-between pt-3 mt-3">
                          </div>
                        )}
                      </div>
                      <div className="hidden sm:flex items-center pr-4">
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <>
            {favorites.length === 0 ? (
              <Card className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No saved itineraries</h3>
                <p className="text-gray-600 mb-6">
                  Browse trips and tap the heart icon to save your favorites!
                </p>
                <Button onClick={() => navigate('/discover')}>
                  Discover Trips
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {favorites.map((itinerary, idx) => (
                  <motion.div
                    key={itinerary.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card
                      hoverable
                      padding="none"
                      className="overflow-hidden"
                    >
                      <div
                        className="relative h-36 cursor-pointer"
                        onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                      >
                        <img
                          src={itinerary.image}
                          alt={itinerary.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(itinerary.id);
                          }}
                          className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                          <Heart className="w-4 h-4 fill-white" />
                        </button>
                      </div>
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                      >
                        <h3 className="font-bold mb-1">{itinerary.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                          {itinerary.description}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {itinerary.destination}
                          </span>
                          <span>•</span>
                          <span>{itinerary.duration} days</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Premium Upsell */}
        {!user?.isPremium && (
          <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-black shadow-[3px_3px_0px_#000]">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Upgrade to Premium</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Unlock AI optimization, smart search, local gems, and more!
                </p>
                <Button size="sm" onClick={() => setShowPremiumModal(true)}>
                  Upgrade Now
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </div>
  );
}
