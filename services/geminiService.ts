import { GoogleGenAI, Type } from "@google/genai";
import type { TripPreferences, ItineraryPlan } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    tripTitle: {
      type: Type.STRING,
      description: "A creative and catchy title for the trip. e.g., 'Spiritual Sojourn in Varanasi'."
    },
    totalEstimatedCost: {
      type: Type.NUMBER,
      description: "The total estimated cost for all activities in the trip in INR. This cost should NOT include accommodation."
    },
    accommodation: {
        type: Type.ARRAY,
        description: "An array of 2-3 recommended hotels or guesthouses suitable for the user's budget.",
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "The name of the hotel." },
                description: { type: Type.STRING, description: "A brief, compelling description of the hotel and why it's a good fit." },
                estimatedCostPerNight: { type: Type.NUMBER, description: "The estimated cost per night in INR." }
            },
            required: ["name", "description", "estimatedCostPerNight"]
        }
    },
    transportation: {
        type: Type.OBJECT,
        description: "Recommendation for local transportation.",
        properties: {
            recommendation: { type: Type.STRING, description: "A concise recommendation for the best way to get around the destination (e.g., 'Rent a scooter to explore freely' or 'Utilize the efficient metro system')." }
        },
        required: ["recommendation"]
    },
    dailyPlans: {
      type: Type.ARRAY,
      description: "An array of daily plans for the entire duration of the trip.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: {
            type: Type.INTEGER,
            description: "The day number of the itinerary, starting from 1."
          },
          title: {
            type: Type.STRING,
            description: "A short, engaging title for the day's theme. e.g., 'Ganges Ghats & Temple Trails'."
          },
          activities: {
            type: Type.ARRAY,
            description: "An array of activities planned for the day.",
            items: {
              type: Type.OBJECT,
              properties: {
                time: {
                  type: Type.STRING,
                  description: "Suggested time for the activity. e.g., '9:00 AM' or 'Afternoon'."
                },
                description: {
                  type: Type.STRING,
                  description: "A detailed description of the activity, including location and what to expect."
                },
                estimatedCost: {
                  type: Type.NUMBER,
                  description: "Estimated cost for this specific activity in INR. Can be 0 for free activities."
                },
                bookingNeeded: {
                    type: Type.BOOLEAN,
                    description: "Indicates if prior booking is recommended for this activity."
                }
              },
              required: ["time", "description", "estimatedCost", "bookingNeeded"],
            },
          },
          dailyCost: {
            type: Type.NUMBER,
            description: "The total estimated cost for all activities of the day in INR."
          },
        },
        required: ["day", "title", "activities", "dailyCost"],
      },
    },
  },
  required: ["tripTitle", "totalEstimatedCost", "accommodation", "transportation", "dailyPlans"],
};


export const generateItinerary = async (preferences: TripPreferences): Promise<ItineraryPlan> => {
  const { destination, duration, budget, interests, language } = preferences;

  const languageMap = {
    en: 'English',
    hi: 'Hindi',
    ta: 'Tamil',
    te: 'Telugu',
    ml: 'Malayalam'
  };
  const languageName = languageMap[language];

  const prompt = `
    You are an expert travel agent specializing in personalized itineraries for destinations in India. A user wants to plan a trip. Generate a detailed, end-to-end itinerary based on the following criteria:

    - Destination: ${destination}, India
    - Trip Duration: ${duration} days
    - Total Budget for Activities: Approximately ₹${budget} INR
    - Primary Interests: ${interests.join(', ')}
    - Language for Response: ${languageName}

    Your task is to create a comprehensive and realistic travel plan. Please adhere to the following instructions:
    1.  The entire response, including all text, titles, and descriptions, MUST be in ${languageName}.
    2.  The itinerary should cover the full ${duration} days.
    3.  The \`totalEstimatedCost\` field should be the sum of daily activity costs ONLY and should be close to the user's budget of ₹${budget} INR. This cost MUST NOT include accommodation.
    4.  Suggest a mix of activities that align with the user's interests: ${interests.join(', ')}. Include famous landmarks as well as hidden gems.
    5.  For each day, provide a schedule with at least 3-4 distinct activities. Include practical details like suggested times, locations, and if any prior bookings are needed.
    6.  Provide realistic cost estimates for each activity and a total for each day in INR.
    7.  Based on the destination and budget, recommend 2-3 specific, budget-appropriate hotels or guesthouses in the \`accommodation\` section. Provide a brief description for each.
    8.  Provide a concise recommendation for the best mode of local transport in the \`transportation\` section.
    9.  Include suggestions for local transport (e.g., "Take a rickshaw", "Use the metro") and mention potential meal spots or local dishes to try where appropriate within the activity descriptions.
    10. Ensure the plan is logical and geographically sensible (i.e., activities for a given day are near each other).
    11. The overall tone should be exciting and inspiring.

    Structure your response ONLY as a valid JSON object that conforms to the provided schema. Do not include any introductory text, closing remarks, or any other content outside of the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7
      },
    });

    const jsonText = response.text.trim();
    const parsedPlan: ItineraryPlan = JSON.parse(jsonText);
    return parsedPlan;
  } catch (error) {
    console.error("Error generating itinerary with Gemini:", error);
    throw new Error("Failed to parse or generate itinerary from AI response.");
  }
};