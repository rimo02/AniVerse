"use client"
import AnimeGrid from '@/components/anime-grid';
import { useInfiniteScroll } from '@/hooks/infinite-scroll';
import { useSearchParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const params = {
    q:query,
    order_by: 'popularity',
    sort: 'asc',
  }
  const search = useInfiniteScroll(`/anime`, params)
  return (
    <div className='w-full'>
      <h1 className="text-3xl font-bold mb-2">
        Search Results for: <span className="text-primary">{query}</span>
      </h1>
      <AnimeGrid
        animeList={search.animeList}
        loading={search.loading}
        hasMore={search.hasMore}
        lastAnimeElementRef={search.lastAnimeRef}
      />
    </div>
  )
}

export default Page