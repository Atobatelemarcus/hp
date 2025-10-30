import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Comment from "@/models/Comment";

export async function POST(req, context) {
  try {
    await connectDB();

    const { commentId } = await context.params; // ✅ fixed
    const { type, userId } = await req.json();

    const validTypes = ["like", "love", "laugh"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (!comment.reactedUsers) comment.reactedUsers = new Map();

    const previousType = comment.reactedUsers.get(userId);

    // Toggle logic
    if (previousType === type) {
      comment.reactions[type] = Math.max(0, comment.reactions[type] - 1);
      comment.reactedUsers.delete(userId);
    } else {
      if (previousType && validTypes.includes(previousType)) {
        comment.reactions[previousType] = Math.max(0, comment.reactions[previousType] - 1);
      }

      comment.reactions[type] += 1;
      comment.reactedUsers.set(userId, type);
    }

    await comment.save();

    return NextResponse.json({ reactions: comment.reactions });
  } catch (error) {
    console.error("❌ Reaction update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
