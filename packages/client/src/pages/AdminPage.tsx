import { Card, Button } from '@/components/ui';
import { Settings, Users, Map, Play, RefreshCw } from 'lucide-react';

// Placeholder - Full admin panel will be implemented in Day 7-8
export default function AdminPage() {
  const stats = {
    users: { total: 12, premium: 3, newToday: 2 },
    itineraries: { total: 45, templates: 5 },
    trips: { active: 3, completed: 28 },
    locations: { total: 156, verified: 42 },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-[#4FC3F7] rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] flex items-center justify-center">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-gray-600">Demo controls and system overview</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.users.total}</p>
              <p className="text-sm text-gray-500">Users</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Map className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.itineraries.total}</p>
              <p className="text-sm text-gray-500">Itineraries</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.trips.active}</p>
              <p className="text-sm text-gray-500">Active Trips</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📍</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.locations.total}</p>
              <p className="text-sm text-gray-500">Locations</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Demo Controls */}
      <Card className="mb-8">
        <h2 className="text-xl font-bold mb-4">🎮 Demo Control Center</h2>
        <p className="text-gray-600 mb-6">
          Control the demo simulation for presentations. Full controls coming soon!
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" leftIcon={<Play className="w-4 h-4" />}>
            Start Simulation
          </Button>
          <Button variant="secondary" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Reset Demo Data
          </Button>
          <Button variant="secondary">☔ Trigger Rain Alert</Button>
          <Button variant="secondary">🚗 Trigger Traffic</Button>
        </div>
      </Card>

      {/* Coming Soon */}
      <Card className="bg-gray-50 border-dashed">
        <h3 className="font-bold mb-2">🚧 Coming Soon</h3>
        <ul className="text-gray-600 space-y-1">
          <li>• User management table</li>
          <li>• Location management</li>
          <li>• Trip simulation timeline</li>
          <li>• Walkthrough mode for judges</li>
        </ul>
      </Card>
    </div>
  );
}

