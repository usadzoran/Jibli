import { Link } from 'react-router-dom';
import { ShoppingCart, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-[#22C55E]/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 transform rotate-12">
          <ShoppingCart className="w-12 h-12 text-[#22C55E]" />
        </div>
        <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-8">Oups ! Cette page n'existe pas.</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          Il semble que vous vous soyez perdu en chemin. Retournez à l'accueil pour continuer vos courses.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-8 py-4 bg-[#22C55E] text-white rounded-2xl font-bold text-lg hover:bg-[#1faa50] transition-all shadow-xl shadow-[#22C55E]/20"
        >
          <Home className="mr-2 w-5 h-5" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
