import { Button } from "@/components/ui/button";
import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";
import { Song } from "@/types"
import { Pause, Play } from "lucide-react";

type Props = {
    song: Song;
}

const PlayButton = ({ song }: Props) => {
    const { currentSong, isPlaying, setCurrentSong, togglePlay } = useAudioPlayerStore();
    const isCurrentSong = currentSong?._id === song._id;
    const handlePlay = () => {
        if (isCurrentSong) {
            togglePlay();
        } else {
            setCurrentSong(song);
        }
    }
  return (
      <Button
          size={'icon'}
      className={`absolute bottom-2 right-2 hover:bg-blue-400 bg-blue-500/70 hover:scale-105 transition-all opacity-0 translate-y-2 group-hover:translate-y-0 ${
        isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
      onClick={handlePlay}
    >
      {isPlaying && isCurrentSong ? (
        <Pause className="size-2 text-white" />
      ) : (
        <Play className="size-2 text-white" />
      )}
    </Button>
  );
}

export default PlayButton