"use client";
import { motion } from "framer-motion";
import { PenTool } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-bold text-xl tracking-tight select-none"
    >
      {/* Animated Pen Icon */}
      <motion.div
        initial={{ rotate: -45, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        className="p-2 bg-purple-600 rounded-full text-white shadow-md"
      >
        <PenTool size={20} />
      </motion.div>

      {/* Brand Text */}
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-gray-900 text-lg font-semibold"
      >
        Heart<span className="text-purple-600">&</span>Pen
      </motion.span>
    </Link>
  );
}
