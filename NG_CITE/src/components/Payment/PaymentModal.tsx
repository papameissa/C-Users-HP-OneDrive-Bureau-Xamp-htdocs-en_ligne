import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import PaymentService, { PaymentData } from '../../services/paymentService';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onPaymentSuccess: (transactionId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  description,
  customerName,
  customerEmail,
  customerPhone,
  onPaymentSuccess,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'wave' | 'orange' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handlePayment = async (provider: 'wave' | 'orange') => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    setSelectedProvider(provider);

    const paymentData: PaymentData = {
      amount,
      currency: 'XOF',
      description,
      customerName,
      customerEmail,
      customerPhone,
      orderId: PaymentService.generateOrderId(),
      returnUrl: `${window.location.origin}/payment/success`,
      cancelUrl: `${window.location.origin}/payment/cancel`,
    };

    try {
      let response;
      if (provider === 'wave') {
        response = await PaymentService.initiateWavePayment(paymentData);
      } else {
        response = await PaymentService.initiateOrangePayment(paymentData);
      }

      if (response.success && response.paymentUrl) {
        // Ouvrir la page de paiement dans une nouvelle fenêtre
        const paymentWindow = window.open(
          response.paymentUrl,
          'payment',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        // Simuler le succès du paiement après 3 secondes (pour la démo)
        setTimeout(() => {
          setPaymentStatus('success');
          toast.success('Paiement effectué avec succès !');
          toast.success(`Paiement de ${formatAmount(amount)} FCFA envoyé vers 776334191`);
          onPaymentSuccess(response.transactionId!);
          
          if (paymentWindow) {
            paymentWindow.close();
          }
          
          setTimeout(() => {
            onClose();
            setPaymentStatus('idle');
            setIsProcessing(false);
            setSelectedProvider(null);
          }, 2000);
        }, 3000);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setPaymentStatus('error');
      toast.error('Erreur lors du paiement');
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Paiement sécurisé</h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Montant à payer :</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatAmount(amount)} FCFA
            </span>
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        {/* Payment Status */}
        {paymentStatus === 'processing' && (
          <div className="text-center mb-6">
            <Loader className="animate-spin mx-auto mb-3 text-blue-600" size={32} />
            <p className="text-gray-600">
              Redirection vers {selectedProvider === 'wave' ? 'Wave Money' : 'Orange Money'}...
            </p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center mb-6">
            <CheckCircle className="mx-auto mb-3 text-green-600" size={32} />
            <p className="text-green-600 font-medium">Paiement réussi !</p>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="text-center mb-6">
            <AlertCircle className="mx-auto mb-3 text-red-600" size={32} />
            <p className="text-red-600 font-medium">Erreur de paiement</p>
          </div>
        )}

        {/* Payment Methods */}
        {paymentStatus === 'idle' && (
          <div className="space-y-3">
            <p className="text-gray-700 font-medium mb-4">Choisissez votre méthode de paiement :</p>
            
            {/* Wave Money */}
            <button
              onClick={() => handlePayment('wave')}
              disabled={isProcessing}
              className="w-full flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Smartphone className="text-white" size={24} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">Wave Money</h3>
                <p className="text-sm text-gray-600">Paiement mobile sécurisé</p>
              </div>
              <div className="text-blue-600 font-medium">
                {formatAmount(amount)} FCFA
              </div>
            </button>

            {/* Orange Money */}
            <button
              onClick={() => handlePayment('orange')}
              disabled={isProcessing}
              className="w-full flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <CreditCard className="text-white" size={24} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900">Orange Money</h3>
                <p className="text-sm text-gray-600">Paiement mobile Orange</p>
              </div>
              <div className="text-orange-600 font-medium">
                {formatAmount(amount)} FCFA
              </div>
            </button>
          </div>
        )}

        {/* Security Notice */}
        {paymentStatus === 'idle' && (
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700 text-center">
              🔒 Paiement 100% sécurisé • Vos données sont protégées
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;