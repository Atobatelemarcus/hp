"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "../../../components/Logo";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // ✅ import context
import { GoogleLogin } from "@react-oauth/google";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const { register, login, googleLogin } = useAuth(); // ✅ from context

  // Handle email/password login or registration
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    let res;
    if (isRegister) {
      res = await register({ name, email, password });
    } else {
      res = await login({ email, password });
    }

    if (res?.user) {
      // ✅ Store user + token immediately for redirect
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);

      if (res.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/protected/Feed");
      }
    } else {
      setMessage(res?.error || "Something went wrong, please try again.");
    }
  } catch (err) {
    console.error(err);
    setMessage("Something went wrong, please try again.");
  } finally {
    setLoading(false);
  }
};


  // Handle Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await googleLogin(credentialResponse.credential); // sends token to backend
      if (!res?.error) {
        setMessage("Login successful");
        router.push("/protected/Feed");
      } else {
        setMessage(res.error || "Google Sign-in failed");
      }
    } catch (err) {
      setMessage("Google Sign-in error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage("Google Sign-in failed");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#f5f3f7] to-[#9b9a9c] text-gray-900">
      <div className="m-4 items-center justify-center">
        <Logo />
      </div>

      <div className="px-5 py-3 mt-3 bg-white rounded-3xl shadow-2xl md:w-96 text-center flex flex-col gap-4">
        <h1 className="md:text-xl text-sm font-extrabold m-2 text-purple-700">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-sm text-gray-500">
          {isRegister
            ? "Fill in your details to create a new account."
            : "Login to continue to your dashboard."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Full name"
              className="p-3 rounded-xl bg-purple-50 placeholder-purple-400 text-gray-900 border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-xl bg-purple-50 placeholder-purple-400 text-gray-900 border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-xl bg-purple-50 placeholder-purple-400 text-gray-900 border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-500 hover:to-pink-500 font-semibold transition shadow-lg text-white"
          >
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="border-b border-gray-300 w-1/4"></span>
          <span className="text-gray-500 text-sm">OR</span>
          <span className="border-b border-gray-300 w-1/4"></span>
        </div>

        {/* Google Login */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="continue_with"
          size="medium"
          shape="pill"
          width="100%"
        />

        <p className="text-sm text-gray-500 mt-4">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            className="text-purple-500 cursor-pointer font-semibold hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>

        {message && (
          <p className="text-sm text-red-500 font-medium mt-2">{message}</p>
        )}
       
        <Link href="/auth/forgot-password">
           <p className="text-purple-500 text-center">Forgot password?</p>
        </Link>
      </div>
    </div>
  );
}
