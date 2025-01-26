import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import { create } from "zustand";
import  toast  from "react-hot-toast";

interface MusicStoreInterface {
  //* datas
  albums: Album[];
  songs: Song[];
  currentAlbum: Album | null;
  madeForYouSongs: Song[];
  featuredSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;
  //* loading states
  isLoading: boolean;
  isAlbumLoading: boolean;
  isFeaturedLoading: boolean;
  isMadeForYouLoading: boolean;
  isTrendingLoading: boolean;
  isStatsLoading: boolean;
  isSongsLoading: boolean;
  //* errors
  error: string | null;
  featuredError: null | string;
  madeForYouError: null | string;
  trendingError: null | string;
  statsError: null | string;
  songsError: null | string;
  //* actions
  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (albumId: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (songId: string) => Promise<void>;
  deleteAlbum: (albumId: string) => Promise<void>;
}

export const useMusicStore = create<MusicStoreInterface>((set) => ({
  albums: [],
  songs: [],
  featuredSongs: [],
  madeForYouSongs: [],
  trendingSongs: [],
  stats: {
    totalAlbums: 0,
    totalArtists: 0,
    totalSongs: 0,
    totalUsers: 0,
  },
  isLoading: false,
  isSongsLoading: false,
  isStatsLoading: false,
  isAlbumLoading: false,
  error: null,
  currentAlbum: null,
  featuredError: null,
  madeForYouError: null,
  statsError: null,
  songsError: null,
  trendingError: null,
  isFeaturedLoading: false,
  isMadeForYouLoading: false,
  isTrendingLoading: false,
  fetchAlbums: async () => {
    set({
      isLoading: true,
      error: null,
    });
    //* fetch data logic
    try {
      const response = await axiosInstance.get("/albums");
      set({ albums: response.data });
    } catch (error: any) {
      set({ error: error?.response?.data?.message });
    }
    set({ isLoading: false });
  },
  fetchAlbumById: async (albumId: string) => {
    set({
      isAlbumLoading: true,
      error: null,
    });
    try {
      const response = await axiosInstance.get(`/albums/${albumId}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isAlbumLoading: false });
    }
  },
  fetchFeaturedSongs: async () => {
    set({ isFeaturedLoading: true, featuredError: null });
    try {
      const res = await axiosInstance.get("/songs/featured");
      set({ featuredSongs: res.data });
    } catch (error: any) {
      set({ featuredError: error.response.data.message });
    } finally {
      set({ isFeaturedLoading: false });
    }
  },
  fetchMadeForYouSongs: async () => {
    set({ isMadeForYouLoading: true, madeForYouError: null });
    try {
      const res = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYouSongs: res.data });
    } catch (error: any) {
      set({ madeForYouError: error.response.data.message });
    } finally {
      set({ isMadeForYouLoading: false });
    }
  },
  fetchTrendingSongs: async () => {
    set({ isTrendingLoading: true, trendingError: null });
    try {
      const res = await axiosInstance.get("/songs/trending");
      set({ trendingSongs: res.data });
    } catch (error: any) {
      set({ trendingError: error.response.data.message });
    } finally {
      set({ isTrendingLoading: false });
    }
  },
  fetchSongs: async () => {
    set({songsError: null, isSongsLoading: true});
    try {
      const res = await axiosInstance.get('/songs');
      set({ songs: res.data });
      
    } catch (error:any) {
      set({ songsError: error.message });
    } finally {
      set({ isSongsLoading: false });
    }
   },
  fetchStats: async () => {
    set({ isStatsLoading: true, statsError: null });
    try {
      const res = await axiosInstance.get("/stats");
      set({ stats: res.data });
    } catch (error:any) {
      set({ statsError: error.message });
    }
    finally {
      set({ isStatsLoading: false });
    }
  },
  deleteSong: async (songId: string) => {
    try {
      await axiosInstance.delete(`/admin/songs/${songId}`);
      set((state) => ({
        songs: state.songs.filter((song) => song._id !== songId),
      }));
      toast.success("Song deleted successfully");
    } catch (error: any) {
      toast.error("error deleting song");
      console.error(error);
    }
  },
  deleteAlbum: async (albumId: string) => {
    try {
      await axiosInstance.delete(`/admin/albums/${albumId}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== albumId),
        songs: state.songs.map(song => song.albumId === state.albums.find(a => a._id === albumId)?._id ? {...song, albumId: null} : song),
      }));
      toast.success("Album deleted successfully");
    } catch (error: any) {
      toast.error("error deleting album");
      console.error(error);
    }
  },
}));
