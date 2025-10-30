"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../components/Logo";

export default function GetStartedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
      <Logo />
      <h1 className="md:text-xl text-md font-bold mt-8">Welcome to <span className="text-pink-500 text-sm">Heart</span>
         & <span className="text-purple-600 text-sm">Pen</span></h1>
      <p className="text-gray-800 mt-2 text-xs md:text-md">Your journey starts here.</p>

      <Link
        href="/register"
        className="mt-8 bg-purple-500 text-black md:px-6 md:py-3 px-4 py-2 rounded-full font-semibold hover:bg-pink-400 transition"
      >
        Get Started
      </Link>
    </div>
  );
}
