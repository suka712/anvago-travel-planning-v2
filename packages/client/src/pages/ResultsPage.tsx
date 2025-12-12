import { Card, Button, Badge } from '@/components/ui';
import { ArrowRight, MapPin, Clock, DollarSign, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

// Placeholder - Results page will show AI-generated itineraries
export default function ResultsPage() {
  const mockResults = [
    {
      id: '1',
      title: 'Best of Danang',
      tagline: '3 days of highlights',
      matchScore: 92,
      stats: { days: 3, locations: 12, budget: '2.5M VND' },
      image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
      badges: ['popular', 'photography'],
    },
    {
      id: '2',
      title: 'Local Food Tour',
      tagline: 'Taste authentic Vietnam',
      matchScore: 87,
      stats: { days: 3, locations: 15, budget: '1.8M VND' },
      image: 'https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=800',
      badges: ['foodie', 'local'],
    },
    {
      id: '3',
      title: 'Beach & Relaxation',
      tagline: 'Unwind by the sea',
      matchScore: 84,
      stats: { days: 3, locations: 8, budget: '3.2M VND' },
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      badges: ['relaxation', 'beach'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Your Perfect Itineraries</h1>
        <p className="text-xl text-gray-600 mb-6">
          Based on your preferences, here are your top matches
        </p>
        <Button variant="ghost" leftIcon={<RefreshCw className="w-5 h-5" />}>
          Reroll Options
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockResults.map((result) => (
          <Card key={result.id} hoverable padding="none" className="overflow-hidden">
            <div className="relative">
              <img
                src={result.image}
                alt={result.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full border-2 border-black font-bold">
                {result.matchScore}% match
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-1">{result.title}</h3>
              <p className="text-gray-600 mb-4">{result.tagline}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {result.badges.map((badge) => (
                  <Badge key={badge} variant="secondary" size="sm">
                    {badge}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {result.stats.days} days
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {result.stats.locations} spots
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {result.stats.budget}
                </span>
              </div>

              <Link to={`/itinerary/${result.id}`}>
                <Button className="w-full" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  View Details
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

