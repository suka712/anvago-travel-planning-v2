import { Card, Button } from '@/components/ui';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// Placeholder - Full onboarding flow will be implemented in Day 3-4
export default function DiscoverPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gradient-to-br from-[#4FC3F7]/10 via-[#FAFAF8] to-[#81D4FA]/10">
      <Card className="max-w-lg text-center">
        <div className="w-16 h-16 bg-[#4FC3F7] rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Discover Your Perfect Trip</h1>
        <p className="text-gray-600 mb-8">
          The gamified onboarding experience is coming soon! You'll be able to swipe through destinations,
          pick your travel personas, and get AI-generated itineraries.
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            For now, check out our demo itinerary:
          </p>
          <Link to="/discover/results">
            <Button className="w-full" rightIcon={<ArrowRight className="w-5 h-5" />}>
              View Sample Itineraries
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

