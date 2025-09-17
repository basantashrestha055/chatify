import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { axiosInstance } from '../lib/axios';

const BASE_URL =
  import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '/';

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check');
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      console.log('Error in checkAuth', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post('/auth/signup', data);
      set({ authUser: response.data });
      toast.success('Account created successfully');
      get().connectSocket();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again later.'
      );
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post('/auth/login', data);
      set({ authUser: response.data });
      toast.success('Logged in successfully');
      get().connectSocket();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again later.'
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async (data) => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
      get().disconnectSocket();
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await axiosInstance.put('/auth/update-profile', data);
      set({ authUser: response.data });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again later.'
      );
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.connect();

    set({ socket });

    //listen for online users event
    socket.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
