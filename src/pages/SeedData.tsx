import { useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Category } from '../types';
import { Database, Trash2, RefreshCw } from 'lucide-react';

const MOCK_CATEGORIES = [
  { name: 'Fruits & Légumes', icon: '🥦', slug: 'fruits-legumes' },
  { name: 'Produits Laitiers', icon: '🥛', slug: 'produits-laitiers' },
  { name: 'Viandes & Poissons', icon: '🍖', slug: 'viandes-poissons' },
  { name: 'Épicerie', icon: '🍝', slug: 'epicerie' },
  { name: 'Boissons', icon: '🥤', slug: 'boissons' },
  { name: 'Snacks', icon: '🍿', slug: 'snacks' },
  { name: 'Produits Ménagers', icon: '🧹', slug: 'produits-menagers' },
  { name: 'Hygiène & Beauté', icon: '🧴', slug: 'hygiene-beaute' },
];

const MOCK_PRODUCTS = [
  { name: 'Bananes Fraîches', price: 350, categoryName: 'Fruits & Légumes', stock: 100, is_featured: true, image_url: 'https://images.unsplash.com/photo-1603833665858-e81b1c7e4660?auto=format&fit=crop&q=80&w=400', description: 'Bananes douces et savoureuses.' },
  { name: 'Pommes Rouges', price: 280, categoryName: 'Fruits & Légumes', stock: 150, is_featured: false, image_url: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=400', description: 'Pommes croquantes de saison.' },
  { name: 'Lait Entier 1L', price: 95, categoryName: 'Produits Laitiers', stock: 200, is_featured: true, image_url: 'https://images.unsplash.com/photo-1563636619-e910ef497576?auto=format&fit=crop&q=80&w=400', description: 'Lait entier pasteurisé.' },
  { name: 'Fromage Camembert', price: 450, categoryName: 'Produits Laitiers', stock: 50, is_featured: false, image_url: 'https://images.unsplash.com/photo-1634487359989-3e90c9432133?auto=format&fit=crop&q=80&w=400', description: 'Fromage à pâte molle.' },
  { name: 'Boeuf Bourguignon 500g', price: 1200, categoryName: 'Viandes & Poissons', stock: 30, is_featured: true, image_url: 'https://images.unsplash.com/photo-1544026354-94943f550993?auto=format&fit=crop&q=80&w=400', description: 'Boeuf de qualité supérieure.' },
  { name: 'Pâtes Penne 500g', price: 120, categoryName: 'Épicerie', stock: 300, is_featured: false, image_url: 'https://images.unsplash.com/photo-1551462147-37885abb3e4a?auto=format&fit=crop&q=80&w=400', description: 'Pâtes de blé dur.' },
  { name: 'Coca-Cola 1.5L', price: 110, categoryName: 'Boissons', stock: 500, is_featured: false, image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400', description: 'Boisson rafraîchissante.' },
  { name: 'Chips Classic 150g', price: 180, categoryName: 'Snacks', stock: 200, is_featured: false, image_url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=400', description: 'Chips croustillantes.' },
];

export default function SeedData() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const seed = async () => {
    setLoading(true);
    setStatus('Seeding categories...');
    try {
      const categoryMap: Record<string, string> = {};
      
      for (const cat of MOCK_CATEGORIES) {
        const docRef = await addDoc(collection(db, 'categories'), cat);
        categoryMap[cat.name] = docRef.id;
      }

      setStatus('Seeding products...');
      for (const prod of MOCK_PRODUCTS) {
        const { categoryName, ...productData } = prod;
        await addDoc(collection(db, 'products'), {
          ...productData,
          category_id: categoryMap[categoryName],
          created_at: new Date().toISOString(),
        });
      }
      setStatus('Done! Database populated.');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    setLoading(true);
    setStatus('Clearing categories...');
    try {
      const catSnap = await getDocs(collection(db, 'categories'));
      for (const d of catSnap.docs) await deleteDoc(doc(db, 'categories', d.id));

      setStatus('Clearing products...');
      const prodSnap = await getDocs(collection(db, 'products'));
      for (const d of prodSnap.docs) await deleteDoc(doc(db, 'products', d.id));

      setStatus('Done! Database cleared.');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-6 h-6 text-[#22C55E]" />
        <h2 className="text-2xl font-bold">Base de données</h2>
      </div>
      <p className="text-gray-500 mb-8 text-sm">
        Utilisez ces outils pour peupler votre catalogue avec des données d'exemple ou tout réinitialiser.
      </p>
      
      <div className="space-y-4">
        <button 
          onClick={seed} 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#22C55E] text-white rounded-2xl font-bold hover:bg-[#1faa50] disabled:opacity-50 transition-all"
        >
          {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
          Seed Mock Data
        </button>
        <button 
          onClick={clear} 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-[#EF4444] text-[#EF4444] rounded-2xl font-bold hover:bg-[#EF4444]/5 disabled:opacity-50 transition-all"
        >
          {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
          Clear All Data
        </button>
      </div>

      {status && (
        <div className="mt-8 p-4 bg-gray-50 rounded-xl text-xs font-mono text-gray-600 break-all">
          {status}
        </div>
      )}
    </div>
  );
}
