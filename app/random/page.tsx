import { getRandomAnime } from "@/lib/api";
import { redirect } from "next/navigation";

const Page = async () => {
  const anime = await getRandomAnime();
  redirect(`/anime/${anime.mal_id}`);
};

export default Page;
