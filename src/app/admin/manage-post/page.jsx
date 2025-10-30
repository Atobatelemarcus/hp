"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import EditPost from "./EditPosts"; // your EditPost component

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("/api/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Delete post
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`/api/posts/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const goToPage = (page) => setCurrentPage(page);

  return (
    <div className="p-6 bg-white shadow-md rounded-md relative">
      <h2 className="text-2xl font-bold mb-4">Manage Posts</h2>

      {loading ? (
        <p>Loading posts...</p>
      ) : currentPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2 text-xs md:text-md">Title</th>
                <th className="p-2 text-xs md:text-md">Category</th>
                <th className="p-2 text-xs md:text-md">Date</th>
                <th className="p-2 text-xs md:text-md">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post) => (
                <tr key={post._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-xs md:text-md">{post.title}</td>
                  <td className="p-2 text-xs md:text-md">{post.category}</td>
                  <td className="p-2 text-xs md:text-md">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs md:text-md"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setEditingPost(post)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs md:text-md"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 text-xs md:text-md"
              >
                Prev
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      onClick={() => goToPage(num)}
                      className={`px-3 py-1 border rounded text-xs md:text-md ${
                        num === currentPage
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {num}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className=" text-gray-600 text-xs md:text-md">Posts per page:</span>
              <select
                value={postsPerPage}
                onChange={(e) => {
                  setPostsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded p-1"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded-md shadow-lg p-6 max-w-2xl w-full relative">
            <button
              onClick={() => setEditingPost(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
            <EditPost
              post={editingPost}
              onClose={() => setEditingPost(null)}
              onUpdate={(updatedPost) => {
                setPosts((prev) =>
                  prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
