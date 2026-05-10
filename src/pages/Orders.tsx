import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Order, OrderStatus } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { Package, Clock, Truck, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const statusMap: Record<OrderStatus, { label: string, color: string, icon: any }> = {
  'pending': { label: 'En attente', color: 'text-yellow-500 bg-yellow-50', icon: Clock },
  'accepted': { label: 'Acceptée', color: 'text-blue-500 bg-blue-50', icon: CheckCircle2 },
  'picked_up': { label: 'En cours de livraison', color: 'text-purple-500 bg-purple-50', icon: Truck },
  'delivered': { label: 'Livrée', color: 'text-green-500 bg-green-50', icon: CheckCircle2 },
  'cancelled': { label: 'Annulée', color: 'text-red-500 bg-red-50', icon: XCircle },
};

export default function Orders() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    const q = query(
      collection(db, 'orders'),
      where('customer_id', '==', profile.id),
      orderBy('created_at', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ordersData);
      setLoading(false);
    });

    return unsubscribe;
  }, [profile]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22C55E]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Mes Commandes</h1>
          <p className="text-gray-500">Historique et suivi en temps réel.</p>
        </div>
        <div className="w-16 h-16 bg-[#22C55E]/10 rounded-3xl flex items-center justify-center text-[#22C55E]">
          <Package className="w-8 h-8" />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[40px] p-20 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-200" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucune commande</h3>
          <p className="text-gray-500 mb-8">Vous n'avez pas encore passé de commande chez Jibli.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = statusMap[order.status];
            const StatusIcon = status.icon;
            
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={order.id}
                className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all group"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0", status.color)}>
                      <StatusIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-gray-900">Commande #{order.id.slice(-6).toUpperCase()}</h3>
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", status.color)}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">
                        {order.created_at?.toDate().toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                         <span>{formatCurrency(order.total)}</span>
                         <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                         <span>{order.payment_method.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end gap-4">
                    <button className="p-3 bg-gray-50 rounded-2xl group-hover:bg-[#22C55E]/10 group-hover:text-[#22C55E] transition-all">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    {order.status === 'delivered' && (
                       <button className="text-xs font-bold text-[#22C55E] hover:underline">
                         Donner mon avis
                       </button>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    {order.status === 'pending' ? (
                      <span>En recherche d'un livreur...</span>
                    ) : order.status === 'cancelled' ? (
                      <span className="text-[#EF4444]">Cette commande a été annulée.</span>
                    ) : (
                      <span>Livreur assigné • Arrivée estimée dans 20 min</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
