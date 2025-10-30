"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {   Users, FileText } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, users: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const [postsRes, usersRes] = await Promise.all([
        axios.get("/api/posts"),
        axios.get("/api/users"),
      ]);
      setStats({ posts: postsRes.data.length, users: usersRes.data.length });
    };
    loadStats();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-blue-300 p-4 rounded shadow flex flex-col items-center">
        <h3 className="font-semibold">Total Posts</h3>
        <div className="flex items-center gap-2">
          <p className="text-3xl font-bold">{stats.posts}  </p>
          <FileText size={18} />
        </div>  
      </div>
      <div className="bg-green-300 p-4 rounded shadow flex flex-col items-center">
        <h3 className="font-semibold">Registered Users</h3>
        <div className="flex items-center gap-2">
          <p className="text-3xl font-bold">{stats.users} </p>
          <Users size={18} />
        </div>
        
      </div>
    </div>
  );
}
