import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface AudioPlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  playAlbum: (songs: Song[], index?: number) => void;
  inititializeQueue: (songs: Song[]) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
}

export const useAudioPlayerStore = create<AudioPlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  inititializeQueue: (songs) => {
    set({
      queue: songs,
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
      currentSong: get().currentSong || songs[0],
    });
  },
  playAlbum: (songs, index = 0) => {
    if (songs.length === 0) return;

    const song = songs[index];

    //* get socket from chatStore
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    set({
      queue: songs,
      currentIndex: index,
      currentSong: song,
      isPlaying: true,
    });
  },
  setCurrentSong: (song) => {
    if (!song) return;

    //* get socket from chatStore
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    const songIdx = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      currentIndex: songIdx !== -1 ? songIdx : get().currentIndex,
      isPlaying: true,
    });
  },
  togglePlay: () => {
    const isPlaying = get().isPlaying;

    const currentSong = get().currentSong;
    //* get socket from chatStore
    const socket = useChatStore.getState().socket;

    set({ isPlaying: !isPlaying });
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity:
          !isPlaying && currentSong
            ? `Playing ${currentSong.title} by ${currentSong.artist}`
            : "Idle",
      });
    }
  },
  playNext: () => {
    const { queue, currentIndex } = get();
    //* get socket from chatStore
    const socket = useChatStore.getState().socket;
    const nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: "Idle",
        });
      }
      set({ isPlaying: false });
      return;
    }
    const nextSong = queue[nextIndex];

    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
      });
    }
    set({ currentSong: nextSong, currentIndex: nextIndex, isPlaying: true });
  },
  playPrev: () => {
    const { queue, currentIndex } = get();
    //* get socket from chatStore
    const socket = useChatStore.getState().socket;
    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) {

      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Idle`,
        });
      }
      set({ isPlaying: false });
      return;
    }

    const prevSong = queue[prevIndex];
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
      });
    }
    set({ currentSong: prevSong, currentIndex: prevIndex, isPlaying: true });
  },
}));
