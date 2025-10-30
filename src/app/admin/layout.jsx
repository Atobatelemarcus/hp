"use client";
import { useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminNav from "@/app/components/AdminNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Home, Users, FileText, PlusCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "../../../components/Logo";

export default function AdminLayout({ children }) {

    const pathname = usePathname();
    const { logout } = useAuth();
  
const links = [
    { href: "/admin", label: "Dashboard", icon: <Home size={18} /> },
    { href: "/admin/manage-users", label: "Users", icon: <Users size={18} /> },
    { href: "/admin/manage-post", label: "Posts", icon: <FileText size={18} /> },
    { href: "/admin/create-post", label: "Create Post", icon: <PlusCircle size={18} /> },
  ];


  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-gray-100 gap-x-3">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 transform shadow-lg transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:shadow-none md:w-64`}
        >
          <AdminSidebar closeSidebar={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <AdminNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="p-4 md:p-6 flex-1">{children}</main>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0  bg-opacity-40 z-30  w-64 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <aside className="md:hidden w-64 h-screen bg-gradient-to-b from-pink-400 to-purple-400 text-white flex flex-col  rounded-t-xl justify-between fixed left-0 top-0">
                  <div>
                    <div className="p-4 text-xl font-bold">
                      <Logo/>
                    </div>
                    <nav className="flex flex-col mt-4 space-y-2">
                      {links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-800 ${
                            pathname === link.href ? "bg-gray-800 border-l-4 border-blue-500" : ""
                          }`}
                        >
                          {link.icon}
                          <span>{link.label}</span>
                        </Link>
                      ))}
                    </nav>
                  </div>
            
                  <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2 p-3 bg-black hover:bg-red-700 m-4 rounded"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </aside>


          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
