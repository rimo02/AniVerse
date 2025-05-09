"use client";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { getAnimeById } from '@/lib/api';
import { Anime, Comment } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function AnimeDetailPage() {
    const params = useParams();
    const id = Number(params.id);
    const [anime, setAnime] = useState<Anime | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [comment, setComment] = useState('');
    const { data: session } = useSession();
    const [isFavorite, setIsFavorite] = useState(false);

    const fetchComments = async () => {
        if (!id) return;
        const response = await fetch(`/api/comments/${id}`);
        const data = await response.json();
        if (data?.comments) {
            setComments(data.comments);
        } else {
            console.error("Error fetching comments:", data);
        }
    }

    const fetchAnime = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const response = await getAnimeById(id);
            console.log(response);
            setAnime(response.data);
        } catch (err) {
            console.error("Error fetching anime:", err);
            setError("Failed to load anime details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnime();
        fetchComments();
    }, [id]);

    const handleCommentSubmit = async () => {
        if (!comment.trim()) return;
        try {
            const response = await fetch('/api/comments', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    animeId: id,
                    text: comment,
                    user: {
                        id: session?.user?.id,
                        name: session?.user?.name,
                        image: session?.user?.image,
                    }
                })
            });
            if (response.ok) {
                setComment('');
                fetchComments();
            } else {
                console.error("Failed to post comment:", await response.json());
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    }

    const handleAddToFavorites = async () => {
        if (!session?.user) return;
        const res = await fetch('/api/favourites', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ animeId: id, email: session?.user.email }),
        })
        if (res.ok) {
            const data = await res.json();
            setIsFavorite(data.success);
        } else {
            console.error("Failed to toggle favorite");
        }
    }


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
                        <button
                            onClick={handleAddToFavorites}
                            className={`p-2 rounded-md w-full mt-2 transition-colors ${isFavorite ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
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
            <div className="flex flex-col gap-6 mt-6 w-full border p-10">

                {session ? (
                    <div className="flex flex-col sm:flex-row gap-2 mb-6 w-full items-center">
                        <Textarea
                            value={comment}
                            placeholder="Write a comment..."
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-3 rounded-md border"
                        />
                        <button
                            onClick={handleCommentSubmit}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Post
                        </button>
                    </div>
                ) : (
                    <div className="mb-6 text-gray-400 italic">Sign in to post a comment</div>
                )}
                <h1 className='text-3xl bold'>Comments</h1>
                <div className="flex flex-col">
                    {comments.length > 0 ? (
                        comments.map((c) => (
                            <div key={c._id} className="flex flex-col p-3 rounded-md">
                                <div className="flex gap-4 text-sm text-gray-400 mb-1">
                                    <span className='w-8 h-8 rounded-full relative'>
                                        <Image
                                            src={c.image}   
                                            alt='img'
                                            fill
                                        />
                                    </span>
                                    <span className="font-semibold dark:text-yellow-600 text-black">{c.userName}</span>
                                    <span>{formatDate(new Date(c.createdAt))}</span>
                                </div>
                                <p className="dark:text-gray-200 text-black text-sm pl-12">{c.text}</p>
                            </div>
                        ))) : (
                        <div>No Comments posted</div>
                    )
                    }
                </div>

            </div>
        </div>
    )
}