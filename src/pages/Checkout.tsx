import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../lib/utils';
import { MapPin, Phone, CreditCard, Banknote, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Checkout() {
  const { profile } = useAuth();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSubmitting(true);

    try {
      // 1. Create the order document
      const orderRef = await addDoc(collection(db, 'orders'), {
        customer_id: profile.id,
        customer_name: profile.name,
        customer_phone: phone,
        status: 'pending',
        subtotal,
        delivery_fee: deliveryFee,
        total,
        payment_method: paymentMethod,
        delivery_address: address,
        notes,
        created_at: serverTimestamp(),
      });

      // 2. Add order items
      const batch = writeBatch(db);
      items.forEach((item) => {
        const itemRef = doc(collection(db, `orders/${orderRef.id}/items`));
        batch.set(itemRef, {
          order_id: orderRef.id,
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          image_url: item.image_url,
        });
      });
      
      await batch.commit();
      
      setIsSuccess(true);
      clearCart();
      
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (err) {
      console.error("Order failed", err);
      alert("Une erreur est survenue lors de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[60px] p-12 text-center shadow-2xl shadow-gray-100 border border-gray-100 max-w-lg w-full"
        >
          <div className="w-24 h-24 bg-[#22C55E]/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-[#22C55E]" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Commande Confirmée !</h2>
          <p className="text-gray-500 mb-10 text-lg leading-relaxed">
            Merci pour votre confiance. Votre commande est en cours de préparation et un livreur sera bientôt assigné.
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/orders')}
              className="py-4 bg-[#22C55E] text-white rounded-2xl font-bold text-lg"
            >
              Suivre ma commande
            </button>
            <p className="text-sm text-gray-400">Redirection automatique dans quelques secondes...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-black text-gray-900 mb-10">Finaliser ma commande</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Delivery Section */}
          <section className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#22C55E]/10 rounded-2xl flex items-center justify-center text-[#22C55E]">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Adresse de livraison</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Adresse exacte</label>
                <textarea 
                  required
                  placeholder="Ex: Cité 5 Juillet, Bâtiment 4, Appartement 12, Sidi M'Hamed, Alger"
                  className="w-full p-6 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] min-h-[120px] transition-all"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="tel"
                    required
                    placeholder="Votre numéro"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Notes pour le livreur (Optionnel)</label>
                <input 
                  type="text"
                  placeholder="Ex: Interphone en panne, à côté de la boulangerie..."
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#FACC15]/10 rounded-2xl flex items-center justify-center text-[#FACC15]">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Moyen de paiement</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all ${
                  paymentMethod === 'cod' ? 'border-[#22C55E] bg-[#22C55E]/5' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'cod' ? 'border-[#22C55E] bg-[#22C55E]' : 'border-gray-300'
                }`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Payer à la livraison</p>
                </div>
                <Banknote className="ml-auto w-6 h-6 text-gray-400" />
              </button>

              <button 
                type="button"
                onClick={() => setPaymentMethod('baridimob')}
                className={`flex items-center gap-4 p-6 rounded-3xl border-2 transition-all ${
                  paymentMethod === 'baridimob' ? 'border-[#22C55E] bg-[#22C55E]/5' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'baridimob' ? 'border-[#22C55E] bg-[#22C55E]' : 'border-gray-300'
                }`}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">BaridiMob</p>
                  <p className="text-xs text-gray-500">Paiement électronique</p>
                </div>
                <CheckCircle2 className="ml-auto w-6 h-6 text-gray-400" />
              </button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#111827] text-white rounded-[40px] p-10 shadow-2xl sticky top-24">
            <h3 className="text-2xl font-black mb-8">Ma Commande</h3>
            
            <div className="space-y-4 mb-8 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-sm font-medium opacity-80">{item.quantity}x {item.name}</span>
                  <span className="text-sm font-bold">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8 border-t border-white/10 pt-8">
              <div className="flex justify-between opacity-60 text-sm">
                <span>Sous-total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between opacity-60 text-sm">
                <span>Livraison</span>
                <span className="text-[#22C55E]">Gratuit</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-xl font-black">Total</span>
                <span className="text-4xl font-black text-[#22C55E]">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 mb-8 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
              <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                En confirmant, vous acceptez nos conditions d'utilisation et notre politique de protection des données.
              </p>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-[#22C55E] text-white rounded-2xl font-bold text-xl hover:bg-[#1faa50] transition-all flex items-center justify-center group disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  Confirmer et payer
                  <ArrowRight className="ml-2 w-6 h-6 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
