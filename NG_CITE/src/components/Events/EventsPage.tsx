import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  Plus,
  Clock,
  Star,
  Eye
} from 'lucide-react';
import { mockEvents } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('upcoming');
  const [sortBy, setSortBy] = useState('date');

  const categories = [...new Set(mockEvents.map(event => event.category))];
  const statuses = [
    { value: 'upcoming', label: 'À venir' },
    { value: 'ongoing', label: 'En cours' },
    { value: 'completed', label: 'Terminés' },
    { value: 'all', label: 'Tous' }
  ];

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = mockEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || event.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return a.date.getTime() - b.date.getTime();
        case 'popularity':
          return b.currentParticipants - a.currentParticipants;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [mockEvents, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="page-container">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="section-title">Événements Culturels</h1>
            <p className="text-gray-600 text-lg">
              Découvrez les événements culturels du quartier Niarry Gouye
            </p>
          </div>

          {user && (
            <Link
              to="/events/create"
              className="btn-primary flex items-center space-x-2 self-start"
            >
              <Plus size={20} />
              <span>Créer un événement</span>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="date">Trier par date</option>
                <option value="popularity">Trier par popularité</option>
                <option value="alphabetical">Trier par nom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredAndSortedEvents.length} événement{filteredAndSortedEvents.length !== 1 ? 's' : ''} trouvé{filteredAndSortedEvents.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Filter size={16} />
            <span>Filtres actifs</span>
          </div>
        </div>

        {/* Events Grid */}
        {filteredAndSortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedEvents.map((event) => (
              <div key={event.id} className="card p-0 overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Event Image */}
                <div className="aspect-video bg-gradient-to-r from-orange-400 to-blue-500 relative overflow-hidden">
                  {event.image ? (
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-orange-400 to-blue-500 flex items-center justify-center">
                      <Calendar className="text-white opacity-50" size={48} />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.status === 'upcoming' ? 'bg-green-500 text-white' :
                      event.status === 'ongoing' ? 'bg-yellow-500 text-white' :
                      event.status === 'completed' ? 'bg-gray-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {event.status === 'upcoming' ? 'À venir' :
                       event.status === 'ongoing' ? 'En cours' :
                       event.status === 'completed' ? 'Terminé' :
                       'Annulé'}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                      {event.category}
                    </span>
                  </div>

                  {/* Price Badge */}
                  {event.price === 0 && (
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Gratuit
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Event Content */}
                <div className="p-6">
                  {/* Date and Time */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex items-center space-x-2 text-orange-600">
                      <Calendar size={18} />
                      <span className="font-medium">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock size={16} />
                      <span className="text-sm">{event.startTime}</span>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  {/* Location */}
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{event.location}</span>
                  </div>
                  
                  {/* Organizer */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-blue-500 flex items-center justify-center">
                      {event.organizer.avatar ? (
                        <img 
                          src={event.organizer.avatar} 
                          alt={event.organizer.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-medium">
                          {event.organizer.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.organizer.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{event.organizer.role}</p>
                    </div>
                  </div>
                  
                  {/* Participants and Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Users size={16} />
                      <span>{event.currentParticipants}</span>
                      {event.maxParticipants && (
                        <span>/{event.maxParticipants}</span>
                      )}
                      <span>participants</span>
                    </div>
                    {event.price && event.price > 0 && (
                      <div className="text-right">
                        <span className="font-bold text-lg text-gray-900">
                          {event.price.toLocaleString()} FCFA
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <Link 
                    to={`/events/${event.id}`}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <Eye size={18} />
                    <span>Voir les détails</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou créez un nouvel événement.
            </p>
            {user && (
              <Link to="/events/create" className="btn-primary">
                Créer un événement
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;