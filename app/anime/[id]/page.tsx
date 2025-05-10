import AnimeDetailPage from "@/components/anime-detail";
import CommentsSection from "@/components/comment-section";
import { Suspense } from "react";

export const experimental_ppr = true

interface Props {
    params: { id: string };
}

export default async function Page({ params }: Props) {
    const id = Number((await params).id);

    return (
        <>
            <div className='max-w-5xl mx-auto mt-10 p-4 sm:p-6'>
                <AnimeDetailPage id={id} />
            </div>
            <Suspense fallback={<div>Loading Comments</div>}>
                <CommentsSection animeId={id} />
            </Suspense>
        </>
    )
}