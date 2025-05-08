import { Anime } from '@/lib/types'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent } from './ui/card'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'
import { Clock } from 'lucide-react'

interface AnimeCardProps {
    anime: Anime;
  }

  const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
    const imgUrl = anime.images.jpg.large_image_url || anime.images.webp.large_image_url
    return (
        <Link href={`anime/${anime.mal_id}`} passHref>
                <Card className='overflow-hidden bg-background border-border transition-all duration-300 p-0'>
                    <div className='relative w-full h-[200px] sm:h-[250px] md:h-[300px]'>
                        <Image src={imgUrl} alt={'image'}
                            fill
                            className={cn(
                                "object-cover transition-all duration-300 hover:scale-110"
                            )} />

                        <div className='absolute top-2 left-3'>
                            <Badge variant={'secondary'} className='font-medium'>{anime.type}</Badge>
                        </div>
                        <div className='absolute top-2 right-3'>
                            <Badge variant={'secondary'} className='bg-background/80 backdrop-blur-sm font-bold text-yellow-800 dark:text-yellow-300 border-yellow-500/30"'>★ {anime.score}</Badge>
                        </div>
                        <div className='absolute bottom-2 left-3'>
                            <Badge variant={'secondary'} className='bg-background/80 backdrop-blur-md font-bold'><Clock />{anime.episodes} eps</Badge>
                        </div>
                    </div>
                    <CardContent className="p-2 sm:p-3">
                        <h3 className="text-sm sm:text-base font-semibold truncate">{anime.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                            {anime.studios && anime.studios.length > 0
                                ? anime.studios[0].name
                                : anime.season && anime.year
                                    ? `${anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} ${anime.year}`
                                    : anime.type || "Unknown"}
                        </p>
                    </CardContent>
                </Card>
        </Link>
    )
}

export default AnimeCard