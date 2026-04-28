import { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  open: boolean;
  onClose: () => void;
  currentPath: string;
}

const links = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Works' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/cart', label: 'Cart' },
];

export function MobileDrawer({ open, onClose, currentPath }: Props) {
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  // Close on route change
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-ink/30 transition-opacity duration-300 z-40 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 w-[82%] max-w-sm bg-paper z-50 md:hidden
                    transform transition-transform duration-300 ease-out
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-label="Site menu"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between h-16 px-6 rule-b">
          <span className="font-serif text-xl font-light">Studio</span>
          <button
            type="button"
            onClick={onClose}
            className="label-strong"
            aria-label="Close menu"
          >
            Close
          </button>
        </div>
        <nav className="flex flex-col px-6 py-8 gap-7">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onClose}
              className="font-serif text-3xl font-light tracking-tight"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 mt-auto pb-10">
          <p className="label">Studio © {new Date().getFullYear()}</p>
        </div>
      </aside>
    </>
  );
}
