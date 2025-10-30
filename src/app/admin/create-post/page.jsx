"use client";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function CreatePost() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    category: "Tech", // default
    content: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

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
      data.append("author", user?.name || "Admin");
      if (form.image) data.append("image", form.image);

      await axios.post("/api/posts", data);
      alert("✅ Post created successfully!");
      setForm({ title: "", category: "Tech", content: "", image: null });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={form.title}
          onChange={handleChange}
          className="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
          required
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
          required
        >
          <option value="Tech">Tech</option>
          <option value="Life">Life</option>
          <option value="Hardtalk">Hardtalk</option>
          <option value="Feed">Feed</option>
        </select>

        {/* Content */}
        <textarea
          name="content"
          placeholder="Write your post..."
          value={form.content}
          onChange={handleChange}
          rows={6}
          className="border w-full p-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Posting..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}
