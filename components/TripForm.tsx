
import React, { useState } from 'react';
import type { TripPreferences } from '../types';
import { INTEREST_OPTIONS } from '../constants';
import { CalendarIcon, MapPinIcon, RupeeIcon, SparklesIcon, WandSparklesIcon } from './IconComponents';
import { useTranslations } from '../hooks/useTranslations';

interface TripFormProps {
  onGenerate: (preferences: Omit<TripPreferences, 'language'>) => void;
}

const TripForm: React.FC<TripFormProps> = ({ onGenerate }) => {
  const [destination, setDestination] = useState<string>('');
  const [duration, setDuration] = useState<number>(5);
  const [budget, setBudget] = useState<string>('5000');
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState('');
  const t = useTranslations();

  const handleInterestChange = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetValue = parseFloat(budget);

    if (!destination.trim() || interests.length === 0) {
      setError(t.form_error);
      return;
    }
    if (isNaN(budgetValue) || budgetValue < 500) {
      setError(t.form_budget_error_min);
      return;
    }

    setError('');
    onGenerate({ destination, duration, budget: budgetValue, interests });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Destination */}
        <div className="md:col-span-3">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">{t.form_destination_label}</label>
          <div className="relative">
            <MapPinIcon className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={t.form_destination_placeholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">{t.form_duration_label}</label>
          <div className="relative">
             <CalendarIcon className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
             <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value, 10) || 1))}
              min="1"
              max="30"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Budget */}
        <div className='md:col-span-2'>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">{t.form_budget_label}</label>
          <div className="relative">
            <RupeeIcon className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-3 h-5 w-5 text-gray-400" />
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={t.form_budget_placeholder}
              min="500"
              step="100"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t.form_interests_label}</label>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {INTEREST_OPTIONS.map(interest => (
            <button
              type="button"
              key={interest}
              onClick={() => handleInterestChange(interest)}
              className={`px-4 py-2 text-sm text-left font-medium rounded-lg border-2 transition-all duration-200 flex items-center ${
                interests.includes(interest)
                  ? 'bg-brand-primary border-brand-primary text-white shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-brand-secondary'
              }`}
            >
              <SparklesIcon className={`w-4 h-4 mr-2 ${interests.includes(interest) ? 'text-white' : 'text-brand-primary'}`} />
              {t.interests[interest as keyof typeof t.interests]}
            </button>
          ))}
        </div>
      </div>
      
      {error && <p className="text-red-600 text-sm text-center pt-2">{error}</p>}

      <div className="text-center pt-4">
        <button
          type="submit"
          className="w-full md:w-auto inline-flex items-center justify-center px-12 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-transform transform hover:scale-105"
        >
          <WandSparklesIcon className="w-6 h-6 mr-3" />
          {t.form_submit_button}
        </button>
      </div>
    </form>
  );
};

export default TripForm;
