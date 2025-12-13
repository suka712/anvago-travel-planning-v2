import { Card, Button, Badge } from '@/components/ui';
import { Plus, MapPin, ArrowRight, Calendar, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const mockTrips = [
    {
      id: '1',
      title: 'Danang Adventure',
      status: 'scheduled',
      date: 'Dec 20, 2024',
      locations: 12,
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
    },
    {
      id: '2',
      title: 'Weekend Foodie Tour',
      status: 'completed',
      date: 'Dec 1, 2024',
      locations: 8,
      image: 'https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=800',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {user?.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-xl text-gray-600">
          Ready for your next adventure?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link to="/discover">
          <Card hoverable className="h-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#4FC3F7] rounded-xl border-2 border-black flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">New Adventure</h3>
                <p className="text-sm text-gray-600">Plan your next trip</p>
              </div>
            </div>
          </Card>
        </Link>

        <Card hoverable className="h-full opacity-75">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl border-2 border-black flex items-center justify-center">
              <Play className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold">Active Trip</h3>
              <p className="text-sm text-gray-600">No active trips</p>
            </div>
          </div>
        </Card>

        <Card hoverable className="h-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl border-2 border-black flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold">Upcoming</h3>
              <p className="text-sm text-gray-600">1 trip scheduled</p>
            </div>
          </div>
        </Card>
      </div>

      {/* My Trips */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Trips</h2>
          <Link to="/discover">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create New
            </Button>
          </Link>
        </div>

        {mockTrips.length === 0 ? (
          <Card className="text-center py-12">
            <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-6">Start planning your first adventure!</p>
            <Link to="/discover">
              <Button>Plan a Trip</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {mockTrips.map((trip) => (
              <Card key={trip.id} hoverable padding="none" className="overflow-hidden">
                <div className="flex">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-32 h-32 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold">{trip.title}</h3>
                      <Badge
                        variant={trip.status === 'completed' ? 'secondary' : 'success'}
                        size="sm"
                      >
                        {trip.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {trip.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {trip.locations} spots
                      </span>
                    </div>
                    <Link to={`/trip/${trip.id}`}>
                      <Button size="sm" variant="secondary">
                        View Trip
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

