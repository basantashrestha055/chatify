import mongoose from 'mongoose';
import { ENV } from './env.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log('MongoDB connected', conn.connection.host);
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};

export default connectDB;
