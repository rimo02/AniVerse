import AnimeGrid from '@/components/anime-grid'
import React from 'react'

const Page = async () => {
  try {
    return (
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-2">Discover Anime</h1>
        <AnimeGrid endpoint='/anime' limit={24} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching anime:", error);
    return (
      <div className="py-6">
        <p>Error fetching anime</p>
      </div>
    );
  }
}

export default Page