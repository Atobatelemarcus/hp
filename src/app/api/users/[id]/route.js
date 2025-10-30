// src/app/api/users/[id]/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// 🗑️ Delete a user
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const user = await User.findByIdAndDelete(id);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

// 🛠️ Update user (generic fields, e.g., name, avatar)
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();

    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
    if (!updatedUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User updated", user: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// 👑 Update user role (admin only)
export async function PATCH(req, { params }) {
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
    const { newRole } = await req.json();
    const { id } = params; // user ID from URL
    if (!newRole)
      return NextResponse.json({ error: "Missing role" }, { status: 400 });

    // Update user role
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: newRole },
      { new: true }
    );

    if (!updatedUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      message: `User role updated to ${newRole}`,
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
