import express from 'express';
import 'dotenv/config';

import authRoutes from './routes/auth.js';
import messageRoutes from './routes/message.js';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.listen(PORT, () => console.log('Server running on port:', PORT));
