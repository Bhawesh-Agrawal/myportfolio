"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { PostProvider } from "@/Components/StoreContext/postContext";
import Navbar from "@/Components/Navbar/page";
import Footer from "@/Components/Footer/page";
import Preloader from "@/Components/PreLoader/page"; // ⬅ Added Preloader import

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {/* Preloader for initial page load */}
      <Preloader />

      {/* Spinner for route changes */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* App content */}
      <ConvexClientProvider>
        <PostProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </PostProvider>
      </ConvexClientProvider>
    </>
  );
}
