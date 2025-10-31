"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-semibold mb-3">No user logged in</h2>
        <p className="text-gray-500">Please login to view your profile.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white flex flex-col items-center py-10 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl overflow-hidden border border-purple-200">
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-32 w-full relative">
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
           
          </div>
        </div>

        <div className="pt-16 pb-8 px-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {user.name || "Anonymous User"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{user.email || "No email provided"}</p>

          <div className="mt-6 space-y-3 text-left">
            <div className="flex justify-between text-sm border-b py-2">
              <span className="font-medium text-gray-600">Role</span>
              <span className="text-gray-800">{user.role || "User"}</span>
            </div>
            <div className="flex justify-between text-sm border-b py-2">
              <span className="font-medium text-gray-600">Joined</span>
              <span className="text-gray-800">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Unknown"}
              </span>
                 <span className="font-medium text-green-600">{user.isOnline}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="mt-6 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200 w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}


