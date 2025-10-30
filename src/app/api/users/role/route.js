import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {connectDB} from "@/lib/db";
import User from "@/models/User";

export async function PATCH(req) {
  try {
    await connectDB();

    // Verify admin token
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    // Parse request
    const { userId, newRole } = await req.json();
    if (!userId || !newRole)
      return NextResponse.json({ error: "Missing data" }, { status: 400 });

    // Update user
    const updated = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    );

    if (!updated)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      message: `User role updated to ${newRole}`,
      user: { id: updated._id, email: updated.email, role: updated.role },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
