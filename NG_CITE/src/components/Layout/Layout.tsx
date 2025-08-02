import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Pages qui nécessitent une authentification
  const protectedRoutes = [
    '/events/create',
    '/spaces/reserve',
    '/messages',
    '/profile',
    '/settings',
    '/admin'
  ];
  
  // Vérifier si la route actuelle nécessite une authentification
  const isProtectedRoute = protectedRoutes.some(route => 
    location.pathname.startsWith(route)
  );
  
  // Si c'est une route protégée et l'utilisateur n'est pas connecté
  if (isProtectedRoute && !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">NG</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Connexion requise</h1>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour accéder à cette page. 
              Créez un compte ou connectez-vous pour continuer.
            </p>
            <div className="space-y-3">
              <a 
                href="/auth" 
                className="block w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Se connecter
              </a>
              <a 
                href="/" 
                className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;