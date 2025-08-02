import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin,
  Users,
  Search,
  Filter,
  Plus,
  Star,
  Eye,
  Wifi,
  Car,
  Volume2,
  Lightbulb
} from 'lucide-react';
import { mockSpaces } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

const SpacesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [availableOnly, setAvailableOnly] = useState(true);

  const categories = [
    { value: 'salle', label: 'Salles' },
    { value: 'terrain', label: 'Terrains' },
    { value: 'studio', label: 'Studios' },
    { value: 'scene', label: 'Scènes' },
    { value: 'autre', label: 'Autres' }
  ];

  const capacityRanges = [
    { value: '1-20', label: '1-20 personnes' },
    { value: '21-50', label: '21-50 personnes' },
    { value: '51-100', label: '51-100 personnes' },
    { value: '100+', label: '100+ personnes' }
  ];

  const filteredAndSortedSpaces = useMemo(() => {
    let filtered = mockSpaces.filter(space => {
      const matchesSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           space.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           space.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || space.category === selectedCategory;
      const matchesAvailability = !availableOnly || space.availability;
      
      let matchesCapacity = true;
      if (selectedCapacity) {
        const [min, max] = selectedCapacity.split('-').map(n => n === '+' ? Infinity : parseInt(n));
        matchesCapacity = space.capacity >= min && (max ? space.capacity <= max : true);
      }

      return matchesSearch && matchesCategory && matchesAvailability && matchesCapacity;
    });

    // Sort spaces
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'capacity':
          return b.capacity - a.capacity;
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          const aPrice = a.hourlyRate || 0;
          const bPrice = b.hourlyRate || 0;
          return aPrice - bPrice;
        default:
          return 0;
      }
    });

    return filtered;
  }, [mockSpaces, searchTerm, selectedCategory, selectedCapacity, sortBy, availableOnly]);

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi') || lower.includes('internet')) return <Wifi size={16} />;
    if (lower.includes('parking') || lower.includes('stationnement')) return <Car size={16} />;
    if (lower.includes('son') || lower.includes('audio') || lower.includes('micro')) return <Volume2 size={16} />;
    if (lower.includes('éclairage') || lower.includes('lumière')) return <Lightbulb size={16} />;
    return <span className="w-2 h-2 bg-green-500 rounded-full"></span>;
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'salle': return 'Salle';
      case 'terrain': return 'Terrain';
      case 'studio': return 'Studio';
      case 'scene': return 'Scène';
      case 'autre': return 'Autre';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'salle': return 'bg-blue-100 text-blue-700';
      case 'terrain': return 'bg-green-100 text-green-700';
      case 'studio': return 'bg-purple-100 text-purple-700';
      case 'scene': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="page-container">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="section-title">Espaces Culturels</h1>
            <p className="text-gray-600 text-lg">
              Trouvez et réservez des espaces pour vos événements culturels
            </p>
          </div>

          {user && user.role === 'gestionnaire' && (
            <Link
              to="/spaces/add"
              className="btn-primary flex items-center space-x-2 self-start"
            >
              <Plus size={20} />
              <span>Ajouter un espace</span>
            </Link>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {mockSpaces.filter(s => s.category === 'salle').length}
            </div>
            <div className="text-gray-600 text-sm font-medium">Salles</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {mockSpaces.filter(s => s.category === 'terrain').length}
            </div>
            <div className="text-gray-600 text-sm font-medium">Terrains</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {mockSpaces.filter(s => s.category === 'studio').length}
            </div>
            <div className="text-gray-600 text-sm font-medium">Studios</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {mockSpaces.filter(s => s.availability).length}
            </div>
            <div className="text-gray-600 text-sm font-medium">Disponibles</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un espace..."
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
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacity Filter */}
            <div>
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="input-field"
              >
                <option value="">Toutes les capacités</option>
                {capacityRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
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
                <option value="capacity">Trier par capacité</option>
                <option value="rating">Trier par note</option>
                <option value="price">Trier par prix</option>
              </select>
            </div>

            {/* Available Only Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="availableOnly"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="availableOnly" className="text-sm text-gray-700">
                Disponibles seulement
              </label>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredAndSortedSpaces.length} espace{filteredAndSortedSpaces.length !== 1 ? 's' : ''} trouvé{filteredAndSortedSpaces.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Filter size={16} />
            <span>Filtres actifs</span>
          </div>
        </div>

        {/* Spaces Grid */}
        {filteredAndSortedSpaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedSpaces.map((space) => (
              <div key={space.id} className="card p-0 overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Space Image */}
                <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 relative overflow-hidden">
                  {space.images[0] ? (
                    <img 
                      src={space.images[0]} 
                      alt={space.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <MapPin className="text-white opacity-50" size={48} />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(space.category)}`}>
                      {getCategoryLabel(space.category)}
                    </span>
                  </div>

                  {/* Availability Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      space.availability ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {space.availability ? 'Disponible' : 'Occupé'}
                    </span>
                  </div>
                </div>
                
                {/* Space Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{space.name}</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {space.description}
                  </p>
                  
                  {/* Location */}
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{space.location}</span>
                  </div>
                  
                  {/* Capacity */}
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">Capacité : {space.capacity} personnes</span>
                  </div>
                  
                  {/* Amenities */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Équipements :</p>
                    <div className="flex flex-wrap gap-2">
                      {space.amenities.slice(0, 4).map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                      {space.amenities.length > 4 && (
                        <span className="text-xs text-gray-500">
                          +{space.amenities.length - 4} autres
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Owner */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-blue-500 flex items-center justify-center">
                      {space.owner.avatar ? (
                        <img 
                          src={space.owner.avatar} 
                          alt={space.owner.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-medium">
                          {space.owner.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{space.owner.name}</p>
                      <p className="text-xs text-gray-500">Propriétaire</p>
                    </div>
                  </div>
                  
                  {/* Rating and Price */}
                  <div className="flex items-center justify-between mb-4">
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
                        <div className="text-gray-500 text-sm">/heure</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link 
                      to={`/spaces/${space.id}`}
                      className="flex-1 btn-outline flex items-center justify-center space-x-1 text-sm"
                    >
                      <Eye size={16} />
                      <span>Voir</span>
                    </Link>
                    <Link 
                      to={`/spaces/${space.id}/reserve`}
                      className="flex-1 btn-primary flex items-center justify-center space-x-1 text-sm"
                      onClick={(e) => {
                        if (!space.availability) {
                          e.preventDefault();
                          alert('Cet espace n\'est pas disponible actuellement');
                        }
                      }}
                    >
                      <span>Réserver</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MapPin className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun espace trouvé</h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche.
            </p>
            {user && user.role === 'gestionnaire' && (
              <Link to="/spaces/add" className="btn-primary">
                Ajouter un espace
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpacesPage;