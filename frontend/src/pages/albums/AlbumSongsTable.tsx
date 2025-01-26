import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";
import { useMusicStore } from "@/store/useMusicStore";
import { formatDuration } from "@/utils";
import { Play } from "lucide-react";

const AlbumSongsTable = () => {
  const { currentAlbum } = useMusicStore();
  const { playAlbum, isPlaying, currentSong } = useAudioPlayerStore();

  const handlePlaySong = (index: number) => {
    if (!currentAlbum) return;
    playAlbum(currentAlbum?.songs, index);
  };
  return (
    <>
      {currentAlbum?.songs.map((song, index) => {
        const isCurrentSong = currentSong?._id === song._id;
        return (
          <div
            key={song._id}
            onClick={() => handlePlaySong(index)}
            className={`grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm 
                      text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer
                      `}
          >
            <div className="flex items-center justify-center">
              {isCurrentSong && isPlaying ? (
                <div className=" size-4 text-blue-400">♫</div>
              ) : (
                <span className="group-hover:hidden">{index + 1}</span>
              )}

              {!isCurrentSong && (
                <Play className="h-4 w-4 hidden group-hover:block" />
              )}
            </div>

            <div className="flex items-center gap-3">
              <img src={song.imageUrl} alt={song.title} className="size-10" />

              <div>
                <div className={`font-medium text-white`}>{song.title}</div>
                <div>{song.artist}</div>
              </div>
            </div>
            <div className="flex items-center">
              {song.createdAt.split("T")[0]}
            </div>
            <div className="flex items-center">
              {formatDuration(song.duration)}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default AlbumSongsTable;
