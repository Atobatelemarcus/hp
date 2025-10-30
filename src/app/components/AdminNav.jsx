"use client";

import { Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";



 

export default function AdminNav({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="w-full bg-purple-400 rounded-xl shadow flex justify-between items-center px-4 py-3 sticky top-0 z-20">
      {/* Left Section (Menu + Title) */}
      <div className="flex items-center gap-3">
        {/* Mobile Toggle Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-lg md:text-xl font-semibold text-gray-700">
          Admin Dashboard
        </h1>
      </div>

      {/* Right Section (User Info) */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
        </div>
       
      </div>
    </header>
  );
}
