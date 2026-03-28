import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './server/routes/auth.js';
import patientRoutes from './server/routes/patients.js';
import sensorRoutes from './server/routes/sensor.js';
import alertRoutes from './server/routes/alerts.js';
import aiRoutes from './server/routes/ai.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Create HTTP server
  const httpServer = createServer(app);

  // Setup Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Make io accessible to routes
  app.set('io', io);

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_iot';
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }

  // Socket.io connection
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_patient_room', (patientId) => {
      socket.join(`patient_${patientId}`);
      console.log(`Socket ${socket.id} joined room patient_${patientId}`);
    });

    socket.on('join_doctor_room', () => {
      socket.join('doctors');
      console.log(`Socket ${socket.id} joined room doctors`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/patients', patientRoutes);
  app.use('/api/sensor-data', sensorRoutes);
  app.use('/api/alerts', alertRoutes);
  app.use('/api/ai', aiRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
