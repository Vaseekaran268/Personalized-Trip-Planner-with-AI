import React from 'react';
import type { ItineraryPlan } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { CreditCardIcon, LockIcon, XCircleIcon } from './IconComponents';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  plan: ItineraryPlan;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onConfirm, plan }) => {
  const t = useTranslations();

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 id="payment-modal-title" className="text-2xl font-bold text-brand-dark flex items-center">
            <CreditCardIcon className="w-6 h-6 mr-3 text-brand-primary" />
            {t.payment_modal_title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-2">{t.payment_modal_summary}</p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h3 className="font-bold text-lg text-brand-dark">{plan.tripTitle}</h3>
            <div className="flex justify-between items-baseline mt-2">
              <span className="text-gray-600 font-medium">{t.itinerary_total_cost}:</span>
              <span className="text-2xl font-bold text-brand-secondary">
                ₹{plan.totalEstimatedCost.toFixed(2)}
              </span>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                {t.payment_modal_card_number}
              </label>
              <div className="mt-1 relative">
                <CreditCardIcon className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="card-number"
                  placeholder="49_ _  _ _ _ _  _ _ _ _  _ _ _ _"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700">
                  {t.payment_modal_expiry_date}
                </label>
                <input
                  type="text"
                  id="expiry-date"
                  placeholder="MM / YY"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                  {t.payment_modal_cvc}
                </label>
                <div className="relative mt-1">
                    <LockIcon className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
                    <input
                    type="text"
                    id="cvc"
                    placeholder="_ _ _"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                    disabled
                    />
                </div>
              </div>
            </div>
             <p className="text-xs text-gray-500 text-center pt-2">
                This is a demo. No real payment will be processed.
            </p>
          </form>
        </div>
        
        <div className="p-6 bg-gray-50 rounded-b-2xl flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={handleFormSubmit}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {t.payment_modal_pay_button}
          </button>
          <button
            onClick={onClose}
            className="w-full inline-flex justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t.payment_modal_cancel_button}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
