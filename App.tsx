import React, { useState, useEffect } from 'react';
import TripForm from './components/TripForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './components/Login';
import PaymentModal from './components/PaymentModal';
import { TripPreferences, ItineraryPlan, User } from './types';
import { generateItinerary } from './services/geminiService';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTranslations } from './hooks/useTranslations';

const AppContent: React.FC = () => {
  const [itinerary, setItinerary] = useState<ItineraryPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booked' | 'failed'>('idle');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { language } = useLanguage();
  const { user } = useAuth();
  const t = useTranslations();

  useEffect(() => {
    // Check for a shared itinerary in the URL on initial load
    const params = new URLSearchParams(window.location.search);
    const sharedItineraryData = params.get('itinerary');
    if (sharedItineraryData) {
      try {
        const decodedString = atob(sharedItineraryData);
        const plan = JSON.parse(decodedString);
        setItinerary(plan);
      } catch (e) {
        console.error("Failed to parse shared itinerary", e);
        setError("Could not load the shared itinerary. The link may be corrupted.");
      }
    }
  }, []);


  const handleGenerateItinerary = async (preferences: Omit<TripPreferences, 'language'>) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    setBookingStatus('idle');

    // Clear URL params when generating a new itinerary
    if (window.history.pushState && window.location.protocol.startsWith('http')) {
        const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    try {
      const fullPreferences: TripPreferences = { ...preferences, language };
      const generatedPlan = await generateItinerary(fullPreferences);
      setItinerary(generatedPlan);
    } catch (err) {
      console.error(err);
      setError(t.error_generateItinerary);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setItinerary(null);
    setError(null);
    setIsLoading(false);
    setBookingStatus('idle');
    setIsPaymentModalOpen(false);
     // Clear URL params on reset
    if (window.history.pushState && window.location.protocol.startsWith('http')) {
        const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }
  }

  const handleConfirmPayment = () => {
    // This is a simulation of a booking and payment process.
    setIsPaymentModalOpen(false);
    setBookingStatus('booked');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-light font-sans flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
          <Login />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-light font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {itinerary ? (
            <ItineraryDisplay 
              plan={itinerary} 
              user={user}
              onStartBooking={() => setIsPaymentModalOpen(true)} 
              bookingStatus={bookingStatus}
              onReset={handleReset}
            />
          ) : (
            <>
              <div className="p-8 md:p-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">{t.home_title}</h1>
                <p className="text-gray-600 text-lg">{t.home_subtitle}</p>
              </div>
              <div className="p-8 md:p-12 bg-gray-50 border-t border-gray-200">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <TripForm onGenerate={handleGenerateItinerary} />
                )}
                {error && <p className="mt-6 text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      {itinerary && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirm={handleConfirmPayment}
          plan={itinerary}
        />
      )}
    </div>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;