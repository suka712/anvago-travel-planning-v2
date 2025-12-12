import { Card, Button } from '@/components/ui';
import { ArrowLeft, Navigation } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

// Placeholder - Full trip tracking view will be implemented in Day 7-8
export default function TripPage() {
  const { id } = useParams();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-6">
          <Navigation className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Active Trip Tracking</h1>
        <p className="text-gray-600 mb-8">
          The live trip tracking interface is coming soon! Features include:
        </p>
        <ul className="text-left text-gray-600 space-y-2 mb-8">
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#4FC3F7] rounded-full flex items-center justify-center text-sm font-bold">✓</span>
            Real-time location tracking
          </li>
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#4FC3F7] rounded-full flex items-center justify-center text-sm font-bold">✓</span>
            Smart notifications
          </li>
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#4FC3F7] rounded-full flex items-center justify-center text-sm font-bold">✓</span>
            One-tap Grab booking
          </li>
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#4FC3F7] rounded-full flex items-center justify-center text-sm font-bold">✓</span>
            Weather alerts & rerouting
          </li>
        </ul>
        <Link to="/dashboard">
          <Button variant="secondary" leftIcon={<ArrowLeft className="w-5 h-5" />}>
            Back to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  );
}

