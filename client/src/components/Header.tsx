import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';
import { formatCurrency } from '../utils/format';
import { CurrencyTicker } from './CurrencyTicker';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', end: true, label: 'home' },
  { to: '/banners', label: 'banners' },
  { to: '/collection', label: 'collection' },
];

const NAV_LINK_BASE = 'flex h-full items-center px-3.5 text-xs transition-colors';
const NAV_LINK_ACTIVE = 'bg-terminal-700 text-terminal-50';
const NAV_LINK_INACTIVE = 'text-terminal-100 hover:text-terminal-50';

const AUTH_LINK_CLASS =
  'rounded-lg border border-terminal-500 px-3 py-2 text-xs text-terminal-100 transition-colors hover:border-brand hover:text-brand';

function Logo() {
  return (
    <Link to="/" className="shrink-0 text-xl font-bold text-terminal-50">
      <span className="text-brand">&lt;</span>GachaDev<span className="text-brand">/&gt;</span>
    </Link>
  );
}

function NavPills() {
  return (
    <nav className="flex h-11 shrink-0 overflow-hidden rounded-lg border border-terminal-500 bg-terminal-900">
      {NAV_ITEMS.map((item, index) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `${NAV_LINK_BASE} ${index < NAV_ITEMS.length - 1 ? 'border-r border-terminal-500' : ''} ${
              isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

const MOBILE_LINK_BASE = 'block border-b border-terminal-700 px-4 py-3 text-sm transition-colors';
const MOBILE_LINK_ACTIVE = 'bg-terminal-700 text-terminal-50';
const MOBILE_LINK_INACTIVE = 'text-terminal-100 hover:bg-terminal-800';

function MobileMenu({ onLogout }: { onLogout: () => void }) {
  return (
    <>
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `${MOBILE_LINK_BASE} ${isActive ? MOBILE_LINK_ACTIVE : MOBILE_LINK_INACTIVE}`}
        >
          {item.label}
        </NavLink>
      ))}
      <button
        onClick={onLogout}
        className="block w-full px-4 py-3 text-left text-sm text-danger transition-colors hover:bg-terminal-950"
      >
        logout
      </button>
    </>
  );
}

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="border-b border-terminal-600 bg-terminal-950">
      <div className="mx-auto max-w-5xl px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Logo />

          <div className="flex-1" />

          {isAuthenticated ? (
            <>
              <GameStats />

              <div className="hidden items-center gap-3 md:flex">
                <NavPills />
                <button
                  onClick={handleLogout}
                  className="h-11 shrink-0 rounded-lg border border-terminal-500 px-3 text-xs text-terminal-100 transition-colors hover:border-danger/60 hover:text-danger"
                >
                  logout
                </button>
              </div>

              <div className="relative md:hidden">
                <button
                  onClick={() => setMenuOpen(open => !open)}
                  aria-label="Menu"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-terminal-500 text-terminal-100 transition-colors hover:border-brand hover:text-brand"
                >
                  ☰
                </button>

                {menuOpen && (
                  <div
                    className="absolute top-full right-0 z-10 mt-2 w-44 overflow-hidden rounded-xl border border-terminal-500 bg-terminal-900 shadow-2xl"
                    onClick={() => setMenuOpen(false)}
                  >
                    <MobileMenu onLogout={handleLogout} />
                  </div>
                )}
              </div>
            </>
          ) : (
            <nav className="flex items-center gap-3">
              <Link to="/login" className={AUTH_LINK_CLASS}>
                login
              </Link>
              <Link to="/register" className={AUTH_LINK_CLASS}>
                register
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

function GameStats() {
  const { currency, cps } = useGame();

  return (
    <div className="flex h-11 shrink-0 items-center gap-3 rounded-lg border border-terminal-500 bg-terminal-900 px-3">
      <div className="text-center">
        <p className="text-xs text-terminal-100">tokens</p>
        <CurrencyTicker currency={currency} cps={cps} className="text-sm font-bold leading-tight text-currency" />
      </div>
      <div className="h-5.5 w-px shrink-0 bg-terminal-500" />
      <div className="text-center">
        <p className="text-xs text-terminal-100">/sec</p>
        <p className="text-sm font-bold leading-tight text-success">+{formatCurrency(cps)}</p>
      </div>
    </div>
  );
}
