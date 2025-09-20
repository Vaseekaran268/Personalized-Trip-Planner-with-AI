import React, { useState } from 'react';
import type { ItineraryPlan, User } from '../types';
import { BriefcaseIcon, CheckCircleIcon, CreditCardIcon, MapPinIcon, TicketIcon, ArrowLeftIcon, BuildingIcon, CarIcon, ShareIcon } from './IconComponents';
import { useTranslations } from '../hooks/useTranslations';

interface ItineraryDisplayProps {
  plan: ItineraryPlan;
  user: User | null;
  onStartBooking: () => void;
  bookingStatus: 'idle' | 'booked' | 'failed';
  onReset: () => void;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ plan, user, onStartBooking, bookingStatus, onReset }) => {
  const t = useTranslations();
  const [shareFeedback, setShareFeedback] = useState('');

  const handleShare = () => {
    const jsonString = JSON.stringify(plan);
    const base64String = btoa(jsonString);
    const url = `${window.location.origin}${window.location.pathname}?itinerary=${base64String}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareFeedback(t.share_link_copied);
      setTimeout(() => setShareFeedback(''), 2000);
    }, () => {
      setShareFeedback('Failed to copy link.');
      setTimeout(() => setShareFeedback(''), 2000);
    });
  };


  if (bookingStatus === 'booked') {
    const confirmationMessage = user
        ? t.booking_confirmed_message.replace('{email}', user.email)
        : 'A confirmation email with all your tickets and vouchers has been sent.';

    return (
      <div className="p-8 md:p-12 text-center bg-teal-50">
        <CheckCircleIcon className="w-16 h-16 text-brand-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-brand-dark mb-2">{t.booking_confirmed_title}</h2>
        <p className="text-gray-600 text-lg mb-6">{t.booking_confirmed_subtitle.replace('{destination}', plan.tripTitle.split(' in ').pop() ?? '')}</p>
        <p className="bg-green-100 text-green-800 p-4 rounded-lg mb-8">{confirmationMessage}</p>
        <button
          onClick={onReset}
          className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none"
        >
          {t.booking_confirmed_button}
        </button>
      </div>
    );
  }

  return (
    <div>
       <div className="p-8 md:p-12 bg-gray-50 border-b border-gray-200">
         <button onClick={onReset} className="inline-flex items-center text-sm font-medium text-brand-secondary hover:text-brand-dark mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {t.itinerary_back_button}
         </button>
        <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">{plan.tripTitle}</h2>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-gray-600">
          <div className="flex items-center gap-x-6">
            <div className="flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-brand-primary" />
              <span>{t.itinerary_days_adventure.replace('{days}', plan.dailyPlans.length.toString())}</span>
            </div>
            <div className="flex items-center font-semibold">
              <CreditCardIcon className="w-5 h-5 mr-2 text-brand-primary" />
              <span>{t.itinerary_total_cost}: <span className="text-brand-dark">₹{plan.totalEstimatedCost.toFixed(2)}</span></span>
            </div>
          </div>
          <div className="relative">
             <button onClick={handleShare} className="flex items-center text-sm font-medium text-brand-secondary hover:text-brand-dark transition-colors">
                <ShareIcon className="w-4 h-4 mr-2" />
                {t.share_itinerary}
             </button>
             {shareFeedback && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2">
                    {shareFeedback}
                </span>
             )}
          </div>
        </div>
      </div>
      
      <div className="p-8 md:p-12 space-y-10">

        {/* Accommodation & Transport Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-xl font-bold text-brand-secondary mb-4 flex items-center">
                    <BuildingIcon className="w-6 h-6 mr-3"/>
                    {t.itinerary_accommodation_title}
                </h3>
                <div className="space-y-4">
                    {plan.accommodation.map((hotel, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-gray-800">{hotel.name}</h4>
                                <span className="text-sm font-semibold text-brand-dark whitespace-nowrap">~₹{hotel.estimatedCostPerNight}{t.itinerary_accommodation_cost_per_night}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{hotel.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                 <h3 className="text-xl font-bold text-brand-secondary mb-4 flex items-center">
                    <CarIcon className="w-6 h-6 mr-3"/>
                    {t.itinerary_transport_title}
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                     <p className="text-gray-700">{plan.transportation.recommendation}</p>
                </div>
            </div>
        </div>


        {/* Daily Plans Section */}
        {plan.dailyPlans.map((day) => (
          <div key={day.day} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-brand-secondary">{t.itinerary_day_title.replace('{day}', day.day.toString())}: {day.title}</h3>
              <p className="text-sm font-semibold text-gray-500">{t.itinerary_daily_cost}: ~₹{day.dailyCost.toFixed(2)}</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {day.activities.map((activity, index) => (
                <li key={index} className="p-4 flex flex-col sm:flex-row gap-4">
                  <div className="font-bold text-brand-primary w-28 flex-shrink-0">{activity.time}</div>
                  <div className="flex-grow">
                     <p className="font-semibold text-gray-800">{activity.description}</p>
                     <div className="text-sm text-gray-500 mt-1 flex flex-wrap items-center gap-x-4">
                        <span className="font-medium text-gray-600">{t.itinerary_activity_cost}: ₹{activity.estimatedCost.toFixed(2)}</span>
                        {activity.bookingNeeded && (
                            <span className="flex items-center text-amber-600">
                                <TicketIcon className="w-4 h-4 mr-1" />
                                {t.itinerary_booking_needed}
                            </span>
                        )}
                     </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="p-8 md:p-12 bg-gray-50 border-t border-gray-200 text-center">
        <h3 className="text-2xl font-bold text-brand-dark">{t.itinerary_cta_title}</h3>
        <p className="text-gray-600 mt-2 mb-6">{t.itinerary_cta_subtitle}</p>
        <button
          onClick={onStartBooking}
          className="inline-flex items-center justify-center px-12 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
        >
          <BriefcaseIcon className="w-6 h-6 mr-3" />
          {t.itinerary_book_button} (₹{plan.totalEstimatedCost.toFixed(2)})
        </button>
      </div>
    </div>
  );
};

export default ItineraryDisplay;