import express from 'express';
import path from 'path';
import connectDB from './lib/db.js';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { ENV } from './lib/env.js';

const app = express();

const PORT = ENV.PORT || 3000;

const __dirname = path.resolve();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// make ready for deployment
if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get(/.*/, (_, res) => {
    res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log('Server running on port:', PORT);
  connectDB();
});
