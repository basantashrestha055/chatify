import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get('/auth/check');
      set({ authUser: response.data });
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
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
    }
  },
}));
