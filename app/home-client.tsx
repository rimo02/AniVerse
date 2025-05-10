"use client"
import AnimeGrid from '@/components/anime-grid';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInfiniteScroll } from '@/hooks/infinite-scroll'
import { Anime } from '@/lib/types';
import { TabsContent } from '@radix-ui/react-tabs';
import React, { useState } from 'react'

interface HomeClientProps {
    initialAnime: Anime[];
}

const HomeClient: React.FC<HomeClientProps> = ({ initialAnime }) => {
    const [, setActiveTab] = useState("top");
    const params = {
        order_by: 'popularity',
        sort: 'asc',
        sfw: 'true',
    }
    const top = useInfiniteScroll('/anime', params, initialAnime);
    const seasonal = useInfiniteScroll('/seasons/now', params);
    const handleTabChange = (value: string) => {
        setActiveTab(value);
    }
    return (
        <Tabs defaultValue='top' onValueChange={handleTabChange}>
            <TabsList className='mt-4'>
                <TabsTrigger value='top'>
                    Top Anime
                </TabsTrigger>
                <TabsTrigger value='seasonal'>
                    Seasonal
                </TabsTrigger>
            </TabsList>
            <TabsContent value='top'>
                <AnimeGrid
                    animeList={top.animeList}
                    loading={top.loading}
                    hasMore={top.hasMore}
                    lastAnimeElementRef={top.lastAnimeRef}
                />
            </TabsContent>
            <TabsContent value='seasonal'>
                <AnimeGrid
                    animeList={seasonal.animeList}
                    loading={seasonal.loading}
                    hasMore={seasonal.hasMore}
                    lastAnimeElementRef={seasonal.lastAnimeRef}
                />
            </TabsContent>
        </Tabs>
    )
}

export default HomeClient