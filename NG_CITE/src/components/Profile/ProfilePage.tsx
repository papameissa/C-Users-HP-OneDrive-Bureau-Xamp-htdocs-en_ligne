import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Camera,
  Star,
  Award,
  Users,
  Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockEvents } from '../../data/mockData';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });

  const userEvents = mockEvents.filter(event => event.organizer.id === user?.id);
  const isArtist = user?.role === 'artiste';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Simulate API call
    toast.success('Profil mis à jour avec succès !');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'artiste': return 'Artiste';
      case 'gestionnaire': return 'Gestionnaire';
      case 'habitant': return 'Habitant';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'artiste': return 'bg-purple-100 text-purple-700';
      case 'gestionnaire': return 'bg-blue-100 text-blue-700';
      case 'habitant': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="container py-16 text-center">
          <User className="mx-auto text-gray-400 mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès restreint</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à votre profil.</p>
          <a href="/auth" className="btn-primary">Se connecter</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="section-title">Mon Profil</h1>
              <p className="text-gray-600">Gérez vos informations personnelles</p>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Edit3 size={18} />
                <span>Modifier</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCancel}
                  className="btn-outline flex items-center space-x-2"
                >
                  <X size={18} />
                  <span>Annuler</span>
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save size={18} />
                  <span>Enregistrer</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations personnelles</h2>
                
                <div className="flex items-start space-x-6 mb-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-orange-400 to-blue-500 p-1">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        {formData.avatar ? (
                          <img 
                            src={formData.avatar} 
                            alt={formData.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-2xl font-bold">
                              {formData.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 p-1 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-200">
                        <Camera size={16} />
                      </button>
                    )}
                  </div>
                  
                  {/* Role Badge */}
                  <div className="flex-1">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                    <p className="text-gray-600 text-sm mt-2">
                      Membre depuis {user.createdAt.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="+221 77 123 45 67"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user.phone || 'Non renseigné'}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Localisation
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Niarry Gouye, Dakar"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{user.location || 'Non renseigné'}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Présentation
                  </label>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="input-field resize-none"
                      placeholder="Parlez-nous un peu de vous..."
                    />
                  ) : (
                    <p className="text-gray-900 py-2 leading-relaxed">
                      {user.bio || 'Aucune présentation ajoutée'}
                    </p>
                  )}
                </div>
              </div>

              {/* Artist Specific Info */}
              {isArtist && 'specialties' in user && (
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations artistiques</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Spécialités
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {user.specialties?.map((specialty, index) => (
                          <span 
                            key={index}
                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {user.experience && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expérience
                        </label>
                        <p className="text-gray-900 leading-relaxed">{user.experience}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Note moyenne
                        </label>
                        <div className="flex items-center space-x-1">
                          <Star className="text-yellow-400 fill-current" size={20} />
                          <span className="font-semibold">{user.rating}</span>
                          <span className="text-gray-500">({user.reviewsCount} avis)</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Disponibilité
                        </label>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.availability 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {user.availability ? 'Disponible' : 'Non disponible'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* My Events */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Mes événements ({userEvents.length})
                </h2>
                
                {userEvents.length > 0 ? (
                  <div className="space-y-4">
                    {userEvents.map((event) => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{event.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar size={14} />
                                <span>{event.date.toLocaleDateString('fr-FR')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin size={14} />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users size={14} />
                                <span>{event.currentParticipants} participants</span>
                              </div>
                            </div>
                          </div>
                          <a 
                            href={`/events/${event.id}`}
                            className="ml-4 btn-outline text-sm flex items-center space-x-1"
                          >
                            <Eye size={16} />
                            <span>Voir</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600">Vous n'avez organisé aucun événement pour le moment</p>
                    <a href="/events/create" className="btn-primary mt-4">
                      Créer un événement
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="text-orange-500" size={18} />
                      <span className="text-gray-600">Événements créés</span>
                    </div>
                    <span className="font-semibold text-gray-900">{userEvents.length}</span>
                  </div>
                  
                  {isArtist && 'reviewsCount' in user && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="text-yellow-500" size={18} />
                        <span className="text-gray-600">Avis reçus</span>
                      </div>
                      <span className="font-semibold text-gray-900">{user.reviewsCount}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="text-blue-500" size={18} />
                      <span className="text-gray-600">Membre depuis</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {new Date().getFullYear() - user.createdAt.getFullYear()} an{new Date().getFullYear() - user.createdAt.getFullYear() > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
                <div className="space-y-3">
                  <a href="/events/create" className="w-full btn-primary text-center">
                    Créer un événement
                  </a>
                  <a href="/messages" className="w-full btn-outline text-center">
                    Mes messages
                  </a>
                  <a href="/settings" className="w-full btn-outline text-center">
                    Paramètres
                  </a>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="card p-6 bg-blue-50 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Complétez votre profil</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center justify-between">
                    <span>Photo de profil</span>
                    <span className={user.avatar ? 'text-green-600' : 'text-orange-600'}>
                      {user.avatar ? '✓' : '○'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Téléphone</span>
                    <span className={user.phone ? 'text-green-600' : 'text-orange-600'}>
                      {user.phone ? '✓' : '○'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Présentation</span>
                    <span className={user.bio ? 'text-green-600' : 'text-orange-600'}>
                      {user.bio ? '✓' : '○'}
                    </span>
                  </div>
                </div>
                <div className="mt-3 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${[user.avatar, user.phone, user.bio].filter(Boolean).length * 33.33}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;