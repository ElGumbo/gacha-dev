import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <Link to="/" className="text-lg font-semibold text-gray-900">
        GachaDev
      </Link>

      <nav className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-gray-600">Hi, {user?.firstName}</span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
