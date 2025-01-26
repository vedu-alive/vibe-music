import SectionGridSkeleton from "@/components/Skeletons/SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import { Song } from "@/types";
import PlayButton from "./PlayButton";

type Props = {
  title: string;
  songs: Song[];
  loading: boolean;
  error: string | null;
};

const SectionGrid = ({ loading, songs, title, error }: Props) => {
  if (error) {
    return <p className="text-red-500 mb-4 text-lg">{error}</p>;
  }
  return (
    <div className="mb-8 ">
      <div className="felx items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
        <Button
          variant={"link"}
          className="text-sm text-zinc-400 hover-text-white"
        >
          Show all
        </Button>
        <div>
          {loading ? (
            <SectionGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {songs.map((song) => (
                <div
                  key={song._id}
                  className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-colors group cursor-pointer"
                >
                  <div className="relative mb-4">
                    <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                      <img
                        src={song.imageUrl}
                        alt={song.title}
                        className=" w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <PlayButton song={song} />
                  </div>
                  <h3 className="font-md mb-2 truncate">{song.title}</h3>
                  <p className="text-sm text-zinc-400 truncate">
                    {song.artist}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionGrid;
