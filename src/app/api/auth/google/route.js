// src/app/api/auth/google/route.js
import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req) {
  try {
    await connectDB();

    // Get token from frontend
    const { token } = await req.json();

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const { name, email, picture } = ticket.getPayload();

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(-8), // dummy password
        avatar: picture,
        role: "user", // default role
      });
    }

    // Create JWT including role
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Google login success",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role, // return role to frontend
      },
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    return NextResponse.json(
      { error: "Google authentication failed" },
      { status: 500 }
    );
  }
}
