import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import Footer from './components/Footer';
import PincodeCheckerModal from './components/PincodeCheckerModal';
import CategoryDrawer from './components/CategoryDrawer';

import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductListingPage from './pages/ProductListingPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AccountPage from './pages/AccountPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';

function MainApp() {
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState(() => window.location.pathname.replace(/^\/+|\/+$/g, '') === 'admin' ? 'admin' : 'home');
  const [pageParams, setPageParams] = useState({});
  const [pincodeModalOpen, setPincodeModalOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);

  const navigate = (page, params = {}) => {
    const nextPath = page === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== nextPath) window.history.pushState({}, '', nextPath);
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => setCurrentPage(window.location.pathname.replace(/^\/+|\/+$/g, '') === 'admin' ? 'admin' : 'home');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#eaeded] font-sans antialiased text-gray-900 selection:bg-amber-200 selection:text-amber-900">
      {/* Main Navbar */}
      <Navbar
        onNavigate={navigate}
        onOpenPincodeModal={() => setPincodeModalOpen(true)}
        onOpenCategoryDrawer={() => setCategoryDrawerOpen(true)}
      />

      {/* Subcategory Bar (hidden on checkout & admin for distraction-free flow) */}
      {currentPage !== 'checkout' && currentPage !== 'admin' && (
        <CategoryBar
          onNavigate={navigate}
          onOpenCategoryDrawer={() => setCategoryDrawerOpen(true)}
        />
      )}

      {/* Active Page View */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onNavigate={navigate} />
        )}

        {currentPage === 'product-detail' && (
          <ProductDetailPage
            productId={pageParams.productId}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'listing' && (
          <ProductListingPage
            queryParams={pageParams}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage onNavigate={navigate} />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            directBuyProduct={pageParams.directBuyProduct}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'order-success' && (
          <OrderSuccessPage
            order={pageParams.order}
            payment={pageParams.payment}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'track-order' && (
          <OrderTrackingPage
            orderNumber={pageParams.orderNumber}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'account' && (
          <AccountPage
            initialTab={pageParams.tab || 'profile'}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'admin' && (
          isAdmin ? <AdminDashboardPage onNavigate={navigate} /> : <AdminLoginPage onNavigate={navigate} />
        )}
      </main>

      {/* Footer (hidden on checkout for clean conversion funnel) */}
      {currentPage !== 'checkout' && (
        <Footer onNavigate={navigate} />
      )}

      {/* Global Modals & Drawers */}
      <PincodeCheckerModal
        isOpen={pincodeModalOpen}
        onClose={() => setPincodeModalOpen(false)}
      />
      <CategoryDrawer
        isOpen={categoryDrawerOpen}
        onClose={() => setCategoryDrawerOpen(false)}
        onNavigate={navigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MainApp />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
