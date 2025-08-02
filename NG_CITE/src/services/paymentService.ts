import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface PaymentData {
  amount: number;
  currency: 'XOF';
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  message: string;
}

class PaymentService {
  // Configuration Wave Money - Redirection vers 776334191
  private static WAVE_API_URL = 'https://api.wave.com/v1/checkout/sessions';
  private static WAVE_API_KEY = import.meta.env.VITE_WAVE_API_KEY || 'your_wave_api_key';
  private static WAVE_MERCHANT_PHONE = '776334191'; // Votre numéro

  // Configuration Orange Money - Redirection vers 776334191
  private static ORANGE_API_URL = 'https://api.orange.com/orange-money-webpay/v1/webpayment';
  private static ORANGE_API_KEY = import.meta.env.VITE_ORANGE_API_KEY || 'your_orange_api_key';
  private static ORANGE_MERCHANT_PHONE = '776334191'; // Votre numéro

  // Initier paiement Wave Money
  static async initiateWavePayment(data: PaymentData): Promise<PaymentResponse> {
    try {
      const paymentData = {
        amount: data.amount,
        currency: data.currency,
        error_url: data.cancelUrl,
        success_url: data.returnUrl,
        merchant_phone: this.WAVE_MERCHANT_PHONE,
        checkout_intent: {
          id: data.orderId,
          amount: data.amount,
          currency: data.currency,
          description: data.description,
          merchant_phone: this.WAVE_MERCHANT_PHONE,
          customer: {
            name: data.customerName,
            email: data.customerEmail,
            phone: data.customerPhone,
          },
        },
      };

      console.log('Initiation paiement Wave vers:', this.WAVE_MERCHANT_PHONE, paymentData);
      
      // Simulation de réponse réussie avec redirection vers votre numéro
      const simulatedResponse = {
        success: true,
        paymentUrl: `https://checkout.wave.com/pay/${uuidv4()}?merchant=${this.WAVE_MERCHANT_PHONE}`,
        transactionId: `wave_${uuidv4()}`,
        message: `Paiement Wave initié vers ${this.WAVE_MERCHANT_PHONE}`
      };

      return simulatedResponse;

      /* Code réel à utiliser avec l'API Wave
      const response = await axios.post(this.WAVE_API_URL, paymentData, {
        headers: {
          'Authorization': `Bearer ${this.WAVE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        paymentUrl: response.data.wave_launch_url,
        transactionId: response.data.id,
        message: `Paiement Wave initié vers ${this.WAVE_MERCHANT_PHONE}`
      };
      */
    } catch (error) {
      console.error('Erreur paiement Wave:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'initiation du paiement Wave'
      };
    }
  }

  // Initier paiement Orange Money
  static async initiateOrangePayment(data: PaymentData): Promise<PaymentResponse> {
    try {
      const paymentData = {
        merchant_key: this.ORANGE_API_KEY,
        currency: data.currency,
        order_id: data.orderId,
        amount: data.amount,
        return_url: data.returnUrl,
        cancel_url: data.cancelUrl,
        notif_url: `${window.location.origin}/api/payment/orange/callback`,
        lang: 'fr',
        reference: data.description,
        merchant_phone: this.ORANGE_MERCHANT_PHONE,
        customer: {
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
        },
      };

      console.log('Initiation paiement Orange Money vers:', this.ORANGE_MERCHANT_PHONE, paymentData);
      
      // Simulation de réponse réussie avec redirection vers votre numéro
      const simulatedResponse = {
        success: true,
        paymentUrl: `https://webpayment.orange.com/pay/${uuidv4()}?merchant=${this.ORANGE_MERCHANT_PHONE}`,
        transactionId: `orange_${uuidv4()}`,
        message: `Paiement Orange Money initié vers ${this.ORANGE_MERCHANT_PHONE}`
      };

      return simulatedResponse;

      /* Code réel à utiliser avec l'API Orange Money
      const response = await axios.post(this.ORANGE_API_URL, paymentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        success: true,
        paymentUrl: response.data.payment_url,
        transactionId: response.data.pay_token,
        message: `Paiement Orange Money initié vers ${this.ORANGE_MERCHANT_PHONE}`
      };
      */
    } catch (error) {
      console.error('Erreur paiement Orange Money:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'initiation du paiement Orange Money'
      };
    }
  }

  // Vérifier le statut d'un paiement
  static async checkPaymentStatus(transactionId: string, provider: 'wave' | 'orange'): Promise<{
    status: 'pending' | 'completed' | 'failed' | 'cancelled';
    amount?: number;
    currency?: string;
  }> {
    try {
      console.log(`Vérification statut paiement ${provider}:`, transactionId);
      
      // Simulation de paiement réussi
      return {
        status: 'completed',
        amount: 15000,
        currency: 'XOF'
      };

      /* Code réel pour vérifier le statut
      const apiUrl = provider === 'wave' 
        ? `${this.WAVE_API_URL}/${transactionId}`
        : `${this.ORANGE_API_URL}/status/${transactionId}`;

      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${provider === 'wave' ? this.WAVE_API_KEY : this.ORANGE_API_KEY}`,
        },
      });

      return {
        status: response.data.status,
        amount: response.data.amount,
        currency: response.data.currency
      };
      */
    } catch (error) {
      console.error('Erreur vérification paiement:', error);
      return { status: 'failed' };
    }
  }

  // Générer un ID de commande unique
  static generateOrderId(): string {
    return `NG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default PaymentService;