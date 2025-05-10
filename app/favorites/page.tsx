"use client";
import React, { useEffect, useState } from "react";
import { getAnimeById } from "@/lib/api";
import AnimeCard from "@/components/anime-card";
import { Anime } from "@/lib/types";

const Page = () => {
  const [favAnime, setFavAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await fetch("/api/favourites");
        if (!res.ok) throw new Error("Failed to fetch favourites");
        const data = await res.json();
        console.log('data = ', data);
        const animeData = await Promise.all(
          data.favourites.map(async (id: number) => {
            return (await getAnimeById(id)).data;
          })
        );
        setFavAnime(animeData);

        console.log('anime data =', favAnime);

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFavourites();
  }, []);

  if (loading) return <div className="text-white text-2xl">Loading...</div>;

  return (
    <div className="mt-10">
      <div className="grid grid-cols-2 md:grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-4">
        {favAnime.map((anime) => (
          <div key={anime.mal_id} className="w-full mx-auto">
            <AnimeCard anime={anime} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
