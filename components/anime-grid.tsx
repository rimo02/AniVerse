"use client";

import AnimeCard from "./anime-card";
import { Anime } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";

interface AnimeGridProps {
    animeList: Anime[];
    loading: boolean;
    hasMore: boolean;
    lastAnimeElementRef: (node: HTMLElement | null) => void;
}

const AnimeGrid: React.FC<AnimeGridProps> = ({
    animeList,
    loading,
    hasMore,
    lastAnimeElementRef,
}) => {
    return (
        <div className="mt-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {animeList.map((item, index) => (
                    <AnimeCard key={index} anime={item} />
                ))}

                {loading &&
                    Array.from({ length: 8 }).map((_, index) => (
                        <div key={`skeleton-${index}`} className="h-full">
                            <Skeleton className="aspect-[3/4] w-full h-auto rounded-md mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    ))}
            </div>

            {hasMore && (
                <div ref={lastAnimeElementRef} className="h-10" aria-hidden="true" />
            )}

            {!hasMore && animeList.length > 0 && (
                <p className="text-center text-muted-foreground py-4">
                    You&apos;ve reached the end of the list
                </p>
            )}

            {!loading && animeList.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No anime found</p>
                </div>
            )}
        </div>
    );
};

export default AnimeGrid;
