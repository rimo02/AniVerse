import { getAnimeById } from "@/lib/api";
import { Anime } from "@/lib/types";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/types";
import { NextResponse } from "next/server";
import AnimeCard from "@/components/anime-card";

export const revalidate = 360;

const fetchFav = async () => {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ favourites: user.favourites });
}

const Page = async () => {
  let favoriteAnime: Anime[] = [];
  const res = await fetchFav();

  if (!res.ok) throw new Error("Failed to fetch favourites");
  const data = await res.json();

  const animeData = await Promise.all(
    data.favourites.map(async (id: number) => {
      const response = await getAnimeById(id);
      return response.data;
    })
  );
  favoriteAnime = animeData;

  return (
    <div className="mt-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {favoriteAnime.map((item, index) => (
          <AnimeCard key={index} anime={item} />
        ))}
      </div>
    </div>
  );
};

export default Page;
