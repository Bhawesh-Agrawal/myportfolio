"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();


  return (
      <div className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo or Brand */}
          <div className="text-xl font-bold text-gray-800 tracking-tight">
            <Link href="/">codeXbhawesh</Link>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-8 text-gray-700 text-sm font-medium">
            <Link href="/" scroll={false} className="hover:text-amber-600 transition-colors duration-200">
              Home
            </Link>
            <Link href="/Project" scroll={false} className="hover:text-amber-600 transition-colors duration-200">
              Projects
            </Link>
            <Link href="#timeline" scroll={false} className="hover:text-amber-600 transition-colors duration-200">
              Blog
            </Link>
            <Link href="#workflow" scroll={false} className="hover:text-amber-600 transition-colors duration-200">
              Tweets
            </Link>
          </div>
        </div>
      </div>
  );
};

export default Navbar;
