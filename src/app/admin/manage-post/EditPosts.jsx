"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function EditPost({ post, onClose, onUpdate }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    category: "Tech",
    content: "",
    image: null, // new image
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title,
        category: post.category,
        content: post.content,
        image: null,
      });
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("category", form.category);
      data.append("content", form.content);
      if (form.image) data.append("image", form.image);

      const res = await axios.put(`/api/posts/${post._id}`, data);
      alert(res.data.message);

      // Callback to refresh posts in dashboard
      if (onUpdate) onUpdate(res.data.post);

      onClose(); // close the edit form
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-md mt-8">
      <h2 className="font-bold mb-4 text-xs md:text-md">Edit Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={form.title}
          onChange={handleChange}
          className="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-200 text-xs md:text-md"
          required
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-200 text-xs md:text-md"
          required
        >
          <option value="Tech">Tech</option>
          <option value="Life">Life</option>
          <option value="Hardtalk">Hardtalk</option>
          <option value="Stories">Stories</option>
        </select>

        {/* Content */}
        <textarea
          name="content"
          placeholder="Write your post..."
          value={form.content}
          onChange={handleChange}
          rows={6}
          className="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-200 text-xs md:text-md"
          required
        />

        {/* Image */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="border w-full p-2 rounded"
        />

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-xs md:text-md"
          >
            {loading ? "Updating..." : "Update Post"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition text-xs md:text-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
