import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.js';
import User from '../models/User.js';

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split('; ')
      ?.find((row) => row.startsWith('jwt='))
      ?.split('=')[1];

    if (!token) {
      console.log('Unauthorized - Socket connection rejected');
      return next(new Error('Unauthorized - No token found'));
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log('Unauthorized - Socket connection rejected');
      return next(new Error('Unauthorized - Invalid token'));
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      console.log('Unauthorized - Socket connection rejected');
      return next(new Error('Unauthorized - User not found'));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    console.log(
      `Socket authenticated for user: ${user.fullName} (${user._id})`
    );

    next();
  } catch (error) {
    console.log('Error in socketAuthMiddleware middleware', error);
    return next(new Error('Unauthorized - Socket connection rejected'));
  }
};
