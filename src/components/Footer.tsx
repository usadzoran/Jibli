import { Link } from 'react-router-dom';
import { ShoppingCart, Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-[#22C55E] rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gray-900">Jibli</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Vos courses livrées rapidement à votre porte. La solution moderne pour vos achats quotidiens en Algérie.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-[#22C55E] hover:bg-[#22C55E]/10 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-[#22C55E] hover:bg-[#22C55E]/10 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-[#22C55E] hover:bg-[#22C55E]/10 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-6">Liens Rapides</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-gray-500 hover:text-[#22C55E] transition-colors">Nos Produits</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-[#22C55E] transition-colors">À Propos</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-[#22C55E] transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-500 hover:text-[#22C55E] transition-colors">Questions fréquentes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-6">Légal</h4>
            <ul className="space-y-4">
              <li><Link to="/terms" className="text-gray-500 hover:text-[#22C55E] transition-colors">Conditions d'utilisation</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-[#22C55E] transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/cookies" className="text-gray-500 hover:text-[#22C55E] transition-colors">Gestion des cookies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                <span className="text-gray-500 text-sm">Sidi M'Hamed, Alger, Algérie</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                <span className="text-gray-500 text-sm">+213 (0) 555 12 34 56</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                <span className="text-gray-500 text-sm">contact@jibli.dz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Jibli. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="PayPal" className="h-4 grayscale opacity-50" referrerPolicy="no-referrer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3 grayscale opacity-50" referrerPolicy="no-referrer" />
            <span className="text-xs font-bold text-gray-400">CIB / EDAHABIA / CASH</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
