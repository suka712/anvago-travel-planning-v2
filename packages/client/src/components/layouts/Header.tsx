import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui';

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-30 ${
        transparent
          ? 'bg-white/80 backdrop-blur-sm border-b border-gray-200'
          : 'bg-white border-b-2 border-black'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-sky-primary rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold hidden sm:block">Anvago</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/discover"
              className="font-medium text-gray-600 hover:text-black transition-colors"
            >
              Discover
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="font-medium text-gray-600 hover:text-black transition-colors"
              >
                My Trips
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                {user?.isPremium && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-yellow-400 text-black rounded-full border border-black z-10">
                    PRO
                  </span>
                )}
                <div className="w-8 h-8 bg-sky-primary rounded-full border-2 border-black flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold">{user?.name?.[0] || 'U'}</span>
                  )}
                </div>
                <span className="font-medium">{user?.name?.split(' ')[0]}</span>
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
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
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Trips
                </Link>
                <Link
                  to="/settings"
                  className="block py-2 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    className="block py-2 font-medium text-sky-dark"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
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
                  <Button variant="secondary" className="w-full">
                    Login
                  </Button>
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
  );
}
