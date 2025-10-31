"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Newspaper, Heart, Cpu, MessageCircle, User } from "lucide-react";
import Link from "next/link";

export default function BottomBar() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScroll > lastScrollY && currentScroll > 100) {
            // Scrolling down → hide
            setVisible(false);
          } else {
            // Scrolling up → show
            setVisible(true);
          }
          setLastScrollY(currentScroll);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });



  //bottom bar inputs
   const pathname = usePathname();
  const tabs = [
    { href: "/protected/Feed", label: "Feed", icon: <Newspaper size={20} /> },
    { href: "/protected/Life", label: "Life", icon: <Heart size={20} /> },
    { href: "/protected/Tech", label: "Tech", icon: <Cpu size={20} /> },
    { href: "/protected/Hardtalk", label: "Talk", icon: <MessageCircle size={20} /> },
    { href: "/protected/Profile", label: "Me", icon: <User size={20} /> },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-sm 
        transition-transform duration-300 ease-in-out z-50 md:hidden
        ${visible ? "translate-y-0" : "translate-y-full"}`}
    >
       <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-md">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center text-xs ${
              active ? "text-blue-600 font-semibold" : "text-gray-500"
            }`}
          >
            {tab.icon}
            {tab.label}
          </Link>
        );
      })}
    </nav>
    </div>
  );
}
