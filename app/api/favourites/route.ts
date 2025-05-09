import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const { animeId, email } = body;
  const user = await User.findOne({ email });
  const inFav = user.favourites.includes(animeId);
  if (!inFav) {
    user.favourites.push(animeId);
  }
  await user.save();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ favourites: user.favourites });
}
