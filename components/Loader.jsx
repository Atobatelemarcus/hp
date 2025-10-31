"use client";
import { motion } from "framer-motion";
import Logo from "../components/Logo"; // adjust path if needed

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      {/* Animated Inkverse Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Logo />
      </motion.div>

      {/* Spinning circle loader */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
        }}
        className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full"
      />

      {/* Animated text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-gray-700 font-medium text-sm tracking-wide"
      >
        Preparing <span className="font-semibold text-indigo-600">Heart and Pen...</span>
      </motion.p>
    </div>
  );
}
