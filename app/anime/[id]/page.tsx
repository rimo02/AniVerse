import AnimeDetailPage from '@/components/anime-detail';
import { getAnimeById } from '@/lib/api';

export const revalidate = 3600;

interface Params {
    id: string;
}

interface PageProps {
    params: Params;
    searchParams?: Record<string, string | string[]>;
}

const AnimePage = async ({ params }: PageProps) => {
    const id = Number((await params).id);
    const response = await getAnimeById(id);
    const anime = response.data;
    return (
        <AnimeDetailPage anime={anime} />
    );
};

export default AnimePage;