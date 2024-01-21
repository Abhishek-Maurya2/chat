import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    login: (user) => set({ user }),
    logout: () => set({ user: null }),
   
}));

export default useAuthStore;