const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/campaigns', require('./routes/campaignRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Crowdfunding Unified Server is running smoothly 🚀' });
});

// Robust multi-path resolution for frontend static files
const possiblePaths = [
  path.resolve(__dirname, '../frontend/dist'),
  path.resolve(process.cwd(), 'frontend/dist'),
  path.resolve(__dirname, 'frontend/dist')
];

let frontendDist = possiblePaths.find(p => fs.existsSync(path.join(p, 'index.html')));

if (!frontendDist) {
  frontendDist = possiblePaths[0]; // fallback
}

const indexPath = path.join(frontendDist, 'index.html');
console.log(`📁 Resolved static assets directory: ${frontendDist}`);
console.log(`📄 index.html exists: ${fs.existsSync(indexPath)}`);

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

// React SPA Fallback Route for non-API requests
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).send('Frontend assets building... Please refresh in a moment.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ message: err.message || 'Server Internal Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`⚡ Unified Full-Stack Server running on port ${PORT}`);
});
