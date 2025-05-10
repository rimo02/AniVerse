"use client"
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function CommentForm({ animeId }: { animeId: number }) {
    const { data: session } = useSession();
    const [comment, setComment] = useState('');

    const handleCommentSubmit = async () => {
        if (!comment.trim()) return;
        await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                animeId,
                text: comment,
                user: {
                    id: session?.user?.id,
                    name: session?.user?.name,
                    image: session?.user?.image,
                },
            }),
        });
        setComment('');
    };

    if (!session) return <div className="mb-6 text-gray-400 italic">Sign in to post a comment</div>;

    return (
        <div className="flex flex-col sm:flex-row gap-2 mb-6 w-full items-center">
            <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 rounded-md border"
            />
            <button
                onClick={handleCommentSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
                Post
            </button>
        </div>
    );
}
