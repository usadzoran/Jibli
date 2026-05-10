import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load pages for better performance
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import SeedData from './pages/SeedData';
import NotFound from './pages/NotFound';

function AppRoutes() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#22C55E]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/seed" element={<SeedData />} />
          
          {/* Protected Routes */}
          <Route path="/checkout" element={profile ? <Checkout /> : <Navigate to="/auth" />} />
          <Route path="/orders" element={profile ? <Orders /> : <Navigate to="/auth" />} />
          
          {/* Admin Routes (Hidden) */}
          <Route path="/secure-admin-jibli/*" element={profile?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          
          {/* Driver Routes */}
          <Route path="/driver/*" element={profile?.role === 'driver' ? <DriverDashboard /> : <Navigate to="/" />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
