import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    // Always respond safely (avoid exposing valid emails)
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        message: "If your email is registered, a reset link has been sent.",
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

    // Send the email
    await sendEmail({
      to: user.email,
      subject: "Reset Your Inkverse Password",
      html: `
        <div style="font-family:sans-serif;line-height:1.6;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset. Click below to create a new one:</p>
          <a href="${resetLink}" 
             style="display:inline-block;background:#007BFF;color:white;padding:10px 18px;
             border-radius:5px;text-decoration:none;margin:10px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <hr />
          <p>If you didn’t request this, just ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "If your email is registered, a reset link has been sent.",
    });
  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
