import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/types";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        await connectDB();
        const { user, text, animeId } = body;

        if (!text || !animeId || !user?.id || !user?.name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const comment = await Comment.create({
            animeId,
            text,
            userId: user.id,
            userName: user.name,
            createdAt: Date.now(),
        });

        return NextResponse.json({ comment }, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}