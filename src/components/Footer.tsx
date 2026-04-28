import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="rule-t mt-32">
      <div className="mx-auto max-w-editorial px-6 md:px-10 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl font-light leading-[1.1]">Studio</p>
          <p className="label mt-3">Paintings &amp; drawings</p>
        </div>
        <div>
          <p className="label">Visit</p>
          <p className="font-serif text-lg font-light mt-2 leading-snug">
            By appointment<br />Nashville, Tennessee
          </p>
        </div>
        <div>
          <p className="label">Index</p>
          <ul className="mt-2 space-y-1.5 font-serif text-lg font-light">
            <li><Link to="/gallery">Works</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="rule-t">
        <div className="mx-auto max-w-editorial px-6 md:px-10 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="label">© {new Date().getFullYear()} Studio. All works copyright the artist.</p>
          <p className="label">Site by the studio</p>
        </div>
      </div>
    </footer>
  );
}
