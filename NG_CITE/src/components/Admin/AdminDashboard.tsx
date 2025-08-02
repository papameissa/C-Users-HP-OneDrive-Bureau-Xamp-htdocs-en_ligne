import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Bell, 
  CheckCircle, 
  XCircle,
  Eye,
  Mail,
  Phone,
  Clock,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockEvents, mockSpaces, mockUsers, mockArtists } from '../../data/mockData';
import NotificationService from '../../services/notificationService';
import toast from 'react-hot-toast';

interface Reservation {
  id: string;
  space: any;
  user: any;
  date: string;
  startTime: string;
  duration: number;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: Date;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Simuler des réservations en attente
  useEffect(() => {
    const mockReservations: Reservation[] = [
      {
        id: '1',
        space: mockSpaces[0],
        user: mockUsers[1],
        date: '2024-02-20',
        startTime: '14:00',
        duration: 3,
        totalCost: 45000,
        status: 'pending',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: '2',
        space: mockSpaces[1],
        user: mockArtists[0],
        date: '2024-02-22',
        startTime: '16:00',
        duration: 2,
        totalCost: 10000,
        status: 'pending',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
    ];
    setPendingReservations(mockReservations);
  }, []);

  const handleReservationAction = async (reservationId: string, action: 'confirm' | 'reject') => {
    const reservation = pendingReservations.find(r => r.id === reservationId);
    if (!reservation) return;

    try {
      // Mettre à jour le statut
      const newStatus = action === 'confirm' ? 'confirmed' : 'rejected';
      setPendingReservations(prev => 
        prev.map(r => r.id === reservationId ? { ...r, status: newStatus } : r)
      );

      // Envoyer notification à l'utilisateur
      await NotificationService.notifyUserReservation(
        reservation, 
        reservation.space, 
        reservation.user, 
        newStatus
      );

      toast.success(`Réservation ${action === 'confirm' ? 'confirmée' : 'refusée'} avec succès`);
    } catch (error) {
      toast.error('Erreur lors du traitement de la réservation');
    }
  };

  const stats = {
    totalUsers: mockUsers.length + mockArtists.length,
    totalEvents: mockEvents.length,
    totalSpaces: mockSpaces.length,
    pendingReservations: pendingReservations.filter(r => r.status === 'pending').length,
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
    { id: 'reservations', label: 'Réservations', icon: Calendar },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  if (!user || user.role !== 'gestionnaire') {
    return (
      <div className="page-container">
        <div className="container py-16 text-center">
          <XCircle className="mx-auto text-red-500 mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès restreint</h1>
          <p className="text-gray-600">Seuls les gestionnaires peuvent accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title">Tableau de bord administrateur</h1>
          <p className="text-gray-600">Gérez la plateforme culturelle Niarry Gouye</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Événements</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <Calendar className="text-green-600" size={32} />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Espaces</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSpaces}</p>
              </div>
              <MapPin className="text-purple-600" size={32} />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Réservations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReservations}</p>
              </div>
              <Bell className="text-orange-600" size={32} />
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Events */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Événements récents</h3>
                    <div className="space-y-3">
                      {mockEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="text-orange-500" size={20} />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{event.title}</h4>
                            <p className="text-sm text-gray-600">
                              {event.date.toLocaleDateString('fr-FR')} • {event.currentParticipants} participants
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular Spaces */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Espaces populaires</h3>
                    <div className="space-y-3">
                      {mockSpaces.slice(0, 3).map((space) => (
                        <div key={space.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="text-blue-500" size={20} />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{space.name}</h4>
                            <p className="text-sm text-gray-600">
                              {space.capacity} personnes • Note: {space.rating}/5
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Réservations en attente ({pendingReservations.filter(r => r.status === 'pending').length})
                </h3>
                
                {pendingReservations.filter(r => r.status === 'pending').length > 0 ? (
                  <div className="space-y-4">
                    {pendingReservations
                      .filter(r => r.status === 'pending')
                      .map((reservation) => (
                        <div key={reservation.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-orange-400 to-blue-500 p-0.5">
                                  <div className="w-full h-full rounded-full overflow-hidden">
                                    {reservation.user.avatar ? (
                                      <img 
                                        src={reservation.user.avatar} 
                                        alt={reservation.user.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500 text-sm font-bold">
                                          {reservation.user.name.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{reservation.user.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    Demande de réservation pour <strong>{reservation.space.name}</strong>
                                  </p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="text-gray-400" size={16} />
                                  <span className="text-sm text-gray-600">{reservation.date}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="text-gray-400" size={16} />
                                  <span className="text-sm text-gray-600">{reservation.startTime}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Users className="text-gray-400" size={16} />
                                  <span className="text-sm text-gray-600">{reservation.duration}h</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="text-gray-400" size={16} />
                                  <span className="text-sm text-gray-600">
                                    {reservation.totalCost.toLocaleString()} FCFA
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Mail size={14} />
                                  <span>{reservation.user.email}</span>
                                </div>
                                {reservation.user.phone && (
                                  <div className="flex items-center space-x-1">
                                    <Phone size={14} />
                                    <span>{reservation.user.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => handleReservationAction(reservation.id, 'confirm')}
                                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                              >
                                <CheckCircle size={16} />
                                <span>Confirmer</span>
                              </button>
                              <button
                                onClick={() => handleReservationAction(reservation.id, 'reject')}
                                className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                              >
                                <XCircle size={16} />
                                <span>Refuser</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600">Aucune réservation en attente</p>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisateurs récents</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rôle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Inscription
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[...mockUsers, ...mockArtists].slice(0, 5).map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-orange-400 to-blue-500 p-0.5">
                                <div className="w-full h-full rounded-full overflow-hidden">
                                  {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-500 text-sm font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'artiste' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'gestionnaire' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.createdAt.toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-orange-600 hover:text-orange-900 flex items-center space-x-1">
                              <Eye size={16} />
                              <span>Voir</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Centre de notifications</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bell className="text-blue-600" size={20} />
                    <h4 className="font-semibold text-blue-900">Configuration des notifications</h4>
                  </div>
                  <p className="text-blue-800 text-sm mb-4">
                    Les notifications par email et SMS sont configurées et fonctionnelles. 
                    Vous recevrez automatiquement les alertes pour :
                  </p>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Nouvelles demandes de réservation</li>
                    <li>• Création d'événements</li>
                    <li>• Inscriptions d'utilisateurs</li>
                    <li>• Paiements effectués</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;