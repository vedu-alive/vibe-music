import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/store/useMusicStore";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import FeaturesSection from "./components/FeaturesSection";
import { useAudioPlayerStore } from "@/store/useAudioPlayerStore";

const Home = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    madeForYouSongs,
    trendingSongs,
    featuredSongs,
    isTrendingLoading,
    isMadeForYouLoading,
    trendingError,
    madeForYouError,
  } = useMusicStore();
  const { inititializeQueue } = useAudioPlayerStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);
  
  useEffect(() => {
    if(featuredSongs.length > 0 && madeForYouSongs.length > 0 && trendingSongs.length > 0){
      inititializeQueue([...featuredSongs, ...madeForYouSongs, ...trendingSongs]);
    }
  },[inititializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      {/* featured */}
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-white text-2xl sm:text-3xl font-bold mb-6">
            Good Afternoon
          </h1>
          <FeaturesSection />
        </div>
        <div className="space-y-8">
          <SectionGrid
            title={"Made For You"}
            songs={madeForYouSongs}
            loading={isMadeForYouLoading}
            error={trendingError}
          />
          <SectionGrid
            title={"Trending"}
            songs={trendingSongs}
            loading={isTrendingLoading}
            error={madeForYouError}
          />
        </div>
      </ScrollArea>
    </main>
  );
};

export default Home;
