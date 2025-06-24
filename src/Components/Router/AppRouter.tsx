"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AppRouter = () => {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/framework", label: "Framework" },
        { href: "/timeline", label: "Timeline" },
        { href: "/workflow", label: "Workflow" },
        // Add more routes as you create new pages
    ];

    return (
        <nav className="flex gap-4 p-4 bg-gray-900 text-white fixed top-0 w-full z-50">
            {links.map((link) => (
                <Link key={link.href} href={link.href}>
          <span className={`hover:underline ${pathname === link.href ? "text-yellow-400" : ""}`}>
            {link.label}
          </span>
                </Link>
            ))}
        </nav>
    );
};

export default AppRouter;
