import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import audioRoutes from './routes/audio.routes.js';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration
app.use(cors({ 
  origin: '*', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use(express.json());

// Helper to add CORS headers for static files
function withCors(handler) {
  return (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    handler(req, res, next);
  };
}

// static file serving with CORS headers (new directories)
app.use('/uploads/images', withCors(express.static(path.join(__dirname, 'uploads/images'), { fallthrough: true })));
// Also serve from legacy singular directory if present
app.use('/uploads/images', withCors(express.static(path.join(__dirname, 'uploads/image'), { fallthrough: true })));
app.use('/uploads/audio', withCors(express.static(path.join(__dirname, 'uploads/audio'), { fallthrough: true })));

// Fallback static serving for legacy directories created by old config
app.use('/uploads/images', withCors(express.static(path.join(__dirname, 'backend/uploads/images'))));
app.use('/uploads/audio', withCors(express.static(path.join(__dirname, 'backend/uploads/audio'))));

app.get('/', (_, res) => res.send('MEAN Audio API up ✅'));

app.use('/api/auth', authRoutes);
app.use('/api/audio', audioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}`));
