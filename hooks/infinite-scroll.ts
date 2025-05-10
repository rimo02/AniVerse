"use client";
import { useCallback, useRef, useState, useEffect } from "react";
import { Anime, AnimeResponse } from "@/lib/types";
import { fetchAnime } from "@/lib/api";
import { SearchParams } from "next/dist/server/request/search-params";

export function useInfiniteScroll(
  endpoint: string,
  params: SearchParams = {},
  initialAnime: Anime[] = []
) {
  const [animeList, setAnimeList] = useState<Anime[]>(initialAnime);
  const [page, setPage] = useState(initialAnime.length > 0 ? 2 : 1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const initialLoad = useRef(true);

  const loadAnimes = useCallback(
    async (pageToLoad: number) => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const response = (await fetchAnime(endpoint, {
          ...params,
          page: pageToLoad,
          limit: 24,
        })) as AnimeResponse;

        if (response.data.length === 0) {
          setHasMore(false);
          return;
        }

        setAnimeList((prevAnimes) =>
          pageToLoad === 1 ? response.data : [...prevAnimes, ...response.data]
        );
        setHasMore(response.pagination.has_next_page);
        setPage(pageToLoad + 1);
      } catch (error) {
        console.error("Failed to load animes:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, loading, hasMore, params]
  );

  const lastAnimeRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadAnimes(page);
        }
      });

      if (node && hasMore) observerRef.current.observe(node);
    },
    [loading, hasMore, loadAnimes, page]
  );

  useEffect(() => {
    if (!initialLoad.current) {
      setAnimeList([]);
      setPage(1);
      setHasMore(true);
      setLoading(false);
    }
    initialLoad.current = false;
  }, [params.q]);

  return {
    animeList,
    loading,
    hasMore,
    lastAnimeRef,
  };
}
