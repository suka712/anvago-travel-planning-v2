import { Card, Button, Badge } from '@/components/ui';
import { ArrowRight, MapPin, Clock, Calendar, Edit3, Play } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

// Placeholder - Full itinerary view will be implemented
export default function ItineraryPage() {
  const { id } = useParams();

  const mockItinerary = {
    title: 'Best of Danang',
    description: 'Experience the highlights of Da Nang in 3 unforgettable days',
    days: [
      {
        day: 1,
        title: 'Beach & Culture',
        items: [
          { time: '06:00', name: 'My Khe Beach', duration: '2h', type: 'beach' },
          { time: '09:00', name: 'Han Market', duration: '2h', type: 'market' },
          { time: '12:00', name: 'Madame Lan Restaurant', duration: '1.5h', type: 'restaurant' },
          { time: '14:30', name: 'Marble Mountains', duration: '2.5h', type: 'attraction' },
          { time: '21:00', name: 'Dragon Bridge Fire Show', duration: '1h', type: 'attraction' },
        ],
      },
      {
        day: 2,
        title: 'Nature & Views',
        items: [
          { time: '07:00', name: 'Linh Ung Pagoda', duration: '2h', type: 'temple' },
          { time: '10:00', name: 'Son Tra Peninsula', duration: '3h', type: 'nature' },
          { time: '14:00', name: 'Be Man Seafood', duration: '2h', type: 'restaurant' },
          { time: '18:00', name: 'Sky36 Bar', duration: '2h', type: 'nightlife' },
        ],
      },
      {
        day: 3,
        title: 'Adventure Day',
        items: [
          { time: '08:00', name: 'Ba Na Hills', duration: '8h', type: 'attraction' },
          { time: '18:00', name: 'Cong Caphe', duration: '1h', type: 'cafe' },
        ],
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge className="mb-4">92% Match</Badge>
        <h1 className="text-4xl font-bold mb-2">{mockItinerary.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{mockItinerary.description}</p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span>3 days</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span>12 locations</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>Best for: Any time</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to={`/plan/${id}`}>
            <Button leftIcon={<Edit3 className="w-5 h-5" />}>
              Customize
            </Button>
          </Link>
          <Button variant="secondary" leftIcon={<Calendar className="w-5 h-5" />}>
            Schedule Trip
          </Button>
          <Button variant="secondary" leftIcon={<Play className="w-5 h-5" />}>
            Go Now
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {mockItinerary.days.map((day) => (
          <Card key={day.day}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#4FC3F7] rounded-xl border-2 border-black flex items-center justify-center font-bold">
                {day.day}
              </div>
              <div>
                <h2 className="text-xl font-bold">Day {day.day}</h2>
                <p className="text-gray-600">{day.title}</p>
              </div>
            </div>

            <div className="space-y-4">
              {day.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-16 text-sm font-medium text-gray-500 pt-1">
                    {item.time}
                  </div>
                  <div className="flex-1 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.duration} • {item.type}
                        </p>
                      </div>
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Card className="mt-8 text-center bg-[#4FC3F7]/10">
        <h3 className="text-xl font-bold mb-2">Ready to explore?</h3>
        <p className="text-gray-600 mb-4">
          Sign in to customize this itinerary and start your adventure
        </p>
        <Link to="/login">
          <Button rightIcon={<ArrowRight className="w-5 h-5" />}>
            Sign In to Continue
          </Button>
        </Link>
      </Card>
    </div>
  );
}

