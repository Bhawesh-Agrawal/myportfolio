"use client";

import { useParams, useRouter } from "next/navigation";
import { usePosts } from "@/Components/StoreContext/postContext";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { FaGithub, FaLink, FaExternalLinkAlt, FaCalendarAlt, FaEye, FaArrowLeft } from "react-icons/fa";
import { BiCode } from "react-icons/bi";
import { HiOutlineExternalLink } from "react-icons/hi";
import gsap from "gsap";

export default function ProjectDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { getPostById, posts } = usePosts();
    const post = posts.find((post) => post._id.toString() === id);

    const contentRef = useRef(null);
    const sidebarRef = useRef(null);
    const headerRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        // Set initial states immediately to prevent flash
        const elements = [headerRef.current, imageRef.current, contentRef.current, sidebarRef.current].filter(Boolean);

        // Set initial invisible state
        gsap.set(elements, { opacity: 0 });

        // Create timeline for animations
        const tl = gsap.timeline();

        if (headerRef.current) {
            gsap.set(headerRef.current, { y: -30 });
            tl.to(headerRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
            });
        }

        if (imageRef.current) {
            gsap.set(imageRef.current, { scale: 0.95 });
            tl.to(imageRef.current, {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power2.out",
            }, "-=0.5");
        }

        if (contentRef.current) {
            gsap.set(contentRef.current, { y: 20 });
            tl.to(contentRef.current, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
            }, "-=0.7");
        }

        if (sidebarRef.current) {
            gsap.set(sidebarRef.current, { x: 50 });
            tl.to(sidebarRef.current, {
                opacity: 1,
                x: 0,
                duration: 1.2,
                ease: "power2.out",
            }, "-=0.8");
        }

        // Cleanup function
        return () => {
            tl.kill();
        };
    }, [post]); // Add post as dependency to re-run when post changes

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading project details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-white">
            {/* Back Button */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center gap-3 px-4 py-2 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                    >
                        <FaArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors duration-200" />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                            Back
                        </span>
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div ref={headerRef} className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <BiCode className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                            Project Showcase
                        </span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt className="w-4 h-4" />
                            <span className="text-sm">
                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaEye className="w-4 h-4" />
                            <span className="text-sm">Featured Project</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 items-start">
                {/* Left Column - Main Content */}
                <div className="space-y-8">
                    {/* Banner Image */}
                    {post.bannerImage && (
                        <div ref={imageRef} className="relative group">
                            <div className="overflow-hidden rounded-2xl shadow-2xl bg-white p-4">
                                <Image
                                    src={post.bannerImage}
                                    alt={post.title}
                                    width={800}
                                    height={400}
                                    className="rounded-xl w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    )}

                    {/* Content */}
                    <div ref={contentRef} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Technologies Used
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                                    style={{
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div ref={sidebarRef} className="space-y-6">
                    {/* Project Links Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FaLink className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Project Links</h2>
                        </div>

                        <div className="space-y-4">
                            {post.projectLinks?.github && (
                                <a
                                    href={post.projectLinks.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-900 rounded-xl transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-gray-900"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg group-hover:bg-gray-800 transition-colors duration-300">
                                            <FaGithub className="w-5 h-5 text-gray-900 group-hover:text-white" />
                                        </div>
                                        <span className="font-medium text-gray-900 group-hover:text-white">
                                            View Source Code
                                        </span>
                                    </div>
                                    <HiOutlineExternalLink className="w-5 h-5 text-gray-500 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                </a>
                            )}

                            {post.projectLinks?.website && (
                                <a
                                    href={post.projectLinks.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-500 hover:to-emerald-500 rounded-xl transition-all duration-300 hover:shadow-lg border border-green-200 hover:border-green-500"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg">
                                            <FaExternalLinkAlt className="w-5 h-5 text-green-600 group-hover:text-white" />
                                        </div>
                                        <span className="font-medium text-green-700 group-hover:text-white">
                                            Live Demo
                                        </span>
                                    </div>
                                    <HiOutlineExternalLink className="w-5 h-5 text-green-500 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                </a>
                            )}

                            {post.projectLinks?.references?.map((ref, idx) => (
                                <a
                                    key={idx}
                                    href={ref.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-500 rounded-xl transition-all duration-300 hover:shadow-lg border border-blue-200 hover:border-blue-500"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg">
                                            <FaLink className="w-4 h-4 text-blue-600 group-hover:text-white" />
                                        </div>
                                        <span className="font-medium text-blue-700 group-hover:text-white text-sm">
                                            {ref.label}
                                        </span>
                                    </div>
                                    <HiOutlineExternalLink className="w-4 h-4 text-blue-500 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Info Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                        <h3 className="text-lg font-semibold text-purple-900 mb-4">
                            Project Info
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-purple-700">Status:</span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                    Complete
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-purple-700">Technologies:</span>
                                <span className="text-purple-900 font-medium">
                                    {post.tags.length} used
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}