"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";



export default function ProtectedRoute({ children, allowedRoles = ["user", "admin"] }) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!allowedRoles.includes(parsed.role)) {
          router.push("/register");
        }
      } else {
        router.push("/register");
      }
    } else if (!allowedRoles.includes(user.role)) {
      router.push("/register");
    }
  }, [user, router, allowedRoles]);

  return <>{children}</>;
}
