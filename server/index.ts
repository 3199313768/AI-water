import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import waterLogsRouter from './routes/waterLogs';
import userSettingsRouter from './routes/userSettings';
import adviceRouter from './routes/advice';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/water-logs', waterLogsRouter);
app.use('/api/user-settings', userSettingsRouter);
app.use('/api/advice', adviceRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'HydraFlow API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
