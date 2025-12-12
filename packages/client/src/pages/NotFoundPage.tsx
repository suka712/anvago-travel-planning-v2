import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Map } from 'lucide-react';
import { Button } from '@/components/ui';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4FC3F7]/20 via-[#FAFAF8] to-[#81D4FA]/20 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-32 h-32 bg-[#4FC3F7] rounded-3xl border-2 border-black shadow-[8px_8px_0px_#000] flex items-center justify-center mx-auto mb-8">
          <Map className="w-16 h-16" />
        </div>
        
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page not found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Looks like you've wandered off the map! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button leftIcon={<Home className="w-5 h-5" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/discover">
            <Button variant="secondary" leftIcon={<ArrowLeft className="w-5 h-5" />}>
              Start Exploring
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

