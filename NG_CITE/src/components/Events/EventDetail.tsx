import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star, 
  Share2, 
  Heart,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Tag,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { mockEvents } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isParticipating, setIsParticipating] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const event = mockEvents.find(e => e.id === id);

  if (!event) {
    return <Navigate to="/events" replace />;
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleParticipate = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour participer');
      return;
    }
    
    setIsParticipating(!isParticipating);
    toast.success(isParticipating ? 'Participation annulée' : 'Participation confirmée !');
  };

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
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers !');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'ongoing': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="page-container">
      <div className="container py-8">
        {/* Back Button */}
        <Link 
          to="/events" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>Retour aux événements</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Header */}
            <div className="card p-0 overflow-hidden">
              {event.image && (
                <div className="aspect-video relative">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                      {event.price === 0 && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Gratuit
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-white font-heading mb-2">
                      {event.title}
                    </h1>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                {!event.image && (
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                      </span>
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                      {event.price === 0 && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Gratuit
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 font-heading">
                      {event.title}
                    </h1>
                  </div>
                )}

                {/* Event Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-orange-500" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                      <p className="text-sm text-gray-600">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-orange-500" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">{event.location}</p>
                      <p className="text-sm text-gray-600">Niarry Gouye</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Users className="text-orange-500" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {event.currentParticipants} participants
                      </p>
                      {event.maxParticipants && (
                        <p className="text-sm text-gray-600">
                          Limite : {event.maxParticipants} personnes
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {event.price && event.price > 0 && (
                    <div className="flex items-center space-x-3">
                      <Tag className="text-orange-500" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {event.price.toLocaleString()} FCFA
                        </p>
                        <p className="text-sm text-gray-600">Prix d'entrée</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{event.description}</p>
                </div>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Mots-clés</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleParticipate}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      isParticipating 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'btn-primary'
                    }`}
                  >
                    {isParticipating ? <CheckCircle size={20} /> : <Users size={20} />}
                    <span>{isParticipating ? 'Participation confirmée' : 'Participer'}</span>
                  </button>
                  
                  <button
                    onClick={handleFavorite}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      isFavorite 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'btn-outline'
                    }`}
                  >
                    <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                    <span>{isFavorite ? 'Favoris' : 'Ajouter aux favoris'}</span>
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <Share2 size={20} />
                    <span>Partager</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer Card */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organisateur</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-orange-400 to-blue-500 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {event.organizer.avatar ? (
                      <img 
                        src={event.organizer.avatar} 
                        alt={event.organizer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xl font-bold">
                          {event.organizer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{event.organizer.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{event.organizer.role}</p>
                </div>
              </div>
              
              {event.organizer.bio && (
                <p className="text-gray-600 text-sm mb-4">{event.organizer.bio}</p>
              )}
              
              <div className="space-y-2">
                {event.organizer.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone size={16} />
                    <span className="text-sm">{event.organizer.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail size={16} />
                  <span className="text-sm">{event.organizer.email}</span>
                </div>
              </div>
              
              <Link 
                to={`/directory/${event.organizer.id}`}
                className="btn-outline w-full mt-4 flex items-center justify-center space-x-2"
              >
                <User size={18} />
                <span>Voir le profil</span>
              </Link>
            </div>

            {/* Event Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-semibold">{event.currentParticipants}</span>
                </div>
                {event.maxParticipants && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Places restantes</span>
                    <span className="font-semibold text-green-600">
                      {event.maxParticipants - event.currentParticipants}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Créé le</span>
                  <span className="font-semibold">
                    {event.createdAt.toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Similar Events */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Événements similaires</h3>
              <div className="space-y-3">
                {mockEvents
                  .filter(e => e.id !== event.id && e.category === event.category)
                  .slice(0, 3)
                  .map((similarEvent) => (
                    <Link 
                      key={similarEvent.id}
                      to={`/events/${similarEvent.id}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                        {similarEvent.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {similarEvent.date.toLocaleDateString('fr-FR')}
                      </p>
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

export default EventDetail;