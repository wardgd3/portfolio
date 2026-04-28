import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { MobileDrawer } from './MobileDrawer';

const links = [
  { to: '/gallery', label: 'Works' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Nav() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md rule-b">
      <div className="mx-auto max-w-editorial px-6 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-baseline gap-3 group" aria-label="Home">
            <span className="font-serif text-2xl md:text-[28px] font-light tracking-tight">
              Studio
            </span>
            <span className="hidden md:inline label">/ paintings &amp; drawings</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `label-strong hover:text-ink/60 transition-colors ${isActive ? 'underline underline-offset-[6px] decoration-[0.5px]' : ''}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/cart" className="label-strong hover:text-ink/60 transition-colors">
              Cart <span className="ml-1 font-mono text-[10.5px]">[{String(count).padStart(2, '0')}]</span>
            </Link>
          </nav>

          {/* Mobile: cart count + menu trigger */}
          <div className="md:hidden flex items-center gap-5">
            <Link to="/cart" className="label-strong" aria-label={`Cart with ${count} items`}>
              Cart [{String(count).padStart(2, '0')}]
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="label-strong"
              aria-label="Open menu"
              aria-expanded={open}
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        currentPath={location.pathname}
      />
    </header>
  );
}
