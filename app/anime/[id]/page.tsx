import AnimeDetailPage from '@/components/anime-detail';
import { getAnimeById } from '@/lib/api';

export const revalidate = 3600;

export default async function AnimePage({ params }: { params: { id: string } }) {
    const id = Number((await params).id);
    const response = await getAnimeById(id);

    const anime = response.data;
    return (
        <AnimeDetailPage anime={anime} />
    );
}
