import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import walletRoutes from './routes/wallet.js';
import beneficiaryRoutes from './routes/beneficiaries.js';
import userRoutes from './routes/users.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'finflow-api', time: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use(notFound);
app.use(errorHandler);

connectDB().then(() => app.listen(port, () => console.log(`FinFlow API running on http://localhost:${port}`))).catch((error) => {
  console.error('Failed to start:', error.message);
  process.exit(1);
});
