"use client";

import { useState } from "react";
import { ThumbsUp, Heart, Laugh } from "lucide-react";

export default function ReactionButtons({ reactions, onReact, userReaction, size = "md" }) {
  const [active, setActive] = useState(userReaction || null);

  const baseStyle =
    "flex items-center gap-1 rounded transition-all hover:shadow-sm active:scale-95";

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-1",
  };

  // helper to check if button is active
  const isActive = (type) => active === type;

  // handle click
  const handleReact = (type) => {
    const newReaction = active === type ? null : type; // toggle
    setActive(newReaction);
    onReact(newReaction); // send to backend
  };

  return (
    <div className="flex items-center gap-2">
      {/* 👍 Like */}
      <button
        onClick={() => handleReact("like")}
        className={`${baseStyle} ${sizes[size]} ${
          isActive("like") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }`}
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{reactions?.like || 0}</span>
      </button>

      {/* ❤️ Love */}
      <button
        onClick={() => handleReact("love")}
        className={`${baseStyle} ${sizes[size]} ${
          isActive("love") ? "bg-red-100 text-red-500" : "text-gray-700 hover:bg-red-50 hover:text-red-500"
        }`}
      >
        <Heart className="w-4 h-4" />
        <span>{reactions?.love || 0}</span>
      </button>

      {/* 😂 Laugh */}
      <button
        onClick={() => handleReact("laugh")}
        className={`${baseStyle} ${sizes[size]} ${
          isActive("laugh") ? "bg-yellow-100 text-yellow-600" : "text-gray-700 hover:bg-yellow-50 hover:text-yellow-500"
        }`}
      >
        <Laugh className="w-4 h-4" />
        <span>{reactions?.laugh || 0}</span>
      </button>
    </div>
  );
}
