import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users,
  Search,
  Filter,
  MapPin,
  Star,
  Phone,
  Mail,
  Eye,
  UserPlus
} from 'lucide-react';
import { mockArtists, mockUsers } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const DirectoryPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Combine all users and artists
  const allUsers = [...mockUsers, ...mockArtists];
  
  // Get all specialties for filter
  const allSpecialties = [...new Set(
    mockArtists.flatMap(artist => artist.specialties || [])
  )];

  const roles = [
    { value: 'artiste', label: 'Artistes' },
    { value: 'gestionnaire', label: 'Gestionnaires' },
    { value: 'habitant', label: 'Habitants' }
  ];

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = allUsers.filter(person => {
      const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (person.bio && person.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           person.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = !selectedRole || person.role === selectedRole;
      
      const matchesSpecialty = !selectedSpecialty || 
                              ('specialties' in person && person.specialties?.includes(selectedSpecialty));

      return matchesSearch && matchesRole && matchesSpecialty;
    });

    // Sort users
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          const aRating = 'rating' in a ? a.rating || 0 : 0;
          const bRating = 'rating' in b ? b.rating || 0 : 0;
          return bRating - aRating;
        case 'recent':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [allUsers, searchTerm, selectedRole, selectedSpecialty, sortBy]);

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

  return (
    <div className="page-container">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="section-title">Annuaire Culturel</h1>
            <p className="text-gray-600 text-lg">
              Découvrez les acteurs culturels du quartier Niarry Gouye
            </p>
          </div>

          {user && (
            <Link
              to="/directory/join"
              className="btn-primary flex items-center space-x-2 self-start"
            >
              <UserPlus size={20} />
              <span>Rejoindre l'annuaire</span>
            </Link>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {allUsers.filter(u => u.role === 'artiste').length}
            </div>
            <div className="text-gray-600 text-sm font-medium">Artistes</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {allUsers.filter(u => u.role === 'gestionnaire').length}
            </div>
            <div className="text-gray-600 text-sm font-medium">Gestionnaires</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {allUsers.filter(u => u.role === 'habitant').length}
            </div>
            <div className="text-gray-600 text-sm font-medium">Habitants</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {allSpecialties.length}
            </div>
            <div className="text-gray-600 text-sm font-medium">Spécialités</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher une personne..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="input-field"
              >
                <option value="">Tous les rôles</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialty Filter */}
            <div>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="input-field"
                disabled={selectedRole !== 'artiste'}
              >
                <option value="">Toutes les spécialités</option>
                {allSpecialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
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
                <option value="name">Trier par nom</option>
                <option value="rating">Trier par note</option>
                <option value="recent">Plus récents</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredAndSortedUsers.length} personne{filteredAndSortedUsers.length !== 1 ? 's' : ''} trouvée{filteredAndSortedUsers.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Filter size={16} />
            <span>Filtres actifs</span>
          </div>
        </div>

        {/* Users Grid */}
        {filteredAndSortedUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedUsers.map((person) => (
              <div key={person.id} className="card p-6 hover:shadow-lg transition-all duration-300">
                {/* Profile Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-orange-400 to-blue-500 p-0.5">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      {person.avatar ? (
                        <img 
                          src={person.avatar} 
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xl font-bold">
                            {person.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{person.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(person.role)}`}>
                      {getRoleLabel(person.role)}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                {person.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {person.bio}
                  </p>
                )}

                {/* Specialties for Artists */}
                {'specialties' in person && person.specialties && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {person.specialties.map((specialty, index) => (
                      <span 
                        key={index}
                        className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                )}

                {/* Rating for Artists */}
                {'rating' in person && person.rating && (
                  <div className="flex items-center space-x-1 mb-4">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="font-medium">{person.rating}</span>
                    <span className="text-gray-500 text-sm">
                      ({('reviewsCount' in person) ? person.reviewsCount : 0} avis)
                    </span>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  {person.location && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin size={14} />
                      <span className="text-sm">{person.location}</span>
                    </div>
                  )}
                  {person.phone && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone size={14} />
                      <span className="text-sm">{person.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail size={14} />
                    <span className="text-sm">{person.email}</span>
                  </div>
                </div>

                {/* Availability for Artists */}
                {'availability' in person && (
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      person.availability 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {person.availability ? 'Disponible' : 'Non disponible'}
                    </span>
                  </div>
                )}

                {/* Action Button */}
                <Link 
                  to={`/directory/${person.id}`}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Eye size={18} />
                  <span>Voir le profil</span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune personne trouvée</h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche.
            </p>
            {user && (
              <Link to="/directory/join" className="btn-primary">
                Rejoindre l'annuaire
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryPage;