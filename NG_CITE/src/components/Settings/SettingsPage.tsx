import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Eye, 
  Globe, 
  Smartphone,
  Mail,
  Lock,
  Trash2,
  Download,
  Upload,
  Save,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      events: true,
      messages: true,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
      allowMessages: true
    },
    preferences: {
      language: 'fr',
      theme: 'light',
      timezone: 'Africa/Dakar'
    }
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    // Simulate API call
    toast.success('Paramètres sauvegardés avec succès !');
  };

  const handleExportData = () => {
    // Simulate data export
    toast.success('Export des données en cours...');
  };

  const handleDeleteAccount = () => {
    // Simulate account deletion
    toast.success('Demande de suppression envoyée');
    setShowDeleteConfirm(false);
    logout();
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
    { id: 'preferences', label: 'Préférences', icon: Settings },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'data', label: 'Données', icon: Download }
  ];

  if (!user) {
    return (
      <div className="page-container">
        <div className="container py-16 text-center">
          <Settings className="mx-auto text-gray-400 mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès restreint</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder aux paramètres.</p>
          <a href="/auth" className="btn-primary">Se connecter</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="section-title">Paramètres</h1>
            <p className="text-gray-600">Gérez vos préférences et paramètres de compte</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-0 overflow-hidden">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200 ${
                          activeTab === tab.id
                            ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="card p-6">
                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Méthodes de notification</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Mail className="text-gray-400" size={20} />
                              <div>
                                <p className="font-medium text-gray-900">Notifications par email</p>
                                <p className="text-sm text-gray-600">Recevez les notifications par email</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications.email}
                                onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Smartphone className="text-gray-400" size={20} />
                              <div>
                                <p className="font-medium text-gray-900">Notifications push</p>
                                <p className="text-sm text-gray-600">Recevez les notifications sur votre appareil</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications.push}
                                onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Types de notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Nouveaux événements</p>
                              <p className="text-sm text-gray-600">Notifications pour les nouveaux événements</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications.events}
                                onChange={(e) => handleSettingChange('notifications', 'events', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Messages</p>
                              <p className="text-sm text-gray-600">Notifications pour les nouveaux messages</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications.messages}
                                onChange={(e) => handleSettingChange('notifications', 'messages', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Marketing</p>
                              <p className="text-sm text-gray-600">Newsletters et promotions</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.notifications.marketing}
                                onChange={(e) => handleSettingChange('notifications', 'marketing', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Confidentialité</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Visibilité du profil</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Profil public</p>
                              <p className="text-sm text-gray-600">Votre profil est visible dans l'annuaire</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.privacy.profileVisible}
                                onChange={(e) => handleSettingChange('privacy', 'profileVisible', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Afficher l'email</p>
                              <p className="text-sm text-gray-600">Votre email est visible sur votre profil</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.privacy.showEmail}
                                onChange={(e) => handleSettingChange('privacy', 'showEmail', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Afficher le téléphone</p>
                              <p className="text-sm text-gray-600">Votre numéro est visible sur votre profil</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.privacy.showPhone}
                                onChange={(e) => handleSettingChange('privacy', 'showPhone', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Autoriser les messages</p>
                              <p className="text-sm text-gray-600">Les autres membres peuvent vous envoyer des messages</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.privacy.allowMessages}
                                onChange={(e) => handleSettingChange('privacy', 'allowMessages', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Préférences</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                          Langue
                        </label>
                        <select
                          id="language"
                          value={settings.preferences.language}
                          onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                          className="input-field max-w-xs"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="wo">Wolof</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                          Thème
                        </label>
                        <select
                          id="theme"
                          value={settings.preferences.theme}
                          onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                          className="input-field max-w-xs"
                        >
                          <option value="light">Clair</option>
                          <option value="dark">Sombre</option>
                          <option value="auto">Automatique</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                          Fuseau horaire
                        </label>
                        <select
                          id="timezone"
                          value={settings.preferences.timezone}
                          onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                          className="input-field max-w-xs"
                        >
                          <option value="Africa/Dakar">Dakar (GMT+0)</option>
                          <option value="Europe/Paris">Paris (GMT+1)</option>
                          <option value="America/New_York">New York (GMT-5)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Sécurité</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Mot de passe</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Dernière modification : il y a 3 mois
                        </p>
                        <button className="btn-outline">
                          Changer le mot de passe
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Authentification à deux facteurs</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Ajoutez une couche de sécurité supplémentaire à votre compte
                        </p>
                        <button className="btn-outline">
                          Activer 2FA
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Sessions actives</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Gérez les appareils connectés à votre compte
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium text-sm">Navigateur actuel</p>
                              <p className="text-xs text-gray-600">Chrome sur Windows • Maintenant</p>
                            </div>
                            <span className="text-green-600 text-sm">Actuel</span>
                          </div>
                        </div>
                        <button className="btn-outline text-red-600 border-red-300 hover:bg-red-50">
                          Déconnecter tous les appareils
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Tab */}
                {activeTab === 'data' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Gestion des données</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Exporter mes données</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Téléchargez une copie de toutes vos données
                        </p>
                        <button 
                          onClick={handleExportData}
                          className="btn-outline flex items-center space-x-2"
                        >
                          <Download size={18} />
                          <span>Exporter les données</span>
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Importer des données</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Importez vos données depuis un autre service
                        </p>
                        <button className="btn-outline flex items-center space-x-2">
                          <Upload size={18} />
                          <span>Importer des données</span>
                        </button>
                      </div>

                      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <h3 className="text-lg font-medium text-red-900 mb-2 flex items-center space-x-2">
                          <AlertTriangle size={20} />
                          <span>Zone de danger</span>
                        </h3>
                        <p className="text-red-700 text-sm mb-4">
                          Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                        </p>
                        <button 
                          onClick={() => setShowDeleteConfirm(true)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                        >
                          <Trash2 size={18} />
                          <span>Supprimer mon compte</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save size={18} />
                    <span>Sauvegarder les modifications</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="text-red-500" size={24} />
                <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues.
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 btn-outline"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;