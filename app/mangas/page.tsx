import { useInfiniteScroll } from "@/hooks/infinite-scroll";
import { Manga } from "@/lib/types";
import AnimeGrid from "@/components/anime-grid";

const MangaPage = () => {
  const params = {
    order_by: "popularity",
    sort: "asc",
    sfw: "true",
  };

  const {
    mediaList: mangaList,
    loading,
    hasMore,
    lastMediaRef,
  } = useInfiniteScroll<Manga>("manga", "", params);

  return (
    <div>
      <AnimeGrid
        animeList={mangaList}
        loading={loading}
        hasMore={hasMore}
        lastAnimeElementRef={lastMediaRef}
      />
    </div>
  );
};

export default MangaPage;
