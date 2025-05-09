import { connectDB } from "@/lib/db";
import { Comment } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = Number((await params).id);
  if (!id)
    return NextResponse.json({ error: "Missing animeId" }, { status: 400 });

  await connectDB();
  const comments = await Comment.find({ animeId: id }).sort({ createdAt: -1 });

  return NextResponse.json({ comments });
}
