import { getComments } from "@/lib/api";
import CommentForm from "./comment-form";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { Comment } from "@/lib/types";

interface Props {
    animeId: number;
}

export default async function CommentsSection({ animeId }: Props) {
    const comments:Comment[] = await getComments(animeId);

    return (
        <div className="flex flex-col gap-6 mt-6 w-full border p-10">
            <CommentForm animeId={animeId} />
            <h1 className="text-3xl font-bold">Comments</h1>
            <div className="flex flex-col gap-3">
                {comments.length > 0 ? (
                    comments.map((c) => (
                        <div key={c._id} className="flex flex-col md:p-3 p-0 rounded-md">
                            <div className="flex gap-4 text-sm text-gray-400 mb-1">
                                <span className="w-8 h-8 rounded-full relative">
                                    <Image src={c.image} alt="img" fill className="rounded-full object-cover" />
                                </span>
                                <span className="font-semibold dark:text-yellow-600 text-black">{c.userName}</span>
                                <span>{formatDate(new Date(c.createdAt))}</span>
                            </div>
                            <p className="dark:text-gray-200 text-black text-sm md:pl-12">{c.text}</p>
                        </div>
                    ))
                ) : (
                    <div>No Comments posted</div>
                )}
            </div>
        </div>
    );
}
