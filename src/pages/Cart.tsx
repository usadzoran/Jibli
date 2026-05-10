import { useCart } from '../contexts/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal, deliveryFee, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingCart className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Votre panier est vide</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          On dirait que vous n'avez pas encore ajouté de produits. Découvrez notre catalogue pour trouver votre bonheur.
        </p>
        <Link 
          to="/products" 
          className="inline-flex items-center px-8 py-4 bg-[#22C55E] text-white rounded-2xl font-bold text-lg hover:bg-[#1faa50] transition-all shadow-xl shadow-[#22C55E]/20"
        >
          Parcourir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-black text-gray-900 mb-10">Mon Panier</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div 
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={item.id}
              className="bg-white rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm border border-gray-100"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-[#22C55E] font-bold">{formatCurrency(item.price)}</p>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-gray-400 hover:text-[#EF4444] shadow-sm transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-black text-gray-900 w-8 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-gray-400 hover:text-[#22C55E] shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right flex flex-col items-center sm:items-end gap-2">
                <span className="text-xl font-black text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-[#EF4444] transition-colors p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-gray-100 border border-gray-100 sticky top-24">
            <h3 className="text-2xl font-black text-gray-900 mb-8">Récapitulatif</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500">
                <span>Sous-total</span>
                <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Frais de livraison</span>
                <span className="font-bold text-[#22C55E]">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-black text-gray-900">Total</span>
                <span className="text-3xl font-black text-[#22C55E]">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-dashed border-gray-200">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">Code promo</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Entrez votre code" className="flex-grow bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20" />
                <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold">Appliquer</button>
              </div>
            </div>

            <Link 
              to="/checkout"
              className="w-full py-5 bg-[#22C55E] text-white rounded-2xl font-bold text-lg hover:bg-[#1faa50] transition-all shadow-xl shadow-[#22C55E]/20 flex items-center justify-center group"
            >
              Commander
              <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
            </Link>

            <p className="text-center text-xs text-gray-400 mt-6 font-medium">
              Livraison estimée en <span className="text-gray-900 font-bold">45-60 min</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
