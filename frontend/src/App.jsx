import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import { useEffect } from 'react';

function PageTitleSetter() {
  const location = useLocation();
  const titles = {
    '/': 'Dashboard',
    '/products': 'Products',
    '/customers': 'Customers',
    '/orders': 'Orders',
  };
  useEffect(() => {
    document.title = `${titles[location.pathname] || 'NexStock Pro'} | NexStock Pro`;
  }, [location.pathname]);
  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <PageTitleSetter />
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </>
  );
}
