import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import crypto from "crypto";

export async function POST(req) {
  await connectDB();
  const { token, password } = await req.json();

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user)
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

  // ✅ Let schema handle hashing
  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  return NextResponse.json({ message: "Password reset successful" });
}
