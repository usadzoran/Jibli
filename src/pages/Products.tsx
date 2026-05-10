import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Category } from '../types';
import { ShoppingBag, Search, Filter, Star, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency, cn } from '../lib/utils';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        const catSnap = await getDocs(collection(db, 'categories'));
        const cats = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(cats);

        const prodSnap = await getDocs(collection(db, 'products'));
        const prods = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(prods);
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22C55E]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Catégories</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                  selectedCategory === 'all' ? "bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20" : "bg-white text-gray-500 hover:bg-gray-100"
                )}
              >
                Tous les produits
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                    selectedCategory === cat.id ? "bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20" : "bg-white text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111827] rounded-[40px] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[#FACC15] font-bold text-xs uppercase tracking-widest mb-2 block">Promotion</span>
              <h4 className="text-2xl font-bold mb-4">Livraison gratuite !</h4>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Sur votre première commande avec le code <span className="text-white font-bold">WELCOME</span>
              </p>
              <button className="bg-white text-gray-900 px-6 py-2 rounded-xl font-bold text-sm">
                Activer
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#22C55E] rounded-full blur-3xl opacity-20"></div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Rechercher par nom..." 
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Trier par :</label>
              <select className="bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none">
                <option>Pertinence</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-500">Essayez d'ajuster vos filtres ou votre recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={p.id}
                    className="bg-white rounded-[40px] p-4 shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
                  >
                    <div className="aspect-square rounded-[32px] overflow-hidden mb-6 bg-gray-50 relative">
                      <img 
                        src={p.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400'} 
                        alt={p.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                        referrerPolicy="no-referrer"
                      />
                      <button 
                        onClick={() => addToCart(p)}
                        className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-all transform hover:scale-110"
                      >
                        <ShoppingBag className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="px-2">
                      <div className="flex items-center gap-1 text-[#FACC15] mb-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Premium</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{p.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-black text-gray-900">{formatCurrency(p.price)}</span>
                        {p.stock < 10 && p.stock > 0 && (
                          <span className="text-[10px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-2 py-1 rounded-full uppercase">Stock Faible</span>
                        )}
                        {p.stock === 0 && (
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full uppercase">Épuisé</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
