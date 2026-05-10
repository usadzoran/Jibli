import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Order, OrderStatus } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { Truck, MapPin, Phone, CheckCircle2, Package, Navigation, Clock, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DriverDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'available' | 'ongoing' | 'history'>('ongoing');
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile || profile.status !== 'active') {
      setLoading(false);
      return;
    }

    // Available orders (status pending)
    const availableQ = query(
      collection(db, 'orders'),
      where('status', '==', 'pending'),
      orderBy('created_at', 'desc')
    );

    // My ongoing or past orders
    const myOrdersQ = query(
      collection(db, 'orders'),
      where('driver_id', '==', profile.id),
      orderBy('created_at', 'desc')
    );

    const unsubAvailable = onSnapshot(availableQ, (snap) => {
      setAvailableOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    });

    const unsubMy = onSnapshot(myOrdersQ, (snap) => {
      setMyOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    });

    return () => {
      unsubAvailable();
      unsubMy();
    };
  }, [profile]);

  if (profile?.status === 'pending') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-yellow-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 transform rotate-12">
            <Clock className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Compte en attente</h1>
          <p className="text-gray-500 mb-8 font-medium">
            Votre inscription en tant que livreur a bien été reçue. Notre équipe examine actuellement vos documents. 
            Vous recevrez un accès complet dès que votre compte sera approuvé.
          </p>
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-left space-y-3">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Informations transmises</p>
             <p className="text-sm"><strong>ID National:</strong> {profile.national_id}</p>
             <p className="text-sm"><strong>Véhicule:</strong> {profile.vehicle_type}</p>
             <p className="text-sm"><strong>Plaque:</strong> {profile.plate_number}</p>
          </div>
        </div>
      </div>
    );
  }

  if (profile?.status === 'rejected' || profile?.status === 'suspended') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-red-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 transform -rotate-12">
            <Truck className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Accès Refusé</h1>
          <p className="text-gray-500 mb-8 font-medium">
            Votre compte chauffeur a été {profile.status === 'rejected' ? 'refusé' : 'suspendu'}. 
            Veuillez contacter le support pour plus d'informations.
          </p>
        </div>
      </div>
    );
  }

  const ongoingOrders = myOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const historyOrders = myOrders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  const acceptOrder = async (orderId: string) => {
    if (!profile) return;
    await updateDoc(doc(db, 'orders', orderId), {
      driver_id: profile.id,
      status: 'accepted'
    });
    setActiveTab('ongoing');
  };

  const updateStatus = async (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = currentStatus;
    if (currentStatus === 'accepted') nextStatus = 'picked_up';
    else if (currentStatus === 'picked_up') nextStatus = 'delivered';
    
    await updateDoc(doc(db, 'orders', orderId), {
      status: nextStatus
    });
  };

  const earnings = historyOrders.reduce((sum, o) => sum + (o.delivery_fee || 200), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Espace Livreur</h1>
          <p className="text-gray-500">Prêt pour une nouvelle livraison ?</p>
        </div>
        <div className="bg-[#111827] text-white rounded-[32px] p-6 px-10 shadow-xl flex items-center gap-6">
           <div className="w-12 h-12 bg-[#22C55E]/20 rounded-2xl flex items-center justify-center">
              <Banknote className="w-6 h-6 text-[#22C55E]" />
           </div>
           <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Gains du jour</p>
              <p className="text-3xl font-black">{formatCurrency(earnings)}</p>
           </div>
        </div>
      </div>

      <div className="flex gap-2 p-2 bg-gray-100 rounded-3xl mb-10 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('ongoing')}
          className={cn(
            "flex-1 px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap",
            activeTab === 'ongoing' ? "bg-white text-[#22C55E] shadow-sm" : "text-gray-500"
          )}
        >
          En cours ({ongoingOrders.length})
        </button>
        <button 
          onClick={() => setActiveTab('available')}
          className={cn(
            "flex-1 px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap",
            activeTab === 'available' ? "bg-white text-[#22C55E] shadow-sm" : "text-gray-500"
          )}
        >
          Disponibles ({availableOrders.length})
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={cn(
            "flex-1 px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap",
            activeTab === 'history' ? "bg-white text-[#22C55E] shadow-sm" : "text-gray-500"
          )}
        >
          Historique
        </button>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'available' && (
            <motion.div key="available" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {availableOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold">Aucune commande disponible pour le moment.</p>
                </div>
              ) : (
                availableOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                      <div className="space-y-6 flex-grow">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                           </div>
                           <div>
                              <h3 className="font-bold text-gray-900 text-lg">Commande #{order.id.slice(-6).toUpperCase()}</h3>
                              <p className="text-sm text-gray-400">Total: <span className="text-[#22C55E] font-bold">{formatCurrency(order.total)}</span></p>
                           </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                           <MapPin className="w-5 h-5 text-[#EF4444] mt-1" />
                           <p className="text-sm text-gray-600 leading-relaxed font-medium">{order.delivery_address}</p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center gap-4">
                         <button 
                          onClick={() => acceptOrder(order.id)}
                          className="px-10 py-4 bg-[#22C55E] text-white rounded-2xl font-bold shadow-lg shadow-[#22C55E]/20 hover:bg-[#1faa50] transition-all"
                         >
                           Accepter la commande
                         </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'ongoing' && (
            <motion.div key="ongoing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {ongoingOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold">Vous n'avez aucune livraison en cours.</p>
                </div>
              ) : (
                ongoingOrders.map(order => (
                  <div key={order.id} className="bg-[#111827] text-white rounded-[40px] p-8 md:p-10 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 h-full opacity-10">
                      <Truck className="w-40 h-40" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10">
                        <div>
                          <span className="px-4 py-1 bg-[#22C55E] rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                             {order.status === 'accepted' ? 'À récupérer' : 'En livraison'}
                          </span>
                          <h3 className="text-2xl font-black">Commande #{order.id.slice(-6).toUpperCase()}</h3>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-gray-400 font-bold uppercase mb-1">Encaissement</p>
                           <p className="text-3xl font-black text-[#22C55E]">{formatCurrency(order.total)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-gray-400">
                              <UserIcon className="w-5 h-5" />
                              <span className="font-bold text-white">{order.customer_name}</span>
                           </div>
                           <div className="flex items-center gap-3 text-gray-400">
                              <Phone className="w-5 h-5" />
                              <a href={`tel:${order.customer_phone}`} className="hover:text-[#22C55E] transition-colors">{order.customer_phone}</a>
                           </div>
                        </div>
                        <div className="flex items-start gap-3 text-gray-400">
                           <MapPin className="w-5 h-5 flex-shrink-0" />
                           <span className="text-sm leading-relaxed">{order.delivery_address}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.delivery_address)}`} 
                          target="_blank" rel="noreferrer"
                          className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2"
                        >
                          <Navigation className="w-5 h-5" /> Navigation
                        </a>
                        <button 
                          onClick={() => updateStatus(order.id, order.status)}
                          className="flex-1 py-4 bg-[#22C55E] hover:bg-[#1faa50] text-white rounded-2xl font-bold shadow-xl shadow-[#22C55E]/20 flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          {order.status === 'accepted' ? 'Marquer comme récupéré' : 'Confirmer la livraison'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
             <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {historyOrders.map(order => (
                   <div key={order.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between opacity-70">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                         </div>
                         <div>
                            <h4 className="font-bold text-gray-900">Commande #{order.id.slice(-6).toUpperCase()}</h4>
                            <p className="text-xs text-gray-400 uppercase font-black">{order.status}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-gray-400 font-bold mb-1">Gain</p>
                         <p className="font-bold text-gray-900">+ {formatCurrency(order.delivery_fee || 200)}</p>
                      </div>
                   </div>
                ))}
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
   return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
