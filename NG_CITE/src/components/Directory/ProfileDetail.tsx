import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  Award,
  MessageCircle,
  Share2,
  Heart,
  Eye,
  CheckCircle
} from 'lucide-react';
import { mockUsers, mockArtists, mockEvents } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfileDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('about');
  const [isFavorite, setIsFavorite] = useState(false);

  // Find user in both arrays
  const allUsers = [...mockUsers, ...mockArtists];
  const profile = allUsers.find(u => u.id === id);

  if (!profile) {
    return <Navigate to="/directory" replace />;
  }

  const isArtist = 'specialties' in profile;
  const userEvents = mockEvents.filter(event => event.organizer.id === profile.id);

  const handleFavorite = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter aux favoris');
      return;
    }
    
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris !');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Profil de ${profile.name}`,
        text: profile.bio || `Découvrez le profil de ${profile.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers !');
    }
  };

  const handleContact = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour contacter ce membre');
      return;
    }
    
    // Simulate opening message composer
    toast.success('Ouverture de la messagerie...');
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

  const tabs = [
    { id: 'about', label: 'À propos', icon: Users },
    { id: 'events', label: 'Événements', icon: Calendar },
    ...(isArtist ? [{ id: 'portfolio', label: 'Portfolio', icon: Award }] : []),
  ];

  return (
    <div className="page-container">
      <div className="container py-8">
        {/* Back Button */}
        <Link 
          to="/directory" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>Retour à l'annuaire</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="card p-6">
              <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-32 h-32 mx-auto md:mx-0 rounded-full overflow-hidden bg-gradient-to-r from-orange-400 to-blue-500 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {profile.avatar ? (
                      <img 
                        src={profile.avatar} 
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-4xl font-bold">
                          {profile.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 font-heading mb-2">
                        {profile.name}
                      </h1>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(profile.role)}`}>
                        {getRoleLabel(profile.role)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                      <button
                        onClick={handleFavorite}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          isFavorite 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                      >
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Rating for Artists */}
                  {isArtist && 'rating' in profile && (
                    <div className="flex items-center justify-center md:justify-start space-x-1 mb-3">
                      <Star className="text-yellow-400 fill-current" size={20} />
                      <span className="font-semibold text-lg">{profile.rating}</span>
                      <span className="text-gray-500">
                        ({profile.reviewsCount} avis)
                      </span>
                    </div>
                  )}
                  
                  {/* Availability for Artists */}
                  {isArtist && 'availability' in profile && (
                    <div className="mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        profile.availability 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <CheckCircle size={16} className="mr-1" />
                        {profile.availability ? 'Disponible' : 'Non disponible'}
                      </span>
                    </div>
                  )}
                  
                  {profile.bio && (
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {profile.bio}
                    </p>
                  )}
                  
                  {/* Specialties for Artists */}
                  {isArtist && 'specialties' in profile && profile.specialties && (
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      {profile.specialties.map((specialty, index) => (
                        <span 
                          key={index}
                          className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <button
                    onClick={handleContact}
                    className="btn-primary flex items-center space-x-2 mx-auto md:mx-0"
                  >
                    <MessageCircle size={18} />
                    <span>Contacter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card p-0 overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                          activeTab === tab.id
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              <div className="p-6">
                {/* About Tab */}
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations personnelles</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="text-gray-400" size={18} />
                          <span className="text-gray-600">{profile.email}</span>
                        </div>
                        {profile.phone && (
                          <div className="flex items-center space-x-3">
                            <Phone className="text-gray-400" size={18} />
                            <span className="text-gray-600">{profile.phone}</span>
                          </div>
                        )}
                        {profile.location && (
                          <div className="flex items-center space-x-3">
                            <MapPin className="text-gray-400" size={18} />
                            <span className="text-gray-600">{profile.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-3">
                          <Calendar className="text-gray-400" size={18} />
                          <span className="text-gray-600">
                            Membre depuis {profile.createdAt.toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {isArtist && 'experience' in profile && profile.experience && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Expérience</h3>
                        <p className="text-gray-600 leading-relaxed">{profile.experience}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Events Tab */}
                {activeTab === 'events' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Événements organisés ({userEvents.length})
                    </h3>
                    {userEvents.length > 0 ? (
                      <div className="space-y-4">
                        {userEvents.map((event) => (
                          <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
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
                              <Link 
                                to={`/events/${event.id}`}
                                className="ml-4 btn-outline text-sm flex items-center space-x-1"
                              >
                                <Eye size={16} />
                                <span>Voir</span>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
                        <p className="text-gray-600">Aucun événement organisé pour le moment</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Portfolio Tab (Artists only) */}
                {activeTab === 'portfolio' && isArtist && 'portfolio' in profile && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h3>
                    {profile.portfolio && profile.portfolio.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profile.portfolio.map((image, index) => (
                          <div key={index} className="aspect-video rounded-lg overflow-hidden">
                            <img 
                              src={image} 
                              alt={`Portfolio ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award className="mx-auto text-gray-400 mb-3" size={48} />
                        <p className="text-gray-600">Aucune œuvre dans le portfolio</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Événements organisés</span>
                  <span className="font-semibold">{userEvents.length}</span>
                </div>
                {isArtist && 'reviewsCount' in profile && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avis reçus</span>
                    <span className="font-semibold">{profile.reviewsCount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Membre depuis</span>
                  <span className="font-semibold">
                    {new Date().getFullYear() - profile.createdAt.getFullYear()} an{new Date().getFullYear() - profile.createdAt.getFullYear() > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="text-gray-400" size={18} />
                  <span className="text-gray-600 text-sm">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="text-gray-400" size={18} />
                    <span className="text-gray-600 text-sm">{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-gray-400" size={18} />
                    <span className="text-gray-600 text-sm">{profile.location}</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleContact}
                className="w-full btn-primary mt-4 flex items-center justify-center space-x-2"
              >
                <MessageCircle size={18} />
                <span>Envoyer un message</span>
              </button>
            </div>

            {/* Similar Profiles */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profils similaires</h3>
              <div className="space-y-3">
                {allUsers
                  .filter(u => u.id !== profile.id && u.role === profile.role)
                  .slice(0, 3)
                  .map((similarProfile) => (
                    <Link 
                      key={similarProfile.id}
                      to={`/directory/${similarProfile.id}`}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-orange-400 to-blue-500 p-0.5">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          {similarProfile.avatar ? (
                            <img 
                              src={similarProfile.avatar} 
                              alt={similarProfile.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm font-bold">
                                {similarProfile.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{similarProfile.name}</h4>
                        <p className="text-xs text-gray-600 capitalize">{similarProfile.role}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;