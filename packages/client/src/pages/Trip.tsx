import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Navigation, MapPin, Clock, ChevronRight, CheckCircle2, Circle,
  CloudRain, Bike, Car, Footprints, Map, Maximize2, Minimize2,
  X, Play, Pause, SkipForward, RefreshCw, Coffee, ChevronDown
} from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import Header from '@/components/layouts/Header';

interface TripStop {
  id: string;
  name: string;
  type: string;
  time: string;
  duration: string;
  status: 'completed' | 'current' | 'upcoming' | 'skipped';
  address: string;
  image: string;
  transport?: {
    mode: 'grab_bike' | 'grab_car' | 'walk';
    duration: string;
    cost?: number;
  };
}

const mockTripStops: TripStop[] = [
  {
    id: '1',
    name: 'Sunrise at My Khe Beach',
    type: 'beach',
    time: '6:00',
    duration: '2h',
    status: 'completed',
    address: 'My Khe Beach, Phuoc My, Son Tra, Da Nang',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300',
  },
  {
    id: '2',
    name: 'Bánh Mì Bà Lan',
    type: 'food',
    time: '8:30',
    duration: '45m',
    status: 'completed',
    address: '115 Nguyen Chi Thanh, Hai Chau, Da Nang',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300',
    transport: { mode: 'grab_bike', duration: '10 min', cost: 25000 },
  },
  {
    id: '3',
    name: 'Han Market',
    type: 'shopping',
    time: '10:00',
    duration: '2h',
    status: 'current',
    address: '119 Tran Phu, Hai Chau, Da Nang',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300',
    transport: { mode: 'walk', duration: '15 min' },
  },
  {
    id: '4',
    name: 'Madame Lan Restaurant',
    type: 'food',
    time: '12:30',
    duration: '1.5h',
    status: 'upcoming',
    address: '4 Bach Dang, Hai Chau, Da Nang',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300',
    transport: { mode: 'grab_bike', duration: '8 min', cost: 20000 },
  },
  {
    id: '5',
    name: 'Beach Club Relaxation',
    type: 'beach',
    time: '15:00',
    duration: '3h',
    status: 'upcoming',
    address: 'My Khe Beach, Son Tra, Da Nang',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300',
    transport: { mode: 'grab_car', duration: '15 min', cost: 75000 },
  },
];

// Alternative stop for smart reroute
const alternativeStop: TripStop = {
  id: 'alt-1',
  name: '43 Factory Coffee',
  type: 'cafe',
  time: '15:00',
  duration: '2h',
  status: 'upcoming',
  address: '43 Tran Cao Van, Thanh Khe, Da Nang',
  image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
  transport: { mode: 'grab_bike', duration: '10 min', cost: 30000 },
};

const weatherAlert = {
  type: 'rain',
  message: 'Light rain expected at 3 PM',
  icon: CloudRain,
};

export default function Trip() {
  const { id: _id } = useParams();
  const [stops, setStops] = useState<TripStop[]>(mockTripStops);
  const [isPaused, setIsPaused] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [showWeatherAlert, setShowWeatherAlert] = useState(true);
  const [showRerouteOffer, setShowRerouteOffer] = useState(false);
  const [rerouteAccepted, setRerouteAccepted] = useState(false);
  const [currentTime, _setCurrentTime] = useState('10:45');
  const [showMap, setShowMap] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);

  const currentStop = stops.find(s => s.status === 'current');
  const nextStop = stops.find(s => s.status === 'upcoming');
  const completedCount = stops.filter(s => s.status === 'completed').length;
  const progress = (completedCount / stops.length) * 100;

  // Simulate time passing
  useEffect(() => {
    const timer = setInterval(() => {
      // In real app, update current time
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Show reroute offer after weather alert
  useEffect(() => {
    if (showWeatherAlert && !rerouteAccepted) {
      const timer = setTimeout(() => {
        setShowRerouteOffer(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showWeatherAlert, rerouteAccepted]);

  const handleMarkComplete = (stopId: string) => {
    const stop = stops.find(s => s.id === stopId);
    setStops(prev => {
      const newStops = [...prev];
      const currentIdx = newStops.findIndex(s => s.id === stopId);
      if (currentIdx !== -1) {
        newStops[currentIdx].status = 'completed';
        if (currentIdx + 1 < newStops.length) {
          newStops[currentIdx + 1].status = 'current';
          toast.success(`${stop?.name} completed!`);
        } else {
          toast.success('Trip completed! Great adventure!');
        }
      }
      return newStops;
    });
  };

  const handleSkip = (stopId: string) => {
    const stop = stops.find(s => s.id === stopId);
    setStops(prev => {
      const newStops = [...prev];
      const currentIdx = newStops.findIndex(s => s.id === stopId);
      if (currentIdx !== -1) {
        newStops[currentIdx].status = 'skipped';
        if (currentIdx + 1 < newStops.length) {
          newStops[currentIdx + 1].status = 'current';
        }
      }
      return newStops;
    });
    toast(`Skipped ${stop?.name}`, { icon: '⏭️' });
  };

  // Handle accepting the smart reroute swap
  const handleAcceptSwap = () => {
    // Find Beach Club and replace with 43 Factory Coffee
    setStops(prev => {
      const newStops = [...prev];
      const beachClubIdx = newStops.findIndex(s => s.name === 'Beach Club Relaxation');
      if (beachClubIdx !== -1) {
        newStops[beachClubIdx] = {
          ...alternativeStop,
          status: newStops[beachClubIdx].status,
        };
      }
      return newStops;
    });
    setShowRerouteOffer(false);
    setRerouteAccepted(true);
    setShowWeatherAlert(false);
    toast.success('Itinerary updated! 43 Factory Coffee swapped in.');
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'grab_bike': return Bike;
      case 'grab_car': return Car;
      default: return Footprints;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Header */}
      <Header />

      {/* Trip Info Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg">Day 1</h1>
                  <Badge variant="secondary" className="text-xs">
                    Beach & Culture
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {currentTime} • {completedCount}/{stops.length} stops
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Progress indicator */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-sky-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {Math.round(progress)}%
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Constrained width */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Weather Alert Banner */}
        <AnimatePresence>
          {showWeatherAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <Card className="bg-amber-50 border-amber-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <weatherAlert.icon className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-800">{weatherAlert.message}</p>
                      <p className="text-xs text-amber-600">May affect outdoor activities</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWeatherAlert(false)}
                    className="p-1 hover:bg-amber-100 rounded"
                  >
                    <X className="w-4 h-4 text-amber-600" />
                  </button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map View Toggle & Container */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Map className="w-4 h-4" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
            {showMap && (
              <button
                onClick={() => setMapExpanded(!mapExpanded)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                {mapExpanded ? (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    Collapse
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4" />
                    Expand
                  </>
                )}
              </button>
            )}
          </div>

          <AnimatePresence>
            {showMap && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: mapExpanded ? 400 : 200 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden p-0">
                  <div
                    className="w-full bg-gray-200 flex items-center justify-center relative"
                    style={{ height: mapExpanded ? 400 : 200 }}
                  >
                    {/* Placeholder map - In production, integrate with Google Maps or Mapbox */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-sky-200" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234FC3F7' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                    <div className="relative z-10 text-center">
                      <Map className="w-12 h-12 text-sky-primary/50 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 font-medium">Interactive Map</p>
                      <p className="text-xs text-gray-500">Shows your route & nearby locations</p>
                    </div>

                    {/* Map markers preview */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {stops.slice(0, 3).map((stop, idx) => (
                        <div
                          key={stop.id}
                          className={`flex items-center gap-2 px-2 py-1 rounded-lg text-xs font-medium ${
                            stop.status === 'current'
                              ? 'bg-sky-primary text-white'
                              : stop.status === 'completed'
                              ? 'bg-green-500 text-white'
                              : 'bg-white text-gray-700 shadow-sm'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="truncate max-w-24">{stop.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Current Stop - Highlighted */}
        {currentStop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-sky-primary uppercase tracking-wide">
                Current Stop
              </p>
              <Badge variant="primary" className="animate-pulse">
                <MapPin className="w-3 h-3 mr-1" />
                You're here
              </Badge>
            </div>
            <Card className="overflow-hidden border-2 border-sky-primary">
              <div className="relative h-48 sm:h-56">
                <img
                  src={currentStop.image}
                  alt={currentStop.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-2xl font-bold mb-1">{currentStop.name}</h2>
                  <p className="text-sm opacity-90 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {currentStop.address}
                  </p>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-4 h-4 text-sky-primary" />
                      {currentStop.time}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{currentStop.duration}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Navigation className="w-4 h-4" />}
                  >
                    Directions
                  </Button>
                </div>

                <div className="flex gap-3">
                  <Button
                    fullWidth
                    onClick={() => handleMarkComplete(currentStop.id)}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Complete
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleSkip(currentStop.id)}
                    leftIcon={<SkipForward className="w-4 h-4" />}
                  >
                    Skip
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Next Stop Preview with Transport */}
        {nextStop && nextStop.transport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Next Up
            </p>
            <Card>
              {/* Transport Option */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-primary/10 rounded-lg flex items-center justify-center">
                    {(() => {
                      const Icon = getTransportIcon(nextStop.transport!.mode);
                      return <Icon className="w-5 h-5 text-sky-primary" />;
                    })()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {nextStop.transport.mode === 'grab_bike' ? 'Grab Bike' :
                       nextStop.transport.mode === 'grab_car' ? 'Grab Car' : 'Walk'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {nextStop.transport.duration}
                      {nextStop.transport.cost && ` • ${(nextStop.transport.cost / 1000).toFixed(0)}k VND`}
                    </p>
                  </div>
                </div>
                <Button size="sm" onClick={() => setShowTransportModal(true)}>
                  Book Now
                </Button>
              </div>

              {/* Destination Preview */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-100">
                  <img
                    src={nextStop.image}
                    alt={nextStop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{nextStop.name}</h3>
                  <p className="text-sm text-gray-500">{nextStop.time} • {nextStop.duration}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            </Card>
          </motion.div>
        )}

        {/* Timeline */}
        <div className="mb-24">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="flex items-center justify-between w-full mb-4"
          >
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Today's Timeline
            </p>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showTimeline ? '' : '-rotate-90'}`} />
          </button>

          <AnimatePresence>
            {showTimeline && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card>
                  <div className="space-y-1">
                    {stops.map((stop, idx) => (
                      <motion.div
                        key={stop.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                          stop.status === 'current' ? 'bg-sky-primary/5' : ''
                        }`}
                      >
                        {/* Status Icon */}
                        <div className="flex flex-col items-center pt-0.5">
                          {stop.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : stop.status === 'current' ? (
                            <div className="w-5 h-5 bg-sky-primary rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            </div>
                          ) : stop.status === 'skipped' ? (
                            <X className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300" />
                          )}
                          {idx < stops.length - 1 && (
                            <div className={`w-0.5 h-8 mt-1 ${
                              stop.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 min-w-0 ${
                          stop.status === 'skipped' ? 'opacity-50' : ''
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-500">{stop.time}</span>
                            {stop.status === 'current' && (
                              <Badge variant="primary" className="text-[10px] px-1.5 py-0.5">Now</Badge>
                            )}
                          </div>
                          <h4 className={`font-medium text-sm ${
                            stop.status === 'skipped' ? 'line-through text-gray-400' : ''
                          }`}>
                            {stop.name}
                          </h4>
                          <p className="text-xs text-gray-500">{stop.duration}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Smart Reroute Offer - Bottom Floating Card */}
      <AnimatePresence>
        {showRerouteOffer && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-6"
          >
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-br from-white to-sky-50 border-2 border-sky-primary shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sky-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sky-primary">Anva Smart Reroute</h3>
                      <Badge variant="warning" className="text-[10px]">Weather</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Rain at 3 PM may affect <strong>Beach Club</strong>. Swap with indoor activity?
                    </p>

                    {/* Suggestion Card */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-100 mb-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={alternativeStop.image}
                          alt={alternativeStop.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Coffee className="w-4 h-4 text-sky-primary" />
                          <p className="font-semibold text-sm">{alternativeStop.name}</p>
                        </div>
                        <p className="text-xs text-gray-500">Award-winning Vietnamese coffee • Indoor</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={handleAcceptSwap} className="flex-1">
                        Accept Swap
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowRerouteOffer(false)}
                        className="flex-1"
                      >
                        Keep Original
                      </Button>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRerouteOffer(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transport Booking Modal */}
      <AnimatePresence>
        {showTransportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowTransportModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3" />
              <div className="p-6 max-w-2xl mx-auto">
                <h2 className="text-xl font-bold mb-4">Book Your Ride</h2>

                <div className="space-y-3 mb-6">
                  {[
                    { mode: 'grab_bike', name: 'Grab Bike', price: '25,000 VND', time: '8 min', icon: Bike },
                    { mode: 'grab_car', name: 'Grab Car', price: '65,000 VND', time: '12 min', icon: Car },
                    { mode: 'walk', name: 'Walk', price: 'Free', time: '25 min', icon: Footprints },
                  ].map(option => (
                    <button
                      key={option.mode}
                      className="w-full flex items-center justify-between p-4 rounded-xl border-2 hover:border-sky-primary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <option.icon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{option.name}</p>
                          <p className="text-sm text-gray-500">{option.time}</p>
                        </div>
                      </div>
                      <p className="font-bold">{option.price}</p>
                    </button>
                  ))}
                </div>

                <Button fullWidth size="lg" onClick={() => setShowTransportModal(false)}>
                  Open Grab App
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
