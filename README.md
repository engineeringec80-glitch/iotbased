# IoT Healthcare Monitoring System

A full-stack web application for an IoT-based healthcare monitoring system. It allows multiple patients to send real-time health data from NodeMCU (ESP8266) devices (heart rate, SpO2, body temperature) to the website.

## Features

- **User Roles:** Doctor (Admin) and Patient.
- **Real-Time Data:** WebSockets (Socket.io) for live updates.
- **Dashboards:** Dedicated dashboards for doctors and patients.
- **Data Storage:** MongoDB for storing users, patients, readings, and alerts.
- **REST APIs:** Endpoints for NodeMCU devices to send data.
- **Data Visualization:** Recharts for interactive graphs.
- **Alerts System:** Automatic alerts for abnormal vitals.
- **AI Health Insight:** Powered by Google Gemini to analyze patient vitals.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Socket.io
- **Frontend:** React, Vite, Tailwind CSS, Recharts
- **AI:** Google Gemini API (`@google/genai`)

## Project Structure

This project uses a unified full-stack architecture optimized for deployment:
- `server.ts`: The main entry point for the Express backend.
- `server/`: Contains backend models, routes, and middleware.
- `src/`: Contains the React frontend code.

## Running Locally

1. **Prerequisites:** Node.js and MongoDB installed.
2. **Environment Variables:** Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/healthcare_iot
   JWT_SECRET=your_super_secret_jwt_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```
4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   This will start both the Express backend and Vite frontend on `http://localhost:3000`.

## NodeMCU (ESP8266) Integration

To send data from your NodeMCU, make a POST request to the API:

**Endpoint:** `POST /api/sensor-data`
**Content-Type:** `application/json`

**Example Payload:**
```json
{
  "patientId": "PATIENT_123",
  "heartRate": 75,
  "spo2": 98,
  "temperature": 36.5,
  "timestamp": "2023-10-27T10:00:00Z"
}
```

## Deployment

### Backend (Render / Heroku)
1. Set the build command to `npm run build`.
2. Set the start command to `npm start` (which runs `node dist/server.cjs`).
3. Add the environment variables (`MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`).

### Frontend (Vercel / Netlify)
If you want to deploy the frontend separately:
1. Set the build command to `npm run build`.
2. Set the output directory to `dist`.
3. Ensure you configure API proxying or CORS to point to your deployed backend URL.
