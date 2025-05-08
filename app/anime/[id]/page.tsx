"use client";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getAnimeById } from '@/lib/api';
import { Anime } from '@/lib/types';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function AnimeDetailPage(){
    const params = useParams();
    const id = Number(params.id);
    const [anime, setAnime] = useState<Anime | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnime = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const response = await getAnimeById(id);
                setAnime(response.data);
            } catch (err) {
                console.error("Error fetching anime:", err);
                setError("Failed to load anime details.");
            } finally {
                setLoading(false);
            }
        };
        fetchAnime();
    }, [id]);

    if (loading) {
        return (
            <div className='max-w-5xl mx-auto mt-10 p-4 sm:p-6'>
                <div className='flex flex-col sm:flex-row items-start gap-8'>
                    <div className='relative w-full sm:w-1/3 h-[400px] rounded-md overflow-hidden shadow-md'>
                        <Skeleton className='w-full h-full' />
                    </div>
                    <div className='flex flex-col justify-between w-full sm:w-2/3 gap-6'>
                        <Skeleton className='w-2/3 h-10' />
                        <div className='flex gap-2 flex-wrap'>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className='h-6 w-20' />
                            ))}
                        </div>
                        <Skeleton className='h-4 w-1/3' />
                        <Skeleton className='h-6 w-1/2' />
                        <Skeleton className='h-20 w-full' />
                        <Skeleton className='h-4 w-1/4' />
                        <Skeleton className='h-4 w-1/3' />
                    </div>
                </div>

            </div>
        )
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!anime) {
        return <div>No anime found for this ID.</div>;
    }

    return (
        <div className='max-w-5xl mx-auto mt-10 p-4 sm:p-6'>
            <div className='flex flex-col sm:flex-row items-start gap-8'>
                {/* Image Section */}
                <div className='relative w-full sm:w-1/3 h-[400px] rounded-md overflow-hidden shadow-md'>
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
        </div>
    )
}