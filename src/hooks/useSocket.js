// hooks/useSocket.js
"use client";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";

export default function useSocket(userId) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io({
      path: "/api/socket/io",
      query: { userId },
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId]);

  return socketRef.current;
}
