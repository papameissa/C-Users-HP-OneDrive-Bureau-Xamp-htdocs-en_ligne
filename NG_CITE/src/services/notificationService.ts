import emailjs from '@emailjs/browser';
import axios from 'axios';

// Configuration EmailJS
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_dqlohf6';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_n224sdh';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'V0rqebtxkOhKdMvar';

// Configuration SMS
const SMS_API_URL = import.meta.env.VITE_SMS_API_URL || 'https://api.sms-senegal.com/send';
const SMS_API_KEY = import.meta.env.VITE_SMS_API_KEY || 'your_sms_api_key';

// Informations administrateur
const ADMIN_EMAIL = 'lefa5195@gmail.com';
const ADMIN_PHONE = '776334191';

export interface NotificationData {
  to: string;
  subject: string;
  message: string;
  type: 'reservation' | 'event' | 'general';
  userType: 'admin' | 'user';
}

export interface SMSData {
  phone: string;
  message: string;
}

class NotificationService {
  // Initialiser EmailJS
  static init() {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // Envoyer notification email
  static async sendEmail(data: NotificationData): Promise<boolean> {
    try {
      const templateParams = {
        to_email: data.to,
        subject: data.subject,
        message: data.message,
        notification_type: data.type,
        user_type: data.userType,
        platform_name: 'Niarry Gouye',
        platform_url: window.location.origin,
        current_date: new Date().toLocaleDateString('fr-FR'),
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('Email envoyé avec succès:', response);
      return true;
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return false;
    }
  }

  // Envoyer SMS
  static async sendSMS(data: SMSData): Promise<boolean> {
    try {
      // Simulation de SMS pour la démo (évite les erreurs réseau)
      console.log('SMS simulé envoyé à:', data.phone);
      console.log('Message:', data.message);
      return true;

      /* Code réel à utiliser avec une vraie API SMS
      const response = await axios.post(SMS_API_URL, {
        phone: data.phone,
        message: data.message,
        api_key: SMS_API_KEY,
      });

      console.log('SMS envoyé avec succès:', response.data);
      return true;
      */
    } catch (error) {
      console.error('Erreur envoi SMS:', error);
      return true;
    }
  }

  // Notification de réservation pour l'admin
  static async notifyAdminReservation(reservation: any, space: any, user: any) {
    const emailData: NotificationData = {
      to: ADMIN_EMAIL,
      subject: `Nouvelle demande de réservation - ${space.name}`,
      message: `
        Bonjour,

        Vous avez reçu une nouvelle demande de réservation pour l'espace "${space.name}".

        Détails de la réservation :
        - Demandeur : ${user.name}
        - Email : ${user.email}
        - Téléphone : ${user.phone || 'Non renseigné'}
        - Date : ${reservation.date}
        - Heure : ${reservation.startTime} - ${reservation.endTime}
        - Durée : ${reservation.duration || 'Non spécifiée'} heure(s)
        - Coût total : ${reservation.totalCost ? reservation.totalCost.toLocaleString() + ' FCFA' : 'Gratuit'}

        Veuillez vous connecter à votre espace admin pour valider ou refuser cette demande.

        Cordialement,
        L'équipe Niarry Gouye
      `,
      type: 'reservation',
      userType: 'admin'
    };

    const smsData: SMSData = {
      phone: ADMIN_PHONE,
      message: `Nouvelle réservation ${space.name} par ${user.name} le ${reservation.date} à ${reservation.startTime}. Consultez votre email pour plus de détails.`
    };

    await Promise.all([
      this.sendEmail(emailData),
      this.sendSMS(smsData)
    ]);
  }

  // Notification de confirmation pour l'utilisateur
  static async notifyUserReservation(reservation: any, space: any, user: any, status: 'pending' | 'confirmed' | 'rejected') {
    const statusText = {
      pending: 'en attente de validation',
      confirmed: 'confirmée',
      rejected: 'refusée'
    };

    const emailData: NotificationData = {
      to: user.email,
      subject: `Réservation ${statusText[status]} - ${space.name}`,
      message: `
        Bonjour ${user.name},

        Votre demande de réservation pour "${space.name}" est ${statusText[status]}.

        Détails de votre réservation :
        - Espace : ${space.name}
        - Date : ${reservation.date}
        - Heure : ${reservation.startTime} - ${reservation.endTime}
        - Statut : ${statusText[status]}
        ${reservation.totalCost ? `- Coût total : ${reservation.totalCost.toLocaleString()} FCFA` : ''}

        ${status === 'confirmed' ? 'Vous pouvez maintenant utiliser cet espace aux dates convenues.' : ''}
        ${status === 'rejected' ? 'Vous pouvez contacter l\'administrateur pour plus d\'informations.' : ''}

        Cordialement,
        L'équipe Niarry Gouye
      `,
      type: 'reservation',
      userType: 'user'
    };

    const smsData: SMSData = {
      phone: user.phone || '',
      message: `Réservation ${space.name} ${statusText[status]} pour le ${reservation.date}. Consultez votre email pour plus de détails.`
    };

    await Promise.all([
      this.sendEmail(emailData),
      user.phone ? this.sendSMS(smsData) : Promise.resolve(true)
    ]);

    // Notification à l'admin aussi
    if (status !== 'pending') {
      const adminNotification: NotificationData = {
        to: ADMIN_EMAIL,
        subject: `Réservation ${statusText[status]} - ${space.name}`,
        message: `
          La réservation de ${user.name} pour "${space.name}" le ${reservation.date} a été ${statusText[status]}.
          
          Détails :
          - Client : ${user.name} (${user.email})
          - Date : ${reservation.date}
          - Heure : ${reservation.startTime} - ${reservation.endTime}
          - Statut : ${statusText[status]}
        `,
        type: 'reservation',
        userType: 'admin'
      };

      const adminSMS: SMSData = {
        phone: ADMIN_PHONE,
        message: `Réservation ${space.name} ${statusText[status]} pour ${user.name} le ${reservation.date}.`
      };

      await Promise.all([
        this.sendEmail(adminNotification),
        this.sendSMS(adminSMS)
      ]);
    }
  }

  // Notification d'événement
  static async notifyEventCreated(event: any, organizer: any) {
    const emailData: NotificationData = {
      to: ADMIN_EMAIL,
      subject: `Nouvel événement créé - ${event.title}`,
      message: `
        Un nouvel événement a été créé sur la plateforme :

        - Titre : ${event.title}
        - Organisateur : ${organizer.name} (${organizer.email})
        - Date : ${event.date}
        - Heure : ${event.startTime} - ${event.endTime}
        - Lieu : ${event.location}
        - Catégorie : ${event.category}
        - Prix : ${event.price ? event.price.toLocaleString() + ' FCFA' : 'Gratuit'}

        L'événement est maintenant visible sur la plateforme.

        Cordialement,
        L'équipe Niarry Gouye
      `,
      type: 'event',
      userType: 'admin'
    };

    const smsData: SMSData = {
      phone: ADMIN_PHONE,
      message: `Nouvel événement "${event.title}" créé par ${organizer.name} le ${event.date}. Consultez votre email pour plus de détails.`
    };

    await Promise.all([
      this.sendEmail(emailData),
      this.sendSMS(smsData)
    ]);
  }

  // Notification de paiement
  static async notifyPaymentReceived(payment: any, reservation: any, user: any) {
    const emailData: NotificationData = {
      to: ADMIN_EMAIL,
      subject: `Paiement reçu - ${payment.amount.toLocaleString()} FCFA`,
      message: `
        Un paiement a été reçu sur votre compte :

        Détails du paiement :
        - Montant : ${payment.amount.toLocaleString()} FCFA
        - Méthode : ${payment.provider === 'wave' ? 'Wave Money' : 'Orange Money'}
        - Transaction ID : ${payment.transactionId}
        - Client : ${user.name} (${user.email})
        
        Réservation associée :
        - Espace : ${reservation.space.name}
        - Date : ${reservation.date}
        - Heure : ${reservation.startTime} - ${reservation.endTime}

        Le paiement a été crédité sur votre numéro 776334191.

        Cordialement,
        L'équipe Niarry Gouye
      `,
      type: 'general',
      userType: 'admin'
    };

    const smsData: SMSData = {
      phone: ADMIN_PHONE,
      message: `Paiement reçu: ${payment.amount.toLocaleString()} FCFA de ${user.name} pour réservation ${reservation.space.name} le ${reservation.date}.`
    };

    await Promise.all([
      this.sendEmail(emailData),
      this.sendSMS(smsData)
    ]);
  }
}

export default NotificationService;