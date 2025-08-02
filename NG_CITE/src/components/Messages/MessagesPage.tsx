import React, { useState } from 'react';
import { 
  MessageCircle, 
  Search, 
  Plus, 
  Send,
  Paperclip,
  MoreVertical,
  Star,
  Archive,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockUsers, mockArtists } from '../../data/mockData';

interface Message {
  id: string;
  sender: any;
  receiver: any;
  subject: string;
  content: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
}

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showCompose, setShowCompose] = useState(false);

  // Mock messages data
  const mockMessages: Message[] = [
    {
      id: '1',
      sender: mockArtists[0],
      receiver: user || mockUsers[0],
      subject: 'Collaboration pour le festival',
      content: 'Bonjour ! J\'aimerais discuter d\'une possible collaboration pour le prochain festival de percussion. Êtes-vous disponible pour en parler ?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      starred: true
    },
    {
      id: '2',
      sender: mockUsers[0],
      receiver: user || mockUsers[1],
      subject: 'Réservation salle polyvalente',
      content: 'Bonjour, je souhaiterais réserver la salle polyvalente pour un atelier de danse le weekend prochain. Pouvez-vous me confirmer la disponibilité ?',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      read: true,
      starred: false
    },
    {
      id: '3',
      sender: mockArtists[1],
      receiver: user || mockUsers[0],
      subject: 'Cours de danse traditionnelle',
      content: 'Salut ! J\'organise des cours de danse traditionnelle et j\'aimerais savoir si cela vous intéresse. Les cours ont lieu tous les mardis et jeudis.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      starred: false
    }
  ];

  const [messages, setMessages] = useState(mockMessages);

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMessage = selectedConversation 
    ? messages.find(m => m.id === selectedConversation)
    : null;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Simulate sending message
    const message: Message = {
      id: Date.now().toString(),
      sender: user || mockUsers[0],
      receiver: selectedMessage?.sender || mockUsers[1],
      subject: selectedMessage ? `Re: ${selectedMessage.subject}` : 'Nouveau message',
      content: newMessage,
      timestamp: new Date(),
      read: true,
      starred: false
    };

    setMessages([message, ...messages]);
    setNewMessage('');
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages(messages.map(m => 
      m.id === messageId ? { ...m, read: true } : m
    ));
  };

  const handleToggleStar = (messageId: string) => {
    setMessages(messages.map(m => 
      m.id === messageId ? { ...m, starred: !m.starred } : m
    ));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}j`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return 'Maintenant';
    }
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="container py-16 text-center">
          <MessageCircle className="mx-auto text-gray-400 mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès restreint</h1>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à vos messages.</p>
          <a href="/auth" className="btn-primary">Se connecter</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Messages</h1>
            <p className="text-gray-600">Communiquez avec les membres de la communauté</p>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nouveau message</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Messages List */}
          <div className="lg:col-span-1 card p-0 overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher dans les messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-field"
                />
              </div>
            </div>

            {/* Messages */}
            <div className="overflow-y-auto flex-1">
              {filteredMessages.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => {
                        setSelectedConversation(message.id);
                        if (!message.read) {
                          handleMarkAsRead(message.id);
                        }
                      }}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                        selectedConversation === message.id ? 'bg-orange-50 border-r-2 border-orange-500' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-orange-400 to-blue-500 p-0.5">
                          <div className="w-full h-full rounded-full overflow-hidden">
                            {message.sender.avatar ? (
                              <img 
                                src={message.sender.avatar} 
                                alt={message.sender.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-sm font-bold">
                                  {message.sender.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm truncate ${!message.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                              {message.sender.name}
                            </h4>
                            <div className="flex items-center space-x-1">
                              {message.starred && (
                                <Star className="text-yellow-400 fill-current" size={14} />
                              )}
                              <span className="text-xs text-gray-500">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                          </div>
                          <p className={`text-sm truncate mb-1 ${!message.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                            {message.subject}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {message.content}
                          </p>
                        </div>
                        
                        {!message.read && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600">Aucun message trouvé</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 card p-0 overflow-hidden flex flex-col">
            {selectedMessage ? (
              <>
                {/* Message Header */}
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-orange-400 to-blue-500 p-0.5">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          {selectedMessage.sender.avatar ? (
                            <img 
                              src={selectedMessage.sender.avatar} 
                              alt={selectedMessage.sender.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-lg font-bold">
                                {selectedMessage.sender.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedMessage.sender.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{selectedMessage.sender.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleStar(selectedMessage.id)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          selectedMessage.starred 
                            ? 'text-yellow-500 hover:bg-yellow-50' 
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        <Star size={20} className={selectedMessage.starred ? 'fill-current' : ''} />
                      </button>
                      <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors duration-200">
                        <Archive size={20} />
                      </button>
                      <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors duration-200">
                        <Trash2 size={20} />
                      </button>
                      <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors duration-200">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedMessage.subject}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedMessage.timestamp.toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.content}
                    </p>
                  </div>
                </div>

                {/* Reply Form */}
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Tapez votre réponse..."
                        rows={3}
                        className="input-field resize-none"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-200 transition-colors duration-200">
                        <Paperclip size={20} />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={18} />
                        <span>Envoyer</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Sélectionnez une conversation
                  </h3>
                  <p className="text-gray-600">
                    Choisissez un message dans la liste pour commencer à discuter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;