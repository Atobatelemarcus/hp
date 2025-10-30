import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";

const userReactions = new Map(); // Map<postId, Map<userId, type>>

export async function POST(req, context) {
  try {
    await connectDB();

    const { id } = context.params;
    const { type, userId } = await req.json();

    const validTypes = ["like", "love", "laugh"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (!userReactions.has(id)) {
      userReactions.set(id, new Map());
    }
    const postReactions = userReactions.get(id);
    const currentReaction = postReactions.get(userId);

    if (currentReaction === type) {
      post.reactions[type] = Math.max(0, (post.reactions[type] || 0) - 1);
      postReactions.delete(userId);
    } else {
      if (currentReaction) {
        post.reactions[currentReaction] = Math.max(
          0,
          (post.reactions[currentReaction] || 0) - 1
        );
      }
      post.reactions[type] = (post.reactions[type] || 0) + 1;
      postReactions.set(userId, type);
    }

    await post.save();
    return NextResponse.json({ reactions: post.reactions });
  } catch (error) {
    console.error("❌ Reaction update error:", error);
    return NextResponse.json({ error: "Failed to update post reaction" }, { status: 500 });
  }
}
