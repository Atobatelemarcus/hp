"use client";
import { Suspense, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return toast.error("Enter a new password");
    setLoading(true);
    try {
      await axios.post("/api/auth/reset/change", { token, password });
      toast.success("Password reset successful!");
      setTimeout(() => router.push("/register"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid or expired link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Toaster />
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
