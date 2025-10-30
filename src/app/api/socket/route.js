// app/api/socket/route.js
import { Server } from "socket.io";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

let io;

export async function GET(req) {
  if (!io) {
    const server = req.socket?.server;
    await connectDB();

    io = new Server(server, {
      path: "/api/socket/io",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Attach io instance to server for reuse
    req.socket.server.io = io;

    io.on("connection", async (socket) => {
      const userId = socket.handshake.query.userId;

      if (!userId) return;

      // Mark online in MongoDB
      await User.findByIdAndUpdate(userId, { isOnline: true });

      // Notify dashboard clients
      io.emit("userStatusChanged", { userId, isOnline: true });

      socket.on("disconnect", async () => {
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date(),
        });
        io.emit("userStatusChanged", { userId, isOnline: false });
      });
    });
  }

  return new Response("Socket.io server is running", { status: 200 });
}
