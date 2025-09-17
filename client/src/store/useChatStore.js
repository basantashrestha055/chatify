import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: 'chats',
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem('isSoundEnabled') === 'true'),

  toggleSound: () => {
    localStorage.setItem('isSoundEnabled', !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get('/messages/contacts');
      set({ allContacts: response.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again later.'
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get('/messages/chats');
      set({ chats: response.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again later.'
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again later.'
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    const { authUser } = useAuthStore.getState();

    //optimistic message
    const temp = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: temp,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] }); //immediately show optimistic message on ui

    try {
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({ messages: messages.concat(response.data) });
    } catch (error) {
      set({ messages: messages }); //remove optimistic message on failure
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again later.'
      );
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on('newMessage', (newMessage) => {
      if (isSoundEnabled) {
        const notificationSound = new Audio('/sounds/notification.mp3');

        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((error) => console.log('Audio play error', error));
      }

      if (newMessage.senderId !== selectedUser._id) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off('newMessage');
  },
}));
