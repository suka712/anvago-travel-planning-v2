import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { setupPassport } from './config/passport.js';
import routes from './routes/index.js';

const app: Express = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use(requestLogger);

// Passport setup
setupPassport();

// API routes
app.use('/api/v1', routes);

// Health check
app.get('/health', (_, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    name: 'Anvago API'
  });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║   🌏 ANVAGO API SERVER                        ║
  ║   Travel the world your way                   ║
  ║                                               ║
  ║   🚀 Server running on port ${PORT}              ║
  ║   📍 http://localhost:${PORT}                    ║
  ║   🔗 Client: ${CLIENT_URL}              ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
  `);
});

export default app;

