import AnimeDetailPage from '@/components/anime-detail';
import { getAnimeById } from '@/lib/api';

export const revalidate = 3600;

type PageProps = {
    params: { id: string };
};

export default async function AnimePage({ params }: PageProps) {
    const id = Number((params).id);
    const response = await getAnimeById(id);

    const anime = response.data;
    return (
        <AnimeDetailPage anime={anime} />
    );
}
