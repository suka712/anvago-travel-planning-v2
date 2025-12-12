import { Card, Button } from '@/components/ui';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

// Placeholder - Full planning editor will be implemented in Day 5-6
export default function PlanPage() {
  const { id } = useParams();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-lg text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center mx-auto mb-6">
          <Wand2 className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Trip Planning Editor</h1>
        <p className="text-gray-600 mb-8">
          The drag-and-drop trip planning interface is coming soon! You'll be able to:
        </p>
        <ul className="text-left text-gray-600 space-y-2 mb-8">
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#4FC3F7] rounded-full flex items-center justify-center text-sm font-bold">✓</span>
            Drag and drop locations
          </li>
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#4FC3F7] rounded-full flex items-center justify-center text-sm font-bold">✓</span>
            View interactive map
          </li>
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#4FC3F7] rounded-full flex items-center justify-center text-sm font-bold">✓</span>
            Optimize with AI
          </li>
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#4FC3F7] rounded-full flex items-center justify-center text-sm font-bold">✓</span>
            Book transportation
          </li>
        </ul>
        <Link to={`/itinerary/${id}`}>
          <Button variant="secondary" leftIcon={<ArrowLeft className="w-5 h-5" />}>
            Back to Itinerary
          </Button>
        </Link>
      </Card>
    </div>
  );
}

