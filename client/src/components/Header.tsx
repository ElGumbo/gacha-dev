import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';
import { formatCurrency } from '../utils/format';
import { CurrencyTicker } from './CurrencyTicker';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
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

      {isAuthenticated ? (
        <>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/banners" className="text-sm text-gray-700 hover:text-gray-900">
              Banners
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <GameStats />
            <button
              onClick={handleLogout}
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <nav className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-gray-700 hover:text-gray-900">
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
          >
            Register
          </Link>
        </nav>
      )}
    </header>
  );
}

function GameStats() {
  const { currency, cps } = useGame();

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-xs text-gray-500">Tokens</p>
        <CurrencyTicker currency={currency} cps={cps} className="text-sm font-medium text-gray-900" />
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">/sec</p>
        <p className="text-sm font-medium text-gray-900">+{formatCurrency(cps)}</p>
      </div>
    </div>
  );
}
