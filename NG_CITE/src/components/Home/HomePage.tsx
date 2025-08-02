import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar,
  Users,
  MapPin,
  Star,
  ArrowRight,
  TrendingUp,
  Clock,
  Eye
} from 'lucide-react';
import { mockEvents, mockAnnouncements, mockArtists, mockSpaces } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const upcomingEvents = mockEvents.filter(event => event.status === 'upcoming').slice(0, 3);
  const featuredArtists = mockArtists.slice(0, 3);
  const availableSpaces = mockSpaces.filter(space => space.availability).slice(0, 2);
  const recentAnnouncements = mockAnnouncements.slice(0, 2);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 animate-fade-in">
              Bienvenue à <span className="gradient-text">Niarry Gouye</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed animate-slide-up">
              Découvrez, participez et contribuez à la richesse culturelle de votre quartier. 
              Connectez-vous avec les artistes, événements et espaces culturels de Niarry Gouye.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link to="/events" className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                Découvrir les événements
              </Link>
              <Link to="/directory" className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-lg font-semibold transition-all duration-200">
                Explorer l'annuaire
              </Link>
            </div>
            <p className="text-white/80 text-sm mt-4">
              * Vous pouvez tout explorer, mais une connexion est requise pour participer
            </p>
          </div>
        </div>
      </section>

      {/* Welcome Message for Logged Users */}
      {user && (
        <section className="bg-white border-b">
          <div className="container py-8">
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold font-heading text-gray-900 mb-3">
                Bonjour {user.name} ! 👋
              </h2>
              <p className="text-gray-700 mb-4">
                Que souhaitez-vous faire aujourd'hui ?
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/events/create" className="btn-primary text-sm">
                  Créer un événement
                </Link>
                <Link to="/spaces/reserve" className="btn-secondary text-sm">
                  Réserver un espace
                </Link>
                <Link to="/directory" className="btn-outline text-sm">
                  Voir l'annuaire
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Statistics Section */}
      <section className="bg-white py-12 border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">156</div>
              <div className="text-gray-600 font-medium">Événements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">89</div>
              <div className="text-gray-600 font-medium">Artistes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">23</div>
              <div className="text-gray-600 font-medium">Espaces</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">1.2k</div>
              <div className="text-gray-600 font-medium">Membres</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-16 space-y-16">
        {/* Upcoming Events Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Événements à venir</h2>
            <Link 
              to="/events" 
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
            >
              <span>Voir tous les événements</span>
              <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="card p-0 overflow-hidden hover:shadow-lg transition-all duration-300">
                {event.image && (
                  <div className="aspect-video bg-gradient-to-r from-orange-400 to-blue-500 relative overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                    </div>
                    {event.price === 0 && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Gratuit
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <Calendar className="text-orange-500 mt-1 flex-shrink-0" size={18} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDate(event.date)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </p>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users size={16} />
                      <span>{event.currentParticipants} participants</span>
                    </div>
                    <Link 
                      to={`/events/${event.id}`}
                      className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center space-x-1"
                    >
                      <span>Voir plus</span>
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Artists Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Artistes en vedette</h2>
            <Link 
              to="/directory" 
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
            >
              <span>Voir l'annuaire complet</span>
              <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArtists.map((artist) => (
              <div key={artist.id} className="card p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-r from-orange-400 to-blue-500 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {artist.avatar ? (
                      <img 
                        src={artist.avatar} 
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xl font-bold">
                          {artist.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-2">{artist.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{artist.bio}</p>
                
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {artist.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-center space-x-1 mb-4">
                  <Star className="text-yellow-400 fill-current" size={16} />
                  <span className="font-medium">{artist.rating}</span>
                  <span className="text-gray-500 text-sm">({artist.reviewsCount})</span>
                </div>
                
                <Link 
                  to={`/directory/${artist.id}`}
                  className="btn-primary w-full"
                >
                  Voir le profil
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Available Spaces Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Espaces disponibles</h2>
            <Link 
              to="/spaces" 
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
            >
              <span>Voir tous les espaces</span>
              <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {availableSpaces.map((space) => (
              <div key={space.id} className="card p-0 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 relative overflow-hidden">
                  {space.images[0] && (
                    <img 
                      src={space.images[0]} 
                      alt={space.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {space.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{space.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{space.description}</p>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{space.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">Capacité : {space.capacity} personnes</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="font-medium">{space.rating}</span>
                      <span className="text-gray-500 text-sm">({space.reviewsCount})</span>
                    </div>
                    {space.hourlyRate && (
                      <div className="text-right">
                        <span className="font-bold text-lg text-gray-900">
                          {space.hourlyRate.toLocaleString()} FCFA
                        </span>
                        <span className="text-gray-500 text-sm">/heure</span>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    to={`/spaces/${space.id}`}
                    className="btn-primary w-full mt-4"
                  >
                    Réserver cet espace
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Announcements Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Annonces importantes</h2>
            <Link 
              to="/announcements" 
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
            >
              <span>Voir toutes les annonces</span>
              <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="card p-6">
                <div className="flex items-start space-x-3 mb-3">
                  <TrendingUp className={`mt-1 flex-shrink-0 ${
                    announcement.priority === 'high' ? 'text-red-500' : 
                    announcement.priority === 'medium' ? 'text-orange-500' : 'text-blue-500'
                  }`} size={20} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{announcement.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        announcement.priority === 'high' ? 'bg-red-100 text-red-700' : 
                        announcement.priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {announcement.priority === 'high' ? 'Important' : 
                         announcement.priority === 'medium' ? 'Moyen' : 'Info'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{announcement.content}</p>
                    <div className="flex items-center space-x-1 mt-3 text-xs text-gray-500">
                      <Clock size={14} />
                      <span>
                        {announcement.createdAt.toLocaleDateString('fr-FR')} par {announcement.author.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-orange-500 to-blue-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
            Rejoignez la communauté Niarry Gouye
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Que vous soyez artiste, organisateur d'événements, ou simplement passionné de culture, 
            votre participation enrichit notre communauté.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <Link to="/auth" className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold transition-colors duration-200">
                Créer mon compte
              </Link>
            ) : (
              <Link to="/events/create" className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold transition-colors duration-200">
                Organiser un événement
              </Link>
            )}
            <Link to="/directory" className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-lg font-semibold transition-all duration-200">
              Explorer la communauté
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;