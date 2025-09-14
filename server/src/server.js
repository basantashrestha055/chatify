import express from 'express';
import path from 'path';
import 'dotenv/config';

import authRoutes from './routes/auth.js';
import messageRoutes from './routes/message.js';

const app = express();

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// make ready for deployment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get(/.*/, (_, res) => {
    res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => console.log('Server running on port:', PORT));
