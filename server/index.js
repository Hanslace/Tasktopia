import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import routes
import authRoutes from './routes/user.auth.route.js';
import projectRoutes from './routes/project.route.js';
import taskRoutes from './routes/task.route.js';
import timelogRoutes from './routes/timelog.route.js';
import activitylogRoutes from './routes/activitylog.route.js';
import invoiceRoutes from './routes/invoice.route.js';
import messageRoutes from './routes/message.route.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for development; restrict in production
    methods: ['GET', 'POST'],
  },
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/timelogs', timelogRoutes);
app.use('/api/activitylogs', activitylogRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/messages', messageRoutes);

// Set up Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('New client connected');

  // Join a conversation room
  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`Client joined conversation: ${conversationId}`);
  });

  // Relay messages to the correct conversation room
  socket.on('sendMessage', (message) => {
    const { conversationId } = message;
    io.to(conversationId).emit('receiveMessage', message);
    console.log(`Message sent to conversation ${conversationId}:`, message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make Socket.IO instance available to routes via `app`
app.set('socketio', io);

const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
