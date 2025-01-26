import { axiosInstance } from '@/lib/axios';
import { create } from 'zustand';

interface AuthStore {
    error: string | null;
    isLoading: boolean;
    isAdmin: boolean;
    checkAdmin: () => Promise<void>;
    reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    error: null,
    isLoading: false,
    isAdmin: false,
    checkAdmin: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axiosInstance.get('admin/check');
            set({ isAdmin: res.data.admin });
        }
        catch (error: any) {
            console.error(error);
            set({ isAdmin: false, error: error.resposnse.data.message });
        }
        finally {
            set({ isLoading: false });
        }
    },
    reset: () => set({ error: null, isLoading: false, isAdmin: false }),
}));
    