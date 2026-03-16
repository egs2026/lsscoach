import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import charterRoutes from './routes/charter.js';
import coachRoutes from './routes/coach.js';
import artifactRoutes from './routes/artifact.js';
import phaseGateRoutes from './routes/phaseGate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', charterRoutes);
app.use('/api', coachRoutes);
app.use('/api', artifactRoutes);
app.use('/api', phaseGateRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// In production, serve the Vite build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`LSS Coach server running on port ${PORT}`));
