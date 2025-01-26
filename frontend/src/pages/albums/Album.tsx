import PlaylistSkeleton from "@/components/Skeletons/PlaylistSkeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";
import { useMusicStore } from "@/store/useMusicStore.ts";
import { Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AlbumSongsTable from "./AlbumSongsTable";
const Albums = () => {
  const params = useParams();
  const { currentSong, isPlaying, togglePlay, playAlbum } =
    useAudioPlayerStore();
  const albumId = params.albumId;
  const { fetchAlbumById, currentAlbum, isAlbumLoading } = useMusicStore();
  useEffect(() => {
    if (albumId) {
      fetchAlbumById(albumId);
    }
  }, [albumId, fetchAlbumById]);

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;
    const isCurrentAlbumPlaying = currentAlbum?.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentAlbumPlaying) togglePlay();
    else {
      //* start playing album from the beginnig
      playAlbum(currentAlbum?.songs, 0);
    }
  };

  if (isAlbumLoading) {
    return <PlaylistSkeleton />;
  }
  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="relstive min-h-full">
          <div
            className="absolute inset-0 bg-gradient-to-b from-blue-800/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            aria-hidden={true}
          />
          {/* content */}
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <img
                src={currentAlbum?.imageUrl}
                alt={currentAlbum?.title}
                className="w-[240px] h-[240px] rounded shadow-xl"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Abum</p>
                <h1 className="text-5xl font-bold my-4">
                  {currentAlbum?.title}
                </h1>
                <div className="flex gap-2 text-sm text-zinc-100 items-center">
                  <span className="font-medium text-white">
                    {currentAlbum?.artist}
                  </span>
                  <span className="text-zinc-300">
                    • {currentAlbum?.songs.length}
                  </span>
                  <span className="text-zinc-300">Songs</span>
                  {currentAlbum?.releaseYear && (
                    <span className="text-zinc-300">
                      • {currentAlbum?.releaseYear}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 pb-4 flex items-center gap-6">
              <Button
                size={"icon"}
                onClick={handlePlayAlbum}
                className="w-14 h-14 rounded-full bg-blue-500/90 hover:bg-blue-500 hover:scale-105 transition-all"
              >
                {isPlaying &&
                currentAlbum?.songs.some(
                  (song) => song._id === currentSong?._id
                ) ? (
                  <Pause className="w-7 h-7 text-white fill-white" />
                ) : (
                  <Play className="w-7 h-7 text-white fill-white" />
                )}
              </Button>
            </div>
            <div className="bg-black/20 backdrop-blur-sm">
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 pl-5 pr-2 py-2 text-sm 
            text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="">
                <div className="space-y-2 py-4">
                  <AlbumSongsTable/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Albums;
