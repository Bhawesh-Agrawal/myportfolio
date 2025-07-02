"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
      <div className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo or Brand */}
          <div className="text-xl font-bold text-gray-800 tracking-tight">
            <Link href="/">codeXbhawesh</Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex gap-8 text-gray-700 text-sm font-medium items-center">
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
            <Link href="/contact" className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200">
              Contact Me
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
              className="md:hidden flex flex-col justify-center items-center w-6 h-6 space-y-1"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
          >
          <span
              className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
          />
            <span
                className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                }`}
            />
            <span
                className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 py-4 bg-white border-t border-gray-200 space-y-4">
            <Link
                href="/"
                scroll={false}
                className="block text-gray-700 hover:text-amber-600 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
                href="/Project"
                scroll={false}
                className="block text-gray-700 hover:text-amber-600 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
                href="#timeline"
                scroll={false}
                className="block text-gray-700 hover:text-amber-600 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
                href="#workflow"
                scroll={false}
                className="block text-gray-700 hover:text-amber-600 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
            >
              Tweets
            </Link>
            <Link
                href="/contact"
                className="block bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200 text-center w-fit"
                onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
  );
};

export default Navbar;