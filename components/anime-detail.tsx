"use client";
import CommentForm from '@/components/comment-form';
import CommentsSection from '@/components/comment-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Anime, Comment } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { Suspense, useEffect, useState } from 'react';

export default function AnimeDetailPage({ anime }: { anime: Anime }) {
    const id = anime.mal_id;
    const [comments, setComments] = useState<Comment[]>([]);
    const { data: session } = useSession();
    const [favourite, setFavourite] = useState(false);


    useEffect(() => {
        const fetchComments = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/comments/${id}`);
            const data = await response.json();
            if (data?.comments) {
                setComments(data.comments);
            } else {
                console.error("Error fetching comments:", data);
            }
        }
        fetchComments();
    }, [id]);

    const handleToggleFavorites = async () => {
        if (!session?.user) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/favourites`);
            if (!res.ok) throw new Error("Failed to fetch favorites.");

            const data = await res.json();
            const isAlreadyFavorite = data.favourites.includes(id);
            if (isAlreadyFavorite) {
                const removeRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/favourites`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ animeId: id, email: session.user.email }),
                });
                if (!removeRes.ok) throw new Error("Failed to remove favorite.");
                setFavourite(false);
            }
            else {
                const addRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/favourites`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ animeId: id, email: session.user.email }),
                });
                if (!addRes.ok) throw new Error("Failed to add favorite.");
                const addData = await addRes.json();
                setFavourite(addData.success);
            }
        } catch (error) {
            console.error(error);
        }

    }

    if (!anime) {
        return <div>No anime found for this ID.</div>;
    }

    return (
        <>
            <div className='max-w-5xl mx-auto mt-10 p-4 sm:p-6'>
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
                        {session?.user && (
                            <div className='mt-4'>
                                <Button
                                    className='w-full gap-2'
                                    onClick={handleToggleFavorites}
                                >
                                    <Heart
                                        className={cn("h-4 w-4",
                                            favourite ? "fill-primary-foreground" : "fill-none"
                                        )}
                                    />
                                    {favourite ? "In favourites" : "Add to Favourite"}
                                </Button>
                            </div>
                        )}
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
                                        {anime.rank !== null ? `${anime.rank}` : 'Unknown'}
                                    </span>
                                </div>
                                <div>
                                    <span className='font-semibold'>Popularity:</span>{' '}
                                    <span className='text-gray-600 dark:text-gray-300'>
                                        {anime.popularity !== null ? `${anime.popularity}` : 'Unknown'}
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
                </div >
                <Suspense fallback={<div>Loading Comments</div>}>
                    <div className="flex flex-col gap-6 mt-6 w-full border p-10">
                        <CommentForm animeId={id} />
                        <h1 className="text-3xl font-bold">Comments</h1>
                        <CommentsSection comments={comments} />
                    </div>
                </Suspense>
            </div >
        </>
    )
}