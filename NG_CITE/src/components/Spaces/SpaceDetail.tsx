import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ArrowLeft,
  MapPin,
  Users,
  Star,
  Calendar,
  Clock,
  Wifi,
  Car,
  Volume2,
  Lightbulb,
  Share2,
  Heart,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { mockSpaces } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import PaymentModal from '../Payment/PaymentModal';
import NotificationService from '../../services/notificationService';
import ReservationService from '../../services/reservationService';
import toast from 'react-hot-toast';

const SpaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('1');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [reservationData, setReservationData] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const space = mockSpaces.find(s => s.id === id);

  if (!space) {
    return <Navigate to="/spaces" replace />;
  }

  // Mettre à jour les créneaux disponibles quand la date change
  React.useEffect(() => {
    if (selectedDate && space) {
      const available = ReservationService.getAvailableSlots(space.id, selectedDate);
      setAvailableSlots(available);
      
      // Si le créneau sélectionné n'est plus disponible, le réinitialiser
      if (selectedTime && !available.includes(selectedTime)) {
        setSelectedTime('');
      }
    }
  }, [selectedDate, space?.id]);

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
        title: space.name,
        text: space.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers !');
    }
  };

  const handleReservation = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour réserver');
      return;
    }
    
    if (!selectedDate || !selectedTime) {
      toast.error('Veuillez sélectionner une date et une heure');
      return;
    }
    
    const duration = parseInt(selectedDuration);
    const endTime = calculateEndTime(selectedTime, duration);
    
    // Vérifier la disponibilité du créneau
    if (!ReservationService.isTimeSlotAvailable(space.id, selectedDate, selectedTime, endTime)) {
      toast.error('Ce créneau n\'est plus disponible. Veuillez choisir un autre horaire.');
      return;
    }
    
    const totalCost = space.hourlyRate ? space.hourlyRate * duration : 0;
    
    const reservation = {
      id: Date.now().toString(),
      space,
      user,
      date: selectedDate,
      startTime: selectedTime,
      endTime,
      duration,
      totalCost,
      status: 'pending',
      createdAt: new Date(),
    };
    
    setReservationData(reservation);
    
    if (totalCost > 0) {
      setShowPaymentModal(true);
    } else {
      processReservation(reservation);
    }
  };

  const processReservation = async (reservation: any, transactionId?: string) => {
    try {
      // Ajouter la réservation au service
      ReservationService.addReservation({
        id: reservation.id,
        spaceId: reservation.space.id,
        date: reservation.date,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        status: 'pending'
      });
      
      // Envoyer notifications
      await NotificationService.notifyAdminReservation(reservation, space, user);
      await NotificationService.notifyUserReservation(reservation, space, user, 'pending');
      
      toast.success('Demande de réservation envoyée avec succès !');
      
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setSelectedDuration('1');
      setShowPaymentModal(false);
      setReservationData(null);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la demande');
    }
  };

  const handlePaymentSuccess = (transactionId: string) => {
    if (reservationData) {
      // Notifier l'admin du paiement reçu
      NotificationService.notifyPaymentReceived(
        {
          amount: reservationData.totalCost,
          provider: 'wave', // ou 'orange' selon le choix
          transactionId
        },
        reservationData,
        user
      );
      
      processReservation({ ...reservationData, transactionId });
    }
  };

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

  // Calculer l'heure de fin
  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + duration;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page-container">
      <div className="container py-8">
        {/* Back Button */}
        <Link 
          to="/spaces" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>Retour aux espaces</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="card p-0 overflow-hidden">
              <div className="aspect-video relative">
                <img 
                  src={space.images[selectedImage]} 
                  alt={space.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(space.category)}`}>
                    {getCategoryLabel(space.category)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    space.availability ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {space.availability ? 'Disponible' : 'Occupé'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <button
                    onClick={handleFavorite}
                    className={`p-2 rounded-lg backdrop-blur-sm transition-colors duration-200 ${
                      isFavorite 
                        ? 'bg-red-500/20 text-red-600' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-200"
                  >
                    <Share2 size={20} />
                  </button>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-2xl font-bold text-white font-heading mb-2">
                    {space.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-white/90">
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span className="text-sm">{space.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span className="text-sm">{space.capacity} personnes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="text-sm">{space.rating} ({space.reviewsCount})</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image Thumbnails */}
              {space.images.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex space-x-2 overflow-x-auto">
                    {space.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                          selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${space.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Space Details */}
            <div className="card p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <Users className="mx-auto text-blue-500 mb-2" size={24} />
                  <div className="font-semibold text-gray-900">{space.capacity}</div>
                  <div className="text-sm text-gray-600">Capacité max</div>
                </div>
                <div className="text-center">
                  <Star className="mx-auto text-yellow-500 mb-2" size={24} />
                  <div className="font-semibold text-gray-900">{space.rating}/5</div>
                  <div className="text-sm text-gray-600">{space.reviewsCount} avis</div>
                </div>
                {space.hourlyRate && (
                  <div className="text-center">
                    <Clock className="mx-auto text-green-500 mb-2" size={24} />
                    <div className="font-semibold text-gray-900">{space.hourlyRate.toLocaleString()} FCFA</div>
                    <div className="text-sm text-gray-600">Par heure</div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{space.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Équipements disponibles</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {space.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      {getAmenityIcon(amenity)}
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Owner Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Propriétaire</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-orange-400 to-blue-500 p-0.5">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      {space.owner.avatar ? (
                        <img 
                          src={space.owner.avatar} 
                          alt={space.owner.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xl font-bold">
                            {space.owner.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{space.owner.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{space.owner.role}</p>
                    {space.owner.bio && (
                      <p className="text-sm text-gray-600 mt-1">{space.owner.bio}</p>
                    )}
                  </div>
                  <Link 
                    to={`/directory/${space.owner.id}`}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <User size={18} />
                    <span>Voir profil</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Reservation */}
          <div className="space-y-6">
            {/* Reservation Card */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Réserver cet espace</h3>
              
              {space.availability ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                      Date souhaitée
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de début
                    </label>
                    <select
                      id="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="input-field"
                      disabled={!selectedDate}
                    >
                      <option value="">
                        {!selectedDate ? 'Sélectionnez d\'abord une date' : 'Sélectionner une heure'}
                      </option>
                      {availableSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {selectedDate && availableSlots.length === 0 && (
                      <p className="text-sm text-red-600 mt-1">
                        Aucun créneau disponible pour cette date
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                      Durée (heures)
                    </label>
                    <select
                      id="duration"
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      className="input-field"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
                        <option key={hour} value={hour}>
                          {hour} heure{hour > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  {space.hourlyRate && selectedDate && selectedTime && selectedDuration && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-800">Tarif horaire</span>
                          <span className="font-semibold text-blue-900">
                            {space.hourlyRate.toLocaleString()} FCFA
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-800">Durée</span>
                          <span className="font-semibold text-blue-900">
                            {selectedDuration} heure{parseInt(selectedDuration) > 1 ? 's' : ''}
                          </span>
                        </div>
                        <hr className="border-blue-200" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-blue-800">Total</span>
                          <span className="font-bold text-lg text-blue-900">
                            {(space.hourlyRate * parseInt(selectedDuration)).toLocaleString()} FCFA
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {!space.hourlyRate && selectedDate && selectedTime && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-800">Réservation</span>
                        <span className="font-semibold text-blue-900">
                          Gratuite
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleReservation}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Calendar size={18} />
                    <span>Demander une réservation</span>
                  </button>

                  <div className="text-xs text-gray-500 text-center">
                    Votre demande sera envoyée au propriétaire pour validation
                  </div>

                  {/* Payment Modal */}
                  {showPaymentModal && reservationData && (
                    <PaymentModal
                      isOpen={showPaymentModal}
                      onClose={() => setShowPaymentModal(false)}
                      amount={reservationData.totalCost}
                      description={`Réservation ${space.name} - ${selectedDate}`}
                      customerName={user?.name || ''}
                      customerEmail={user?.email || ''}
                      customerPhone={user?.phone || ''}
                      onPaymentSuccess={handlePaymentSuccess}
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="mx-auto text-red-500 mb-3" size={48} />
                  <h4 className="font-semibold text-gray-900 mb-2">Espace non disponible</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Cet espace n'est pas disponible pour le moment.
                  </p>
                  <button className="btn-outline w-full" disabled>
                    Réservation impossible
                  </button>
                </div>
              )}
            </div>

            {/* Contact Owner */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacter le propriétaire</h3>
              <div className="space-y-3 mb-4">
                {space.owner.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone size={16} />
                    <span className="text-sm">{space.owner.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail size={16} />
                  <span className="text-sm">{space.owner.email}</span>
                </div>
              </div>
              <button className="w-full btn-outline">
                Envoyer un message
              </button>
            </div>

            {/* Similar Spaces */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Espaces similaires</h3>
              <div className="space-y-3">
                {mockSpaces
                  .filter(s => s.id !== space.id && s.category === space.category)
                  .slice(0, 3)
                  .map((similarSpace) => (
                    <Link 
                      key={similarSpace.id}
                      to={`/spaces/${similarSpace.id}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={similarSpace.images[0]} 
                          alt={similarSpace.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm mb-1">
                            {similarSpace.name}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <Users size={12} />
                            <span>{similarSpace.capacity} pers.</span>
                            <Star className="text-yellow-400 fill-current" size={12} />
                            <span>{similarSpace.rating}</span>
                          </div>
                        </div>
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

export default SpaceDetail;