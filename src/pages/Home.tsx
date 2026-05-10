import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, Clock, ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { formatCurrency, cn } from '../lib/utils';
import { useCart } from '../contexts/CartContext';

const categories = [
  { name: 'Fruits & Légumes', icon: '🥦', color: 'bg-green-50' },
  { name: 'Produits Laitiers', icon: '🥛', color: 'bg-blue-50' },
  { name: 'Viandes & Poissons', icon: '🍖', color: 'bg-red-50' },
  { name: 'Épicerie', icon: '🍝', color: 'bg-yellow-50' },
  { name: 'Boissons', icon: '🥤', color: 'bg-purple-50' },
  { name: 'Snacks', icon: '🍿', color: 'bg-orange-50' },
];

const featuredProducts = [
  { id: '1', name: 'Bananes Fraîches', price: 350, image: 'https://images.unsplash.com/photo-1603833665858-e81b1c7e4660?auto=format&fit=crop&q=80&w=400', category: 'Fruits' },
  { id: '2', name: 'Lait Entier 1L', price: 95, image: 'https://images.unsplash.com/photo-1563636619-e910ef497576?auto=format&fit=crop&q=80&w=400', category: 'Laiterie' },
  { id: '3', name: 'Huile d\'Olive 500ml', price: 850, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400', category: 'Épicerie' },
  { id: '4', name: 'Pain Artisanal', price: 15, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400', category: 'Boulangerie' },
];

export default function Home() {
  const { addToCart } = useCart();

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 bg-[#22C55E]/10 text-[#22C55E] rounded-full text-sm font-bold tracking-wide uppercase mb-6">
              Nouveau à Alger
            </span>
            <h1 className="text-6xl font-black text-gray-900 leading-[1.1] mb-6">
              Vos courses livrées <br />
              <span className="text-[#22C55E]">en un clin d'œil.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Jibli vous connecte aux meilleurs supermarchés locaux. Fraîcheur garantie, prix transparents et livraison ultra-rapide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/products" 
                className="inline-flex items-center justify-center px-8 py-4 bg-[#22C55E] text-white rounded-2xl font-bold text-lg hover:bg-[#1faa50] transition-all shadow-xl shadow-[#22C55E]/30"
              >
                Commencer mes achats
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-[#22C55E]/30 transition-all">
                Comment ça marche ?
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                <span className="text-gray-900 font-bold">+5,000</span> clients satisfaits à Alger
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Parcourir par catégories</h2>
            <p className="text-gray-500">Tout ce dont vous avez besoin, organisé pour vous.</p>
          </div>
          <Link to="/products" className="text-[#22C55E] font-bold flex items-center gap-1 hover:underline">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className={cn("p-6 rounded-3xl text-center transition-all cursor-pointer border border-transparent hover:border-[#22C55E]/20", cat.color)}
            >
              <span className="text-4xl mb-4 block">{cat.icon}</span>
              <span className="font-bold text-gray-900 text-sm">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
             <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Produits populaires</h2>
              <p className="text-gray-500">Les essentiels préférés de nos clients.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((p) => (
              <motion.div 
                key={p.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[40px] p-4 shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
              >
                <div className="aspect-square rounded-[32px] overflow-hidden mb-6 bg-gray-50 relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                  <button 
                    onClick={() => addToCart({ id: p.id, name: p.name, price: p.price, image_url: p.image, category_id: '', stock: 10, is_featured: true, description: '' })}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-all transform hover:scale-110"
                  >
                    <ShoppingBag className="w-6 h-6" />
                  </button>
                </div>
                <div className="px-2">
                  <span className="text-xs font-bold text-[#22C55E] uppercase tracking-wider mb-2 block">{p.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{p.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-gray-900">{formatCurrency(p.price)}</span>
                    <div className="flex items-center gap-1 text-[#FACC15]">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold text-gray-900">4.9</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-[#22C55E]/10 rounded-2xl flex items-center justify-center text-[#22C55E]">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Livraison Express</h3>
            <p className="text-gray-500 leading-relaxed">
              Vos courses chez vous en moins de 60 minutes. Nos livreurs sont formés pour garantir la rapidité.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-[#FACC15]/10 rounded-2xl flex items-center justify-center text-[#FACC15]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Paiement Sécurisé</h3>
            <p className="text-gray-500 leading-relaxed">
              Payez en espèces à la livraison ou via BaridiMob/CIB en toute sécurité.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-[#EF4444]/10 rounded-2xl flex items-center justify-center text-[#EF4444]">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Service 7j/7</h3>
            <p className="text-gray-500 leading-relaxed">
              Nous sommes là pour vous tous les jours, de 8h à 22h, pour ne jamais manquer de rien.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111827] rounded-[60px] p-12 md:p-20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              Devenez livreur Jibli et boostez vos revenus.
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Travaillez selon votre emploi du temps, soyez votre propre patron et découvrez votre ville.
            </p>
            <Link to="/auth?role=driver" className="inline-flex items-center px-10 py-5 bg-[#22C55E] text-white rounded-2xl font-bold text-lg hover:bg-[#1faa50] transition-all">
              Rejoindre l'équipe
              <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
          </div>
          <div className="hidden lg:block absolute top-0 right-0 w-1/3 h-full">
             <img 
              src="https://images.unsplash.com/photo-1577705998148-ebad193f8835?auto=format&fit=crop&q=80&w=600" 
              alt="Driver" 
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
