import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const { commentId } = params; // dynamic comment ID
    const { userId, author, text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Find the parent comment
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Create new reply object

const newReply = {
  _id: new mongoose.Types.ObjectId(),
  text,
  user: userId,
  author: author || undefined,
  reactions: {},
  createdAt: new Date(),
};


    // Push to replies array
    parentComment.replies.push(newReply);
    await parentComment.save();

    return NextResponse.json({ replies: parentComment.replies }, { status: 201 });
  } catch (error) {
    console.error("Error replying to comment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
