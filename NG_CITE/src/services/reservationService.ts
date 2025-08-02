interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  spaceId: string;
}

interface Reservation {
  id: string;
  spaceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

class ReservationService {
  private static reservations: Reservation[] = [];

  // Ajouter une réservation
  static addReservation(reservation: Reservation) {
    this.reservations.push(reservation);
  }

  // Vérifier si un créneau est disponible
  static isTimeSlotAvailable(spaceId: string, date: string, startTime: string, endTime: string): boolean {
    const conflictingReservations = this.reservations.filter(reservation => 
      reservation.spaceId === spaceId &&
      reservation.date === date &&
      reservation.status !== 'rejected' &&
      this.timeSlotsOverlap(
        { startTime: reservation.startTime, endTime: reservation.endTime },
        { startTime, endTime }
      )
    );

    return conflictingReservations.length === 0;
  }

  // Vérifier si deux créneaux se chevauchent
  private static timeSlotsOverlap(
    slot1: { startTime: string; endTime: string },
    slot2: { startTime: string; endTime: string }
  ): boolean {
    const start1 = this.timeToMinutes(slot1.startTime);
    const end1 = this.timeToMinutes(slot1.endTime);
    const start2 = this.timeToMinutes(slot2.startTime);
    const end2 = this.timeToMinutes(slot2.endTime);

    return start1 < end2 && start2 < end1;
  }

  // Convertir l'heure en minutes pour faciliter les comparaisons
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Obtenir les créneaux occupés pour un espace et une date
  static getOccupiedSlots(spaceId: string, date: string): TimeSlot[] {
    return this.reservations
      .filter(reservation => 
        reservation.spaceId === spaceId &&
        reservation.date === date &&
        reservation.status !== 'rejected'
      )
      .map(reservation => ({
        date: reservation.date,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        spaceId: reservation.spaceId
      }));
  }

  // Obtenir les créneaux disponibles pour un espace et une date
  static getAvailableSlots(spaceId: string, date: string): string[] {
    const allSlots = [
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
      '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
      '20:00', '21:00', '22:00'
    ];

    const occupiedSlots = this.getOccupiedSlots(spaceId, date);
    
    return allSlots.filter(slot => {
      const nextHour = this.addHour(slot);
      return this.isTimeSlotAvailable(spaceId, date, slot, nextHour);
    });
  }

  // Ajouter une heure à un créneau
  private static addHour(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const newHours = hours + 1;
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Confirmer une réservation
  static confirmReservation(reservationId: string) {
    const reservation = this.reservations.find(r => r.id === reservationId);
    if (reservation) {
      reservation.status = 'confirmed';
    }
  }

  // Rejeter une réservation
  static rejectReservation(reservationId: string) {
    const reservation = this.reservations.find(r => r.id === reservationId);
    if (reservation) {
      reservation.status = 'rejected';
    }
  }

  // Obtenir toutes les réservations
  static getAllReservations(): Reservation[] {
    return this.reservations;
  }

  // Obtenir les réservations en attente
  static getPendingReservations(): Reservation[] {
    return this.reservations.filter(r => r.status === 'pending');
  }
}

export default ReservationService;