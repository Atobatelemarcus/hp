"use client";

import Link from "next/link";
import Logo from "./Logo";
import { Menu } from "lucide-react";
import { useState } from "react";


export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 shadow-sm md:justify-between ">
      <div className="flex justify-between items-center py-3  mx-4 md:mx-8">
        {/* === LOGO SECTION === */}
        
         <Logo/>
        
      

        {/* === DESKTOP NAV LINKS === */}
        <div className="hidden md:flex justify-end-safe items-center gap-6 mx-2">
          <Link href="/" className="text-gray-700 hover:text-indigo-600">
            Home
          </Link>
          <Link href="/protected/Feed" className="text-gray-700 hover:text-indigo-600">
            Feed
          </Link>
          <Link href="/protected/Tech" className="text-gray-700 hover:text-indigo-600">
            Tech
          </Link>
          <Link href="/protected/Life" className="text-gray-700 hover:text-indigo-600">
            Life
          </Link>
          <Link href="/protected/Hardtalk" className="text-gray-700 hover:text-indigo-600">
            Hardtalk
          </Link>
        </div>

        {/* === MOBILE MENU TOGGLE === */}
        <button
          className="md:hidden text-gray-700 mx-2"
          onClick={() => setOpen(!open)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* === MOBILE NAV LINKS === */}
      {open && (
        <div className="md:hidden flex flex-col items-start px-6 pb-3 bg-white border-t border-gray-200 animate-slideDown">
          <Link href="/protected/Feed" className="py-2 w-full text-gray-700" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link href="/protected/Tech" className="py-2 w-full text-gray-700" onClick={() => setOpen(false)}>
          Tech
          </Link>
          <Link href="/protected/Life" className="py-2 w-full text-gray-700" onClick={() => setOpen(false)}>
            Life
          </Link>
          <Link href="/protected/Hardtalk" className="py-2 w-full text-gray-700" onClick={() => setOpen(false)}>
            Hardtalk
          </Link>
        </div>
      )}
    </nav>
  );
}

