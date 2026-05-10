import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, addDoc, updateDoc, deleteDoc, doc, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Order, Category, UserProfile } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { 
  BarChart3, Package, Users, Truck, Plus, Search, 
  Trash2, Edit3, Save, X, LayoutDashboard, ShoppingBag, Star,
  CheckCircle, XCircle, UserPlus, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'drivers'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    stock: 0,
    category_id: '',
    description: '',
    image_url: '',
    is_featured: false
  });

  useEffect(() => {
    const prodUnsub = onSnapshot(query(collection(db, 'products'), orderBy('created_at', 'desc')), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    });
    const orderUnsub = onSnapshot(query(collection(db, 'orders'), orderBy('created_at', 'desc'), limit(50)), (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    });
    const catUnsub = onSnapshot(collection(db, 'categories'), (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
    });
    const userUnsub = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile)));
    });

    return () => {
      prodUnsub();
      orderUnsub();
      catUnsub();
      userUnsub();
    };
  }, []);

  const handleUpdateDriverStatus = async (userId: string, status: string) => {
    await updateDoc(doc(db, 'users', userId), { status });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        created_at: new Date().toISOString(),
      });
      setIsAddingProduct(false);
      setNewProduct({ name: '', price: 0, stock: 0, category_id: '', description: '', image_url: '', is_featured: false });
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  const toggleFeatured = async (productId: string, current: boolean) => {
    await updateDoc(doc(db, 'products', productId), { is_featured: !current });
  };

  const deleteProduct = async (productId: string) => {
    if (confirm("Supprimer ce produit ?")) {
      await deleteDoc(doc(db, 'products', productId));
    }
  };

  const stats = [
    { label: 'Revenu Total', value: formatCurrency(orders.reduce((sum, o) => sum + o.total, 0)), icon: BarChart3, color: 'text-blue-500 bg-blue-50' },
    { label: 'Commandes', value: orders.length, icon: ShoppingBag, color: 'text-[#22C55E] bg-[#22C55E]/10' },
    { label: 'Produits', value: products.length, icon: Package, color: 'text-[#FACC15] bg-[#FACC15]/10' },
    { label: 'Livreurs Actifs', value: users.filter(u => u.role === 'driver' && u.status === 'active').length, icon: Truck, color: 'text-[#EF4444] bg-[#EF4444]/10' },
  ];

  const chartData = [
    { name: 'Lun', sales: 4000 },
    { name: 'Mar', sales: 3000 },
    { name: 'Mer', sales: 2000 },
    { name: 'Jeu', sales: 2780 },
    { name: 'Ven', sales: 1890 },
    { name: 'Sam', sales: 2390 },
    { name: 'Dim', sales: 3490 },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F9FAFB]">
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-72 bg-white border-r border-gray-100 p-8">
        <h2 className="text-2xl font-black text-gray-900 mb-10 flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-[#22C55E]" />
          Dashboard
        </h2>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all",
              activeTab === 'overview' ? "bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <BarChart3 className="w-5 h-5" /> Vue d'ensemble
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all",
              activeTab === 'products' ? "bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Package className="w-5 h-5" /> Catalogue
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all",
              activeTab === 'orders' ? "bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <ShoppingBag className="w-5 h-5" /> Commandes
          </button>
          <button 
            onClick={() => setActiveTab('drivers')}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all",
              activeTab === 'drivers' ? "bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Users className="w-5 h-5" /> Chauffeurs
            {users.filter(u => u.role === 'driver' && u.status === 'pending').length > 0 && (
              <span className="ml-auto w-5 h-5 bg-[#EF4444] text-white rounded-full flex items-center justify-center text-[10px]">
                {users.filter(u => u.role === 'driver' && u.status === 'pending').length}
              </span>
            )}
          </button>
        </nav>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((s, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", s.color)}>
                      <s.icon className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="text-3xl font-black text-gray-900">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-8">Performance des Ventes (DZ)</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22C55E" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="sales" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'drivers' && (
            <motion.div key="drivers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="text-3xl font-black text-gray-900 mb-10">Gestion des Chauffeurs</h2>
              
              <div className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Nom / Contact</th>
                      <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Véhicule</th>
                      <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.filter(u => u.role === 'driver').map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6">
                           <div>
                             <p className="font-bold text-gray-900">{u.name}</p>
                             <p className="text-xs text-gray-500">{u.phone}</p>
                             {u.national_id && <p className="text-[10px] text-gray-400">ID: {u.national_id}</p>}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-700 capitalize">{u.vehicle_type}</span>
                            <span className="text-xs text-gray-400 font-mono">{u.plate_number}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className={cn(
                             "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                             u.status === 'active' ? "bg-green-50 text-green-500" :
                             u.status === 'pending' ? "bg-yellow-50 text-yellow-500" : "bg-red-50 text-red-500"
                           )}>
                             {u.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                             {u.status === 'pending' && (
                               <button onClick={() => handleUpdateDriverStatus(u.id, 'active')} className="p-2 bg-green-50 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all">
                                 <CheckCircle className="w-5 h-5" />
                               </button>
                             )}
                             {u.status !== 'rejected' && u.status !== 'suspended' && (
                               <button onClick={() => handleUpdateDriverStatus(u.id, 'suspended')} className="p-2 bg-yellow-50 text-yellow-500 rounded-xl hover:bg-yellow-500 hover:text-white transition-all">
                                 <ShieldAlert className="w-5 h-5" />
                               </button>
                             )}
                             {(u.status === 'suspended' || u.status === 'pending') && (
                               <button onClick={() => handleUpdateDriverStatus(u.id, 'rejected')} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                 <XCircle className="w-5 h-5" />
                               </button>
                             )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div 
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
                <h2 className="text-3xl font-black text-gray-900">Gestion du Catalogue</h2>
                <button 
                  onClick={() => setIsAddingProduct(true)}
                  className="flex items-center gap-2 px-8 py-4 bg-[#22C55E] text-white rounded-2xl font-bold shadow-lg shadow-[#22C55E]/20 hover:bg-[#1faa50] transition-all"
                >
                  <Plus className="w-5 h-5" /> Ajouter un produit
                </button>
              </div>

              <div className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Produit</th>
                      <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Catégorie</th>
                      <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Prix</th>
                      <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                      <th className="px-8 py-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <img src={p.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
                            <div>
                               <p className="font-bold text-gray-900">{p.name}</p>
                               {p.is_featured && <span className="text-[10px] text-[#22C55E] font-bold uppercase">Mis en avant</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                          {categories.find(c => c.id === p.category_id)?.name || 'N/A'}
                        </td>
                        <td className="px-8 py-6 font-bold text-gray-900">{formatCurrency(p.price)}</td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold",
                            p.stock < 10 ? "text-[#EF4444] bg-[#EF4444]/10" : "text-gray-500 bg-gray-50"
                          )}>
                            {p.stock} unités
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             <button onClick={() => toggleFeatured(p.id, p.is_featured)} className="p-2 text-gray-400 hover:text-[#FACC15]">
                               <Star className={cn("w-5 h-5", p.is_featured && "fill-current")} />
                             </button>
                             <button className="p-2 text-gray-400 hover:text-[#22C55E]">
                               <Edit3 className="w-5 h-5" />
                             </button>
                             <button onClick={() => deleteProduct(p.id)} className="p-2 text-gray-400 hover:text-[#EF4444]">
                               <Trash2 className="w-5 h-5" />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-3xl font-black text-gray-900 mb-10">Toutes les Commandes</h2>
              <div className="space-y-4">
                {orders.map(order => (
                   <div key={order.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex shadow-sm items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-gray-400" />
                         </div>
                         <div>
                            <h4 className="font-bold text-gray-900">Commande #{order.id.slice(-6).toUpperCase()}</h4>
                            <p className="text-xs text-gray-400 uppercase font-black tracking-widest">{order.status}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-10">
                         <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Client</p>
                            <p className="font-bold text-gray-900">{order.customer_name || 'Anonyme'}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-xs text-gray-400 uppercase font-bold mb-1">Total</p>
                            <p className="font-black text-[#22C55E] text-xl">{formatCurrency(order.total)}</p>
                         </div>
                         <button className="p-3 bg-gray-50 rounded-2xl hover:bg-[#22C55E]/10 hover:text-[#22C55E] transition-all">
                            <ChevronRight className="w-6 h-6" />
                         </button>
                      </div>
                   </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="bg-white rounded-[40px] p-10 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-gray-900">Nouveau Produit</h3>
                <button onClick={() => setIsAddingProduct(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Nom du produit</label>
                  <input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#22C55E]/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Prix (DZD)</label>
                  <input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#22C55E]/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Stock</label>
                  <input type="number" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#22C55E]/20" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Catégorie</label>
                   <select required value={newProduct.category_id} onChange={e => setNewProduct({...newProduct, category_id: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#22C55E]/20">
                     <option value="">Sélectionner</option>
                     {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Lien image</label>
                   <input value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#22C55E]/20" />
                </div>
                <div className="space-y-2 col-span-2">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Description</label>
                   <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#22C55E]/20 min-h-[100px]" />
                </div>
                <div className="col-span-2">
                  <button type="submit" className="w-full py-5 bg-[#22C55E] text-white rounded-2xl font-bold text-lg hover:bg-[#1faa50] transition-all">
                    Enregistrer le produit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>;
}
