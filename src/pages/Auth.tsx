import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { ShoppingCart, Mail, Lock, User, Phone, ArrowRight, Chrome } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole, UserProfile } from '../types';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const roleParam = searchParams.get('role') as UserRole;
    if (roleParam && (roleParam === 'customer' || roleParam === 'driver')) {
      setRole(roleParam);
      setIsLogin(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: name });
        
        const userProfile: UserProfile = {
          id: user.uid,
          name,
          email,
          phone,
          role,
          created_at: new Date().toISOString(),
        };

        await setDoc(doc(db, 'users', user.uid), userProfile);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        const userProfile: UserProfile = {
          id: user.uid,
          name: user.displayName || 'Utilisateur',
          email: user.email || '',
          role: 'customer',
          created_at: new Date().toISOString(),
        };
        await setDoc(doc(db, 'users', user.uid), userProfile);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl shadow-gray-100 border border-gray-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#22C55E] rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
              <ShoppingCart className="text-white w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              {isLogin ? 'Bon retour !' : 'Rejoindre Jibli'}
            </h2>
            <p className="text-gray-500">
              {isLogin ? 'Heureux de vous revoir parmi nous.' : 'Commencez vos courses en toute simplicité.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-3 rounded-2xl text-sm font-bold border-2 transition-all ${
                      role === 'customer' 
                      ? 'border-[#22C55E] bg-[#22C55E]/5 text-[#22C55E]' 
                      : 'border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('driver')}
                    className={`py-3 rounded-2xl text-sm font-bold border-2 transition-all ${
                      role === 'driver' 
                      ? 'border-[#22C55E] bg-[#22C55E]/5 text-[#22C55E]' 
                      : 'border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    Livreur
                  </button>
                </div>
                
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Nom complet"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="Numéro de téléphone"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="Email"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                placeholder="Mot de passe"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-[#EF4444] font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#22C55E] text-white rounded-2xl font-bold text-lg hover:bg-[#1faa50] transition-all shadow-lg shadow-[#22C55E]/20 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  {isLogin ? 'Se connecter' : 'S\'inscrire'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-gray-100 flex-grow"></div>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">ou</span>
              <div className="h-px bg-gray-100 flex-grow"></div>
            </div>

            <button 
              onClick={handleGoogleSignIn}
              className="w-full py-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
            >
              <Chrome className="w-5 h-5 text-blue-500" />
              Continuer avec Google
            </button>

            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-gray-500 hover:text-[#22C55E] transition-colors"
            >
              {isLogin ? "Vous n'avez pas de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
