"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; // for token and socket

export default function ManageUsers() {
  const { socket, user: currentUser, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // 🧩 Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 🟢 Real-time online/offline via socket
  useEffect(() => {
    if (!socket) return;

    socket.on("user-online", (userId) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });

    socket.on("user-offline", (userId) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    return () => {
      socket.off("user-online");
      socket.off("user-offline");
    };
  }, [socket]);

  // 🗑️ Delete user
  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user");
    }
  };

  // 👑 Change user role
  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await axios.patch(
        `/api/users/${id}`,
        { newRole },
        {
          headers: { Authorization: `Bearer ${token}` }, // send admin token
        }
      );
      const updatedUser = res.data.user;
      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser.id ? { ...u, role: updatedUser.role } : u))
      );
    } catch (err) {
      console.error("Role update failed:", err);
      alert("Failed to update role");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="md:text-xl font-bold mb-4 text-xs">Manage Users</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table className="w-full border-collapse text-xs md:text-md">
          <thead>
            <tr className="border-b bg-gray-100 text-xs md:text-md">
              <th className="p-2 text-xs md:text-md">Name</th>
              <th className="p-2 text-xs md:text-md">Email</th>
              <th className="p-2 text-xs md:text-md">Role</th>
              <th className="p-2 text-xs md:text-md">Status</th>
              <th className="p-2 text-xs md:text-md">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isOnline = onlineUsers.has(user._id);
              return (
                <tr key={user._id} className="border-b hover:bg-gray-50 md:text-sm text-xs">
                  <td className="p-2 text-xs md:text-md">{user.name}</td>
                  <td className="p-2 text-xs md:text-md">{user.email}</td>

                  <td className="p-2 capitalize">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="border rounded p-1 text-xs md:text-md"
                      disabled={currentUser._id === user._id} // can't change own role
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="p-2">
                    {isOnline ? (
                      <span className="text-green-600 font-semibold text-xs md:text-md">Online</span>
                    ) : (
                      <span className="text-gray-500 text-xs md:text-md">Offline</span>
                    )}
                  </td>

                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs md:text-md"
                      disabled={currentUser._id === user._id} // can't delete self
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
