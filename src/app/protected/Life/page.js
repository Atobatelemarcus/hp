"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

export default function FeedPage({ life = "Life" }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/posts");
        const allPosts = res.data;

        // ✅ Fetch once, filter directly
        const filteredPosts = allPosts.filter((p) => {
          if (!p.category && life === "Life") return true; // no category = general feed
          return (
            p.category?.toLowerCase().trim() === life.toLowerCase().trim()
          );
        });

        setPosts(filteredPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [life]);

  if (loading) return <p className="p-4">Loading posts...</p>;
  if (posts.length === 0)
    return <p className="p-4 text-gray-500">No posts in {life}</p>;

  return (
    <div className="p-4 grid grid-cols-1 gap-4">
      {posts.map((post) => (
        <Link
          key={post._id}
          href={`/protected/${life}/${post._id}`}
          className="rounded-xl overflow-hidden hover:shadow-lg transition"
        >
          <hr className="bg-purple-600" />
          <div className="flex justify-between">
            <div className="p-3">
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-500">
                {post.content.slice(0, 100)}...
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Image
              src={post.image || "/default-image.jpg"}
              alt={post.title}
              width={100}
              height={100}
              className="border border-slate-400 mx-4 rounded-lg object-cover w"
            />
          </div>
        </Link>
      ))}
      <hr className="bg-purple-600" />
    </div>
  );
}
