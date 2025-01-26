import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);
  const { currentSong, isPlaying, playNext } = useAudioPlayerStore();
  //* play/pause logic
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);
  //* handle music end logic
  useEffect(() => {
    const handleEnded = () => {
      playNext();
    };
    const audio = audioRef.current;
    audio?.addEventListener("ended", handleEnded);
    return () => audio?.removeEventListener("ended", handleEnded);
  }, [playNext]);

  //* handle song change logic
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;
    const audio = audioRef.current;
    //* check for new song
    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
    if (isSongChange) {
      audio.src = currentSong?.audioUrl;
      //* reset playback time
      audio.currentTime = 0;
      prevSongRef.current = currentSong?.audioUrl;
      if(isPlaying) audio.play();
    }
  }, [currentSong, isPlaying]);
  return (
    <div>
      <audio ref={audioRef} />
    </div>
  );
};

export default AudioPlayer;
