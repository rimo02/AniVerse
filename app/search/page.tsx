'use client';
import AnimeGrid from '@/components/anime-grid';
import { useInfiniteScroll } from '@/hooks/infinite-scroll';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

const SearchContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const {
    animeList,
    loading,
    hasMore,
    lastAnimeRef,
  } = useInfiniteScroll(`/anime`, { q: query });

  return (
    <div className='w-full'>
      <h1 className="text-3xl font-bold mb-2">
        Search Results for: <span className="text-primary">{query}</span>
      </h1>
      <AnimeGrid
        animeList={animeList}
        loading={loading}
        hasMore={hasMore}
        lastAnimeElementRef={lastAnimeRef}
      />
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
};

export default Page;
