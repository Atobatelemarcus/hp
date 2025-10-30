"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext"; // ✅ make sure this path is correct
import Navbar from "../../../components/Navbar";
import BottomBar from "../../../components/BottomBar";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth(); // ✅ from context

  useEffect(() => {
    // Wait for context to load, then check user
    if (!loading && !user) {
      router.push("/register"); // or "/register" — whichever is your login/register page
    }
  }, [user, loading, router]);

  if (loading) {
    // while checking session
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 font-semibold">
        Checking authentication...
      </div>
    );
  }

  if (!user) return null; // prevent flashing page before redirect

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="mt-20 pt-4 md:pt-6 pb-20 md:pb-0 px-2 md:px-4 transition-all">
        {children}
      </main>
      <BottomBar />
    </div>
  );
}
