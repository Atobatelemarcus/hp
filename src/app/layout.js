
import "./globals.css";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "../context/AuthContext"; // ✅ Make sure this path is correct
import { PenTool } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

 export const metadata = {
  title: "Heart & Pen | At the intersection of ideas and imagination",
  description: "A storytelling blog for thinkers, writers, and dreamers.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ✅ AuthProvider wraps AppProvider so authentication context is available everywhere */}
        <AuthProvider>
           <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <main className="min-h-screen pt-4 md:pt-6 pb-20 md:pb-0 px-2 md:px-4 transition-al">
              {children}
            </main>
      </GoogleOAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
