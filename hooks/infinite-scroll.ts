"use client";
import { useCallback, useRef, useState } from "react";
import { Anime, AnimeResponse } from "@/lib/types";
import { fetchAnime } from "@/lib/api";
import { SearchParams } from "next/dist/server/request/search-params";

export function useInfiniteScroll(endpoint: string, params: SearchParams = {}) {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadAnimes = useCallback(
    async (pageToLoad: number) => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const response = (await fetchAnime(endpoint, {
          ...params,
          page,
          limit: 24,
        })) as AnimeResponse;

        if (response.data.length === 0) {
          setHasMore(false);
          return;
        }

        if (pageToLoad === 1) {
          setAnimeList(response.data);
        } else {
          setAnimeList((prevAnimes) => [...prevAnimes, ...response.data]);
        }

        setHasMore(response.pagination.has_next_page);
        setPage(pageToLoad + 1);
      } catch (error) {
        console.error("Failed to load animes:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, loading, hasMore, page, params]
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

  const reset = useCallback(() => {
    setAnimeList([]);
    setPage(1);
    setHasMore(true);
    loadAnimes(1);
  }, [loadAnimes]);

  return {
    animeList,
    loading,
    hasMore,
    lastAnimeRef,
    reset,
  };
}
