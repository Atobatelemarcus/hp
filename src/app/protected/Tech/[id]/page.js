"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MessageCircle } from "lucide-react";
import ReactionButtons from "./components/ReactionButtons";
import CommentThread from "./components/CommentThread";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function PostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  // ✅ Fetch post + comments
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // 1️⃣ Fetch post
        const postRes = await axios.get(`/api/posts/${id}`);
        const postData = {
          ...postRes.data,
          reactions: postRes.data.reactions || {},
          comments: [],
        };

        // 2️⃣ Fetch comments separately for this post
        const commentRes = await axios.get(`/api/comments?postId=${id}`);
        postData.comments = commentRes.data || [];

        setPost(postData);
      } catch (err) {
        console.error("❌ Error fetching post or comments:", err);
      }
    };

    if (id) fetchPostAndComments();
  }, [id]);

  if (!post) return <p className="p-4">Loading post...</p>;

  // ✅ Handle post reaction
const handleReact = async (type) => {
  try {
    const res = await axios.post(`/api/posts/${id}/reactions`, {
      type,
      userId: user._id,
    });
    setPost((prev) => ({ ...prev, reactions: res.data.reactions }));
  } catch (err) {
    console.error(err);
  }
};


  // ✅ Handle comment reaction
const handleCommentReaction = async (commentId, type) => {
  try {
    console.log("🧠 Sending reaction:", { user }); // to confirm
    const res = await axios.post(`/api/comments/${commentId}/reactions`, {
      type,
      userId: user?._id || user?.id || user?.uid, // ✅ handles all cases
    });

    setPost((prev) => ({
      ...prev,
      comments: prev.comments.map((c) =>
        c._id === commentId ? { ...c, reactions: res.data.reactions } : c
      ),
    }));
  } catch (err) {
    console.error("Reaction failed:", err);
  }
};



  // ✅ Add reply to a comment
  const handleAddReply = async (commentId, text) => {
    if (!text?.trim()) return;
    try {
      const res = await axios.post(`/api/comments/${commentId}/reply`, {
        userId: user._id,
        author: user.name,
        text,
      });
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId ? { ...c, replies: res.data.replies } : c
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Add new comment
  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      const res = await axios.post("/api/comments", {
        postId: id,
        userId: user._id,
        author: user.name || "Anonymous",
        text: comment,
      });

      // Immediately append new comment to UI
      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), res.data.comment],
      }));

      setComment("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0e5ff] to-[#d3b3ff] py-10 px-4 flex justify-center">
      <div className="w-full max-w-3xl">
        {/* 📝 Post Content */}
        <section className="w-full border border-gray-200 rounded-lg shadow-sm p-6">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-4">
            {post.title}
          </h1>

          {post.image && (
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={400}
              className="w-full max-h-[400px] object-cover rounded-md border border-gray-300"
            />
          )}

          <p className="text-base sm:text-lg leading-relaxed text-gray-700 mt-4 break-words whitespace-pre-wrap">
            {post.content}
          </p>

          {/* ❤️ Reactions + 💬 Comment Toggle */}
          <div className="flex items-center gap-3 mt-6">
            <ReactionButtons reactions={post.reactions} onReact={handleReact} />
            <button
              onClick={() => setShowComments((prev) => !prev)}
              className="flex items-center gap-1 px-3 py-1 rounded hover:bg-gray-100"
            >
              <MessageCircle width={24} height={24} />
              {post?.comments?.length ?? 0}
            </button>
          </div>
        </section>

        {/* 💬 Comments Section */}
        {showComments && (
          <section className="mt-8 border-t pt-6 space-y-4 max-w-3xl">
            <h2 className="text-lg font-semibold">Comments</h2>

            {/* Scrollable comment area */}
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-md">
              <CommentThread
                comments={Array.isArray(post.comments) ? post.comments : []}
                onReactToComment={handleCommentReaction}
                onAddReply={handleAddReply}
              />
            </div>

            {/* ➕ Add Comment */}
            <div className="flex items-center gap-2 mt-6">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border rounded p-2 focus:ring focus:ring-blue-200 outline-none"
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
