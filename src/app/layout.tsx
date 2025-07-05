import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { PostProvider } from "@/Components/StoreContext/postContext";
import Navbar from "@/Components/Navbar/page";
import Footer from "@/Components/Footer/page";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "codeXbhawesh",
    description: "A website that brings the dream of Bhawesh all into a website",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" type="image/png" href="/logo_transparent.png" />
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ConvexClientProvider>
            <PostProvider>
                <Navbar />
                <main>{children}</main>
                <Footer />
            </PostProvider>
        </ConvexClientProvider>
        </body>
        </html>
    );
}
