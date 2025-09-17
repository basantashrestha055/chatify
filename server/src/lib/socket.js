import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { ENV } from '../lib/env.js';
import { socketAuthMiddleware } from '../middleware/socketAuthMiddleware.js';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true,
  },
});

//apply authentication middleware for all socket connections
io.use(socketAuthMiddleware);

//store online users
const userSocketMap = {}; //format: {userID: socketID}

//socket connection event
io.on('connection', (socket) => {
  console.log('A user connected', socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  //use io.emit to send the event to all the connected users
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.user.fullName);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { io, app, server };
