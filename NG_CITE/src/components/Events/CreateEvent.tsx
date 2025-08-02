import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Tag,
  Image as ImageIcon,
  Save,
  Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationService from '../../services/notificationService';
import toast from 'react-hot-toast';

const CreateEvent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    maxParticipants: '',
    price: '',
    image: '',
    tags: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Musique',
    'Danse',
    'Théâtre',
    'Littérature',
    'Arts visuels',
    'Artisanat',
    'Cinéma',
    'Conférence',
    'Atelier',
    'Festival',
    'Autre'
  ];

  const locations = [
    'Centre Culturel Niarry Gouye',
    'Place centrale Niarry Gouye',
    'Bibliothèque communautaire',
    'École primaire Niarry Gouye',
    'Terrain de football',
    'Salle polyvalente',
    'Autre'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (!formData.date) {
      newErrors.date = 'La date est requise';
    } else {
      const eventDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        newErrors.date = 'La date ne peut pas être dans le passé';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'L\'heure de début est requise';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'L\'heure de fin est requise';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'L\'heure de fin doit être après l\'heure de début';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Le lieu est requis';
    }

    if (formData.maxParticipants && parseInt(formData.maxParticipants) < 1) {
      newErrors.maxParticipants = 'Le nombre de participants doit être positif';
    }

    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = 'Le prix ne peut pas être négatif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Créer l'événement
      const newEvent = {
        id: Date.now().toString(),
        ...formData,
        organizer: user,
        currentParticipants: 0,
        status: 'upcoming',
        createdAt: new Date(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };
      
      // Envoyer notification à l'admin
      await NotificationService.notifyEventCreated(newEvent, user);
      
      toast.success('Événement créé avec succès !');
      navigate('/events');
    } catch (error) {
      toast.error('Erreur lors de la création de l\'événement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs avant la prévisualisation');
      return;
    }
    
    // Store form data in localStorage for preview
    localStorage.setItem('eventPreview', JSON.stringify(formData));
    window.open('/events/preview', '_blank');
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès restreint</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour créer un événement.</p>
          <Link to="/auth" className="btn-primary">Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/events" 
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span>Retour</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-heading">Créer un événement</h1>
              <p className="text-gray-600">Partagez votre événement culturel avec la communauté</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handlePreview}
            className="btn-outline flex items-center space-x-2"
          >
            <Eye size={18} />
            <span>Prévisualiser</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de l'événement *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`input-field ${errors.title ? 'border-red-300' : ''}`}
                      placeholder="Ex: Festival de percussion Niarry Gouye"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`input-field resize-none ${errors.description ? 'border-red-300' : ''}`}
                      placeholder="Décrivez votre événement en détail..."
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Catégorie *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`input-field ${errors.category ? 'border-red-300' : ''}`}
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                    </div>

                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                        Mots-clés
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="musique, traditionnel, gratuit (séparés par des virgules)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Calendar size={20} />
                  <span>Date et horaires</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`input-field ${errors.date ? 'border-red-300' : ''}`}
                    />
                    {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                  </div>

                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de début *
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className={`input-field ${errors.startTime ? 'border-red-300' : ''}`}
                    />
                    {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
                  </div>

                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de fin *
                    </label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className={`input-field ${errors.endTime ? 'border-red-300' : ''}`}
                    />
                    {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <MapPin size={20} />
                  <span>Lieu</span>
                </h2>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu de l'événement *
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`input-field ${errors.location ? 'border-red-300' : ''}`}
                  >
                    <option value="">Sélectionner un lieu</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>
              </div>

              {/* Additional Details */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails supplémentaires</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre maximum de participants
                    </label>
                    <input
                      type="number"
                      id="maxParticipants"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      min="1"
                      className={`input-field ${errors.maxParticipants ? 'border-red-300' : ''}`}
                      placeholder="Laisser vide si illimité"
                    />
                    {errors.maxParticipants && <p className="mt-1 text-sm text-red-600">{errors.maxParticipants}</p>}
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Prix d'entrée (FCFA)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      className={`input-field ${errors.price ? 'border-red-300' : ''}`}
                      placeholder="0 pour gratuit"
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                    URL de l'image (optionnel)
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://exemple.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview Card */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Titre:</span>
                    <p className="text-gray-600">{formData.title || 'Non défini'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Catégorie:</span>
                    <p className="text-gray-600">{formData.category || 'Non définie'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p className="text-gray-600">
                      {formData.date ? new Date(formData.date).toLocaleDateString('fr-FR') : 'Non définie'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Horaires:</span>
                    <p className="text-gray-600">
                      {formData.startTime && formData.endTime 
                        ? `${formData.startTime} - ${formData.endTime}`
                        : 'Non définis'
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Lieu:</span>
                    <p className="text-gray-600">{formData.location || 'Non défini'}</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="card p-6 bg-blue-50 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Conseils</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Utilisez un titre accrocheur et descriptif</li>
                  <li>• Ajoutez une description détaillée</li>
                  <li>• Choisissez des mots-clés pertinents</li>
                  <li>• Ajoutez une image pour plus d'impact</li>
                  <li>• Vérifiez la disponibilité du lieu</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Création en cours...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Créer l'événement</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;