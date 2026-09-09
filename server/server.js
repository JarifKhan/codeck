const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI ? process.env.MONGODB_URI.trim() : '';

// Middleware
app.use(cors());
app.use(express.json());

// Status tracker for MongoDB connection
let isDbConnected = false;

const connectWithRetry = () => {
  if (!MONGODB_URI || MONGODB_URI.trim() === '') {
    console.log('⚠️ [MongoDB Atlas] MONGODB_URI is not configured in server/.env');
    console.log('👉 To enable cloud database features, add your Atlas connection string to server/.env');
    return;
  }
  console.log('[MongoDB Atlas] Connecting to database...');
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      isDbConnected = true;
      console.log('✅ [MongoDB Atlas] Successfully connected to MongoDB Atlas!');
    })
    .catch((err) => {
      isDbConnected = false;
      console.error('❌ [MongoDB Atlas] Connection error:', err.message);
      console.log('🔄 Retrying MongoDB Atlas connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

mongoose.connection.on('connected', () => {
  isDbConnected = true;
});
mongoose.connection.on('disconnected', () => {
  isDbConnected = false;
});

// Health & Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    database: {
      connected: isDbConnected,
      status: isDbConnected ? 'connected' : MONGODB_URI ? 'connecting_or_error' : 'not_configured',
    },
  });
});

// Routes
const authRoutes = require('./routes/auth');
const deckRoutes = require('./routes/decks');

app.use('/api/auth', authRoutes);
app.use('/api/decks', deckRoutes);

// Root fallback for API
app.get('/', (req, res) => {
  res.json({
    name: 'Codeck API',
    version: '1.0.0',
    documentation: 'Code presentation and snippet management backend',
    mongoStatus: isDbConnected ? 'Connected to Atlas' : 'Disconnected / Unconfigured',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 [Codeck Server] Running on http://localhost:${PORT}`);
});

module.exports = app;
