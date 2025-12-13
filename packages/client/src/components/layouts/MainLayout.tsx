import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Map, Calendar, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui';

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#4FC3F7] rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
                <span className="text-xl font-bold">A</span>
              </div>
              <span className="text-xl font-bold hidden sm:block">Anvago</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/discover"
                className={`font-medium transition-colors ${
                  isActive('/discover') ? 'text-[#2196F3]' : 'text-gray-600 hover:text-black'
                }`}
              >
                Discover
              </Link>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className={`font-medium transition-colors ${
                      isActive('/dashboard') ? 'text-[#2196F3]' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    My Trips
                  </Link>
                </>
              )}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  {user.isPremium && (
                    <span className="px-2 py-1 text-xs font-bold bg-yellow-400 text-black rounded-full border border-black">
                      ✨ Premium
                    </span>
                  )}
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 bg-[#4FC3F7] rounded-full border-2 border-black flex items-center justify-center">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-sm font-bold">{user.name[0]}</span>
                        )}
                      </div>
                      <span className="font-medium">{user.name.split(' ')[0]}</span>
                    </button>
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <Map className="w-4 h-4" />
                        My Trips
                      </Link>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      >
                        <Calendar className="w-4 h-4" />
                        Itineraries
                      </Link>
                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-[#2196F3]"
                        >
                          <Settings className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-500"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/discover"
                className="block py-2 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Discover
              </Link>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block py-2 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Trips
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="block py-2 font-medium text-[#2196F3]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 font-medium text-red-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-black mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#4FC3F7] rounded-lg border-2 border-black flex items-center justify-center">
                <span className="font-bold">A</span>
              </div>
              <span className="font-bold">Anvago</span>
              <span className="text-gray-500 text-sm">• Travel the world your way</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Anvago. Built with ❤️ for Grab Hackathon.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

