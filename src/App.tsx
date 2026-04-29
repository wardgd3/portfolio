import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Artwork from './pages/Artwork';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import WorksList from './pages/admin/WorksList';
import WorkEditor from './pages/admin/WorkEditor';
import Orders from './pages/admin/Orders';
import Inquiries from './pages/admin/Inquiries';
import Help from './pages/admin/Help';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminGuard } from './components/admin/AdminGuard';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return; // let the browser handle in-page anchors (Help TOC)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

function PublicShell() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-editorial px-6 md:px-10 py-32 text-center">
      <p className="label-strong mb-4">404</p>
      <h1 className="editorial-h text-4xl">Page not found.</h1>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public site */}
        <Route element={<PublicShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/works/:slug" element={<Artwork />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="works" element={<WorksList />} />
          <Route path="works/new" element={<WorkEditor />} />
          <Route path="works/:id" element={<WorkEditor />} />
          <Route path="orders" element={<Orders />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </>
  );
}
