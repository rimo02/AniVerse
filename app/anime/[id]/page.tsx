import { getAnimeById } from '@/lib/api';
import AnimeClient from '@/components/anime-detail';
import { Anime } from '@/lib/types';

export async function generateStaticParams() {
    const params = new URLSearchParams({
        order_by: 'popularity',
        sort: 'asc',
        limit: '20',
    });
    const topAnime = await fetch(`https://api.jikan.moe/v4/anime?${params.toString()}`);
    const data = await topAnime.json();
    return data.data.map((anime: Anime) => ({
        id: anime.mal_id.toString(),
    }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const animeData = await getAnimeById(Number(id));

    if (!animeData || !animeData.data) return <div>No anime found.</div>;

    return <AnimeClient anime={animeData.data} />;
}