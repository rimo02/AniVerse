import AnimeDetailPage from '@/components/anime-detail';
import { getAnimeById } from '@/lib/api';

export const revalidate = 3600;

const AnimePage = async ({ params }: { params: { id: string } }) => {
    const id = Number((await params).id);
    const response = await getAnimeById(id);
    const anime = response.data;
    return (
        <AnimeDetailPage anime={anime} />
    );
};

export default AnimePage;