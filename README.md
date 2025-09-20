
# AI Trip Planner

An AI-powered personalized trip planner that dynamically creates end-to-end itineraries tailored to individual budgets, interests, and real-time conditions with seamless booking capabilities. This application uses the Google Gemini API to generate rich, detailed travel plans for destinations across India.

## ✨ Features

-   **🤖 AI-Powered Itinerary Generation**: Leverages the Google Gemini API to create detailed, day-by-day travel plans from a simple user prompt.
-   **🎨 Personalized Planning**: Tailors itineraries based on destination, trip duration, budget, and a wide range of interests (e.g., culture, adventure, food).
-   **🌐 Multilingual Interface**: Fully supports English, Hindi, Tamil, Telugu, and Malayalam, including AI-generated content in the selected language.
-   **🏨 Accommodation & Transport Suggestions**: Recommends budget-appropriate hotels and the best local transportation methods based on the destination.
-   **✏️ Smart Adjustments**: Request real-time modifications to your itinerary (e.g., "suggest indoor activities due to rain") and get an updated plan from the AI.
-   **🔗 Shareable Itinerary**: Generate a unique link for any itinerary to easily share and coordinate plans with others.
-   **👤 User Authentication**: A complete, simulated login/logout flow to provide a personalized user experience.
-   **💳 Simulated Booking & Payment**: A realistic booking flow, including a payment modal, that concludes with a personalized confirmation message.
-   **📱 Responsive Design**: A clean, mobile-first interface built with Tailwind CSS that works beautifully on all screen sizes.

## 🛠️ Tech Stack

This project is built with a modern, frontend-focused technology stack:

-   **Framework**: [React 19](https://react.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **AI Integration**: [Google Gemini API via `@google/genai`](https://ai.google.dev/docs)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **State Management**: React Context API for global state (Theme, Authentication).
-   **Module Loading**: ES Modules with Import Maps for dependency management directly in the browser.

## 🚀 Getting Started

To run this project locally, you will need to have [Node.js](https://nodejs.org/) installed.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    This project uses a modern setup with import maps and does not require a traditional `npm install` for its dependencies. You'll need a simple local server to serve the files. The `serve` package is a great option.
    ```bash
    npm install -g serve
    ```

3.  **Set up Environment Variables:**
    The application requires a Google Gemini API key.
    -   Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    -   In a real project, this key would be managed by a backend. For this frontend-only prototype, it is expected to be available as an environment variable (`process.env.API_KEY`) in the execution environment where the app is hosted.

4.  **Run the application:**
    ```bash
    serve .
    ```
    This will start a local server, and you can access the application at `http://localhost:3000`.

## 🔌 How to Connect a Backend (for Email & Database)

The current application is a frontend prototype. The login is simulated, and the "booking confirmation" message doesn't send a real email. To make these features fully functional, you need to connect a backend service.

Here is a high-level guide to do that using a Node.js and Express backend.

### Why a Backend is Needed:

1.  **Security**: To protect your Google Gemini API Key. It should **never** be exposed directly in frontend code in a production application.
2.  **Persistent Data**: To store user accounts, saved itineraries, and booking information in a database (like MongoDB, PostgreSQL, or Firebase Firestore).
3.  **Server-Side Logic**: To handle tasks that can't be done in the browser, such as sending emails or processing payments.

### Step-by-Step Backend Integration Guide:

**Step 1: Set up a simple Node.js/Express Server**

Create a new directory for your backend, initialize a Node.js project, and install Express. Your backend will serve as an API that your React frontend can communicate with.

**Step 2: Create API Endpoints**

You would create several API routes:

-   `/api/generate-itinerary`: The frontend would send trip preferences to this endpoint. The backend would then securely call the Gemini API with your secret API key and return the result to the frontend.
-   `/api/auth/register` & `/api/auth/login`: To handle user sign-up and login, storing user data in a database and returning authentication tokens (e.g., JWT).
-   `/api/booking/confirm`: This is the key endpoint for sending emails.

**Step 3: Implement Email Sending**

Inside the `/api/booking/confirm` endpoint, you would use an email sending library like **Nodemailer**.

Here is a code example of what that endpoint might look like:

```javascript
// In your backend server file (e.g., server.js)
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

app.post('/api/booking/confirm', async (req, res) => {
  const { user, plan } = req.body; // Get user and itinerary details from the request

  if (!user || !plan) {
    return res.status(400).json({ message: 'Missing user or plan data' });
  }

  // 1. Configure your email service transporter
  // (Use environment variables for your email credentials!)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Example: Gmail. Use SendGrid or Mailgun in production.
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Define the email content
  const mailOptions = {
    from: '"AI Trip Planner" <no-reply@yourdomain.com>',
    to: user.email,
    subject: `Your Trip to ${plan.tripTitle} is Confirmed!`,
    html: `
      <h1>Booking Confirmation</h1>
      <p>Hi ${user.name},</p>
      <p>Your dream trip is booked! Get ready for an adventure. Here is a summary of your itinerary:</p>
      <!-- You can format the 'plan' object into a nice HTML table or list here -->
      <p>Thank you for booking with us!</p>
    `,
  };

  // 3. Send the email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Confirmation email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send confirmation email.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**Step 4: Update the Frontend `onBook` Function**

Finally, modify the `onBook` function in your React component (`ItineraryDisplay.tsx`) to call this new backend endpoint instead of just setting local state.

```typescript
// In ItineraryDisplay.tsx or App.tsx

const handleBooking = async () => {
  try {
    // Show a loading state here
    const response = await fetch('/api/booking/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user, plan }),
    });

    if (!response.ok) {
      throw new Error('Booking failed');
    }

    // The email has been sent by the backend! Now show the confirmation screen.
    setBookingStatus('booked');

  } catch (error) {
    console.error("Booking failed:", error);
    setBookingStatus('failed');
  }
};
```