import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: null | any;
  socket: any;
  isConnected: boolean;
  messageLoading: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];
  selectedUser: User | null;
  fetchUsers: () => Promise<void>;
  initializeSocket: (userId: string) => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  disconnectSocket: () => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User) => void;
}

const baseUrl = "http://localhost:9000";
const socket = io(baseUrl, {
  autoConnect: false, //* only connect if user is authenticated
  withCredentials: true, //* send cookies along with the request
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: socket,
  isConnected: false,
  messageLoading: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("users");
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },
  initializeSocket: (userId) => {
    if (!get().isConnected) {
      
      socket.auth = { userId };
      socket.connect();
      socket.emit("user_connected", userId);

      socket.on("users_online", (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      });

      socket.on("activities", (activities: [string, string][]) => {
        set({ userActivities: new Map(activities) });
      });

      socket.on("user_connected", (userId: string) => {
        set({ onlineUsers: new Set([...get().onlineUsers, userId]) });
      });

      socket.on("user_disconnectd", (userId: string) => {
        const onlineUsers = new Set(get().onlineUsers);
        onlineUsers.delete(userId);
        set({ onlineUsers });
      });

      socket.on("new_message", (message: Message) => {
        set({ messages: [...get().messages, message] });
      });

      socket.on("message_sent", (message: Message) => {
        set({ messages: [...get().messages, message] });
      });

      socket.on("activity_updated", ({ userId, activity }) => {
        set({
          userActivities: new Map([
            ...get().userActivities,
            [userId, activity],
          ]),
        });
      });

      set({ isConnected: true });
    }
  },
  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },
  sendMessage: (receiverId, senderId, content) => {
    const socket = get().socket;
    if (!socket) return;
    socket.emit("send_message", { receiverId, senderId, content });
  },
  fetchMessages: async (userId: string) => {
    set({ messageLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/messages/${userId}`);
      set({ messages: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
      console.error(error);
    } finally {
      set({ messageLoading: false });
    }
  },
  setSelectedUser: (user: User) => {
    set({ selectedUser: user });
  },
}));
