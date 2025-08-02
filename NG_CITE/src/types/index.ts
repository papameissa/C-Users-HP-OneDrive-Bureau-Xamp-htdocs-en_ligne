export interface User {
  id: string;
  name: string;
  email: string;
  role: 'habitant' | 'artiste' | 'gestionnaire' | 'admin';
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Artist extends User {
  role: 'artiste';
  specialties: string[];
  portfolio: string[];
  experience: string;
  availability: boolean;
  rating: number;
  reviewsCount: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  organizer: User;
  maxParticipants?: number;
  currentParticipants: number;
  image?: string;
  price?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags: string[];
  createdAt: Date;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  capacity: number;
  amenities: string[];
  images: string[];
  hourlyRate?: number;
  location: string;
  owner: User;
  availability: boolean;
  rating: number;
  reviewsCount: number;
  category: 'salle' | 'terrain' | 'studio' | 'scene' | 'autre';
}

export interface Reservation {
  id: string;
  space: Space;
  user: User;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed';
  totalCost?: number;
  notes?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  sender: User;
  receiver: User;
  subject: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: User;
  category: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  expiresAt?: Date;
}