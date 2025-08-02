import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">NG</span>
              </div>
              <span className="font-heading font-bold text-xl">Niarry Gouye</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Plateforme communautaire dédiée à la promotion et au développement 
              de la culture locale du quartier Niarry Gouye.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Rapide */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm">
                  Événements
                </Link>
              </li>
              <li>
                <Link to="/directory" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm">
                  Annuaire
                </Link>
              </li>
              <li>
                <Link to="/spaces" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm">
                  Espaces
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/spaces/reserve" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm">
                  Réservation d'espaces
                </Link>
              </li>
              <li>
                <Link to="/events/create" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm">
                  Organiser un événement
                </Link>
              </li>
              <li>
                <Link to="/directory/join" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm">
                  Rejoindre l'annuaire
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-300 hover:text-orange-400 transition-colors duration-200 text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin size={16} className="text-orange-400" />
                <span className="text-sm">Quartier Niarry Gouye, Dakar</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone size={16} className="text-orange-400" />
                <span className="text-sm">+221 77 123 45 67</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail size={16} className="text-orange-400" />
                <span className="text-sm">contact@niarrygouye.sn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm">
              © {currentYear} Niarry Gouye. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-1 text-gray-300 text-sm">
              <span>Fait avec</span>
              <Heart size={16} className="text-red-400" />
              <span>pour la communauté</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;