import { fetchAnime } from "@/lib/api";
import HomeClient from "./home-client";
import { AnimeResponse } from "@/lib/types";

export const revalidate = 3600;

const Home = async () => {
  const params = {
    order_by: 'popularity',
    sort: 'asc',
    sfw: 'true',
  };

  const initialAnime: AnimeResponse = await fetchAnime('/anime', params);

  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold mb-2">Discover Anime</h1>
      <HomeClient initialAnime={initialAnime.data || []} />
    </div>
  );
};

export default Home;
