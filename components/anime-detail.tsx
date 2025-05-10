import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getAnimeById } from '@/lib/api';
import { Anime } from '@/lib/types';
import Image from 'next/image';

async function getAnimeDetails(id: number): Promise<Anime | null> {
    try {
        const response = await getAnimeById(id);
        return response.data;
    } catch (error) {
        console.error("Error fetching anime:", error);
        return null;
    }
}

export default async function AnimeDetailPage({ id }: { id: number }) {
    const anime = await getAnimeDetails(id);

    if (!anime) {
        return <div className="text-center mt-10">Failed to load anime details.</div>;
    }


    return (
        <>
            <div className='flex flex-col sm:flex-row items-start gap-8'>
                {/* Image Section */}
                <div className='w-full relative sm:w-1/3'>
                    <div className='relative w-full h-[400px] rounded-md overflow-hidden shadow-md'>
                        <Image
                            src={anime.images.jpg.large_image_url}
                            alt={anime.title}
                            fill
                            className='object-cover'
                        />

                        <div className='absolute top-2 left-2'>
                            <Badge variant={'secondary'} className='font-medium'>
                                {anime.type}
                            </Badge>
                        </div>
                        <div className='absolute top-2 right-2'>
                            <Badge
                                variant={'secondary'}
                                className='bg-background/80 backdrop-blur-sm font-bold text-yellow-800 dark:text-yellow-300 border-yellow-500/30'
                            >
                                ★ {anime.score}
                            </Badge>
                        </div>
                    </div>
                    {/* {session?.user && (
                        <button
                            onClick={handleAddToFavorites}
                            className={`p-2 rounded-md w-full mt-2 transition-colors ${isFavorite ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                    )} */}
                </div>


                {/* Details Section */}
                <div className='flex flex-col justify-between w-full sm:w-2/3 gap-6'>
                    {/* Title and Genres */}
                    <div className='flex flex-col gap-3'>
                        <h1 className='text-3xl font-bold'>{anime.title}</h1>
                        <div className='flex flex-wrap gap-2'>
                            {anime.genres?.map((genre) => (
                                <Badge variant='outline' key={genre.mal_id}>
                                    {genre.name}
                                </Badge>
                            ))}
                            {anime.explicit_genres?.length > 0 && (
                                <Badge variant='destructive'>Explicit</Badge>
                            )}
                        </div>
                        <p className='text-gray-500 dark:text-gray-400'>
                            {anime.episodes !== null ? `${anime.episodes} Episodes` : 'Unknown Episodes'} •{' '}
                            {anime.status}
                        </p>
                    </div>

                    <Separator />

                    {/* Synopsis */}
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-semibold'>Synopsis</h2>
                        <p className='text-gray-600 dark:text-gray-300 text-sm font-light'>
                            {anime.synopsis || 'No synopsis available.'}
                        </p>
                    </div>

                    <Separator />

                    {/* Additional Information */}
                    <div className='flex flex-col gap-3 text-sm'>
                        <h2 className='text-xl font-semibold'>More Information</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                            <div>
                                <span className='font-semibold'>Japanese Title:</span>{' '}
                                <span className='text-gray-600 dark:text-gray-300'>{anime.title}</span>
                            </div>
                            <div>
                                <span className='font-semibold'>Type:</span>{' '}
                                <span className='text-gray-600 dark:text-gray-300'>{anime.type}</span>
                            </div>
                            <div>
                                <span className='font-semibold'>Source:</span>{' '}
                                <span className='text-gray-600 dark:text-gray-300'>{anime.source}</span>
                            </div>
                            <div>
                                <span className='font-semibold'>Aired:</span>{' '}
                                <span className='text-gray-600 dark:text-gray-300'>
                                    {anime.aired?.string || 'Unknown'}
                                </span>
                            </div>
                            <div>
                                <span className='font-semibold'>Duration:</span>{' '}
                                <span className='text-gray-600 dark:text-gray-300'>{anime.duration || 'Unknown'}</span>
                            </div>
                            <div>
                                <span className='font-semibold'>Rating:</span>{' '}
                                <span className='text-gray-600 dark:text-gray-300'>{anime.rating || 'Unknown'}</span>
                            </div>
                            <div>
                                <span className='font-semibold'>Rank:</span>{' '}
                                <span className='text-gray-600 dark:text-gray-300'>
                                    {anime.rank !== null ? `#${anime.rank}` : 'Unknown'}
                                </span>
                            </div>
                            <div>
                                <span className='font-semibold'>Popularity:</span>{' '}
                                <span className='text-gray-600 dark:text-gray-300'>
                                    {anime.popularity !== null ? `#${anime.popularity}` : 'Unknown'}
                                </span>
                            </div>
                            {anime.studios && anime.studios.length > 0 && (
                                <div>
                                    <span className='font-semibold'>Studios:</span>{' '}
                                    <span className='text-gray-600 dark:text-gray-300'>
                                        {anime.studios.map((studio) => studio.name).join(', ')}
                                    </span>
                                </div>
                            )}
                            {anime.season && anime.year && (
                                <div>
                                    <span className='font-semibold'>Season:</span>{' '}
                                    <span className='text-gray-600 dark:text-gray-300'>
                                        {anime.season} {anime.year}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {anime.background && (
                        <>
                            <Separator />
                            <div className='flex flex-col gap-2'>
                                <h2 className='text-xl font-semibold'>Background</h2>
                                <p className='text-gray-600 dark:text-gray-300 text-sm font-light'>
                                    {anime.background}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Separator className='mt-10' />
            <div className='flex flex-col gap-2 mt-6 w-full'>
                <h2 className='text-xl font-semibold'>Trailer</h2>
                <div className='aspect-video w-full'>
                    <iframe
                        src={`https://www.youtube.com/embed/${anime.trailer?.youtube_id}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className='w-full h-full'
                    ></iframe>
                </div>
            </div>
        </>

    )
}