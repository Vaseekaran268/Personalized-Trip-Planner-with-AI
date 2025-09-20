export type Language = 'en' | 'hi' | 'ta' | 'te' | 'ml';

export interface User {
  name: string;
  email: string;
}

export interface TripPreferences {
  destination: string;
  duration: number;
  budget: number;
  interests: string[];
  language: Language;
}

export interface Activity {
  time: string;
  description: string;
  estimatedCost: number;
  bookingNeeded: boolean;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: Activity[];
  dailyCost: number;
}

export interface AccommodationSuggestion {
  name: string;
  description: string;
  estimatedCostPerNight: number;
}

export interface TransportationSuggestion {
    recommendation: string;
}

export interface ItineraryPlan {
  tripTitle: string;
  totalEstimatedCost: number;
  accommodation: AccommodationSuggestion[];
  transportation: TransportationSuggestion;
  dailyPlans: ItineraryDay[];
}