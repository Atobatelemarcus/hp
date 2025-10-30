import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";

export async function POST(req) {
  try {
    await connectDB();

    const { postId, userId, author, text } = await req.json();

    if (!postId || !text) {
      return NextResponse.json(
        { error: "Post ID and text are required" },
        { status: 400 }
      );
    }

    const newComment = await Comment.create({
      post: new mongoose.Types.ObjectId(postId),
      user: userId ? new mongoose.Types.ObjectId(userId) : null,
      author,
      text,
      reactions: { like: 0, love: 0, laugh: 0 },
      replies: [],
    });

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating comment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();

    // Extract postId from the URL query params
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    // If no postId provided, return empty array or error
    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Fetch only comments that belong to this specific post
    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

