import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#22C55E] rounded-xl flex items-center justify-center transform rotate-12 transition-transform hover:rotate-0">
                <ShoppingCart className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Jibli</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/products" className="text-gray-600 hover:text-[#22C55E] font-medium transition-colors">Produits</Link>
              <div className="flex items-center gap-1 text-gray-500 text-sm bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <MapPin className="w-4 h-4 text-[#EF4444]" />
                <span>Alger, DZ</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Chercher un produit..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] w-64 transition-all"
              />
            </div>

            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-[#22C55E] transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {profile ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={profile.role === 'admin' ? '/admin' : profile.role === 'driver' ? '/driver' : '/orders'} 
                  className="flex items-center gap-2 p-1 pr-3 bg-gray-50 rounded-full border border-gray-100 hover:border-[#22C55E]/30 transition-all"
                >
                  <div className="w-8 h-8 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#22C55E]" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{profile.name}</span>
                </Link>
                <button onClick={handleSignOut} className="p-2 text-gray-400 hover:text-[#EF4444] transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="bg-[#22C55E] text-white px-6 py-2 rounded-full font-medium hover:bg-[#1faa50] transition-all shadow-lg shadow-[#22C55E]/20"
              >
                Connexion
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
             <Link to="/cart" className="relative p-2 text-gray-600">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <Link to="/products" className="block text-lg font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Produits</Link>
              {profile ? (
                <>
                  <Link to={profile.role === 'admin' ? '/admin' : profile.role === 'driver' ? '/driver' : '/orders'} className="block text-lg font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Mon Compte</Link>
                  <button onClick={handleSignOut} className="block w-full text-left text-lg font-medium text-[#EF4444]">Déconnexion</button>
                </>
              ) : (
                <Link to="/auth" className="block text-lg font-medium text-[#22C55E]" onClick={() => setIsMenuOpen(false)}>Connexion / Inscription</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
