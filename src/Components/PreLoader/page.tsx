"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until all content (including images) is fully loaded
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 500); // Delay for smoothness
    };
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999] transition-opacity duration-700 ${
        loading ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Your custom logo here */}
      <div className="w-24 h-24 animate-bounce">
        {/* Replace with your SVG */}
        <img src="/logo_transparent.png" alt="Loading..." className="w-full h-full" />
      </div>
      <p className="mt-4 text-gray-700 text-lg font-semibold animate-pulse">
        Loading...
      </p>
    </div>
  );
}
