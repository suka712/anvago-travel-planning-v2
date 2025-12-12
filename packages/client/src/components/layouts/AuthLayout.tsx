import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4FC3F7]/20 via-[#FAFAF8] to-[#81D4FA]/20 flex flex-col">
      {/* Simple Header */}
      <header className="p-4">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 bg-[#4FC3F7] rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
            <span className="text-xl font-bold">A</span>
          </div>
          <span className="text-xl font-bold">Anvago</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>

      {/* Simple Footer */}
      <footer className="p-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Anvago • Travel the world your way
      </footer>
    </div>
  );
}

