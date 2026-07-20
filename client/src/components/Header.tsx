import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';
import { formatCurrency } from '../utils/format';
import { CurrencyTicker } from './CurrencyTicker';

const NAV_LINK_BASE = 'flex h-full items-center px-3.5 text-xs transition-colors';
const NAV_LINK_ACTIVE = 'bg-terminal-700 text-terminal-50';
const NAV_LINK_INACTIVE = 'text-terminal-100 hover:text-terminal-50';

const AUTH_LINK_CLASS =
  'rounded-lg border border-terminal-200 px-3 py-2 text-xs text-terminal-100 transition-colors hover:border-brand hover:text-brand';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="border-b border-terminal-800 bg-terminal-950">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 md:px-6">
        <Link to="/" className="shrink-0 text-lg font-bold text-terminal-50">
          <span className="text-brand">&lt;</span>GachaDev<span className="text-brand">/&gt;</span>
        </Link>

        <div className="flex-1" />

        {isAuthenticated ? (
          <>
            <GameStats />

            <nav className="flex h-11 shrink-0 overflow-hidden rounded-lg border border-terminal-800 bg-terminal-900">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `${NAV_LINK_BASE} border-r border-terminal-800 ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`
                }
              >
                home
              </NavLink>
              <NavLink
                to="/banners"
                className={({ isActive }) => `${NAV_LINK_BASE} ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`}
              >
                banners
              </NavLink>
            </nav>

            <button
              onClick={handleLogout}
              className="h-11 shrink-0 rounded-lg border border-terminal-200 px-3 text-xs text-terminal-100 transition-colors hover:border-danger/60 hover:text-danger"
            >
              logout
            </button>
          </>
        ) : (
          <nav className="flex shrink-0 items-center gap-3">
            <Link to="/login" className={AUTH_LINK_CLASS}>
              login
            </Link>
            <Link to="/register" className={AUTH_LINK_CLASS}>
              register
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

function GameStats() {
  const { currency, cps } = useGame();

  return (
    <div className="flex h-11 shrink-0 items-center gap-3 rounded-lg border border-terminal-800 bg-terminal-900 px-3">
      <div className="text-center">
        <p className="text-xs text-terminal-100">tokens</p>
        <CurrencyTicker currency={currency} cps={cps} className="text-sm font-bold leading-tight text-currency" />
      </div>
      <div className="h-5.5 w-px shrink-0 bg-terminal-700" />
      <div className="text-center">
        <p className="text-xs text-terminal-100">/sec</p>
        <p className="text-sm font-bold leading-tight text-success">+{formatCurrency(cps)}</p>
      </div>
    </div>
  );
}
