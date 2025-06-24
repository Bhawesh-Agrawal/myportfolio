"use client";

import { usePosts } from "@/Components/StoreContext/postContext";
import ProjectCard from "@/Components/ProjectCard/page";
import Navbar from "@/Components/Navbar/page";
import { useEffect, useRef, useState } from "react";
import {
    FaCode,
    FaRocket,
    FaSearch,
    FaFilter,
    FaLightbulb,
    FaChartLine,
    FaUsers
} from "react-icons/fa";
import { BiGridAlt } from "react-icons/bi";
import { HiOutlineCollection, HiSparkles } from "react-icons/hi";

export default function Home() {
    const { posts, isLoading, hasMore, loadMore } = usePosts();
    const projects = posts.filter((post) => post.type === "project");
    const uniqueProjects = Array.from(new Map(projects.map((p) => [p._id, p])).values());

    const [headerVisible, setHeaderVisible] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    const headerRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    // Debugging logs
    console.log("Posts:", posts);
    console.log("Projects:", projects);
    console.log("Unique Projects:", uniqueProjects);
    console.log("Is Loading:", isLoading, "Has More:", hasMore);

    // Track when initial load is complete
    useEffect(() => {
        if (!isLoading && posts.length >= 0) {
            // Small delay to ensure smooth transition
            const timer = setTimeout(() => {
                setInitialLoadComplete(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isLoading, posts.length]);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target === headerRef.current) {
                        setHeaderVisible(true);
                    } else if (entry.target === statsRef.current) {
                        setStatsVisible(true);
                    }
                }
            });
        }, observerOptions);

        // Only observe when initial load is complete and content is ready
        if (initialLoadComplete && headerRef.current) {
            observer.observe(headerRef.current);
        }
        if (initialLoadComplete && statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, [initialLoadComplete]);

    // Show loading state only during initial load
    if (isLoading && posts.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-md mx-4">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                            <FaRocket className="absolute inset-0 m-auto w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Loading Projects</h2>
                        <p className="text-gray-600">Discovering amazing projects for you...</p>
                        <div className="mt-4 flex justify-center space-x-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Show no projects state only after initial load is complete
    if (projects.length === 0 && initialLoadComplete) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
                    <div className="text-center p-12 max-w-lg mx-4">
                        <div className="relative mb-8">
                            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-8 w-32 h-32 mx-auto shadow-xl">
                                <FaSearch className="w-16 h-16 text-gray-400 mx-auto" />
                            </div>
                            <HiSparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400" />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">No Projects Found</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            It looks like there are no projects to display right now. Check back later for updates!
                        </p>
                        <div className="mt-8">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Don't render main content until initial load is complete
    if (!initialLoadComplete) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
                    {/* Invisible placeholder to maintain layout */}
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
                {/* Header Section */}
                <div
                    ref={headerRef}
                    className={`relative overflow-hidden transition-all duration-1000 ease-out transform ${
                        headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 py-20">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-3 mb-8">
                                    <div className="relative">
                                        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-xl">
                                            <FaRocket className="w-10 h-10 text-white" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                            <HiSparkles className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-sm font-semibold text-blue-600 uppercase tracking-wider">
                                            Portfolio Showcase
                                        </span>
                                        <span className="block text-xs text-gray-500">
                                            Innovative Solutions
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                                    My{" "}
                                    <span className="relative">
                                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                            Projects
                                        </span>
                                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
                                    </span>
                                </h1>

                                <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                                    Explore a curated collection of innovative projects showcasing modern web development,
                                    creative problem-solving, and cutting-edge technical expertise.
                                </p>

                                <div className="flex flex-wrap justify-center gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-gray-200">
                                        <FaLightbulb className="w-4 h-4 text-yellow-500" />
                                        <span className="text-sm font-medium text-gray-700">Innovation</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-gray-200">
                                        <FaChartLine className="w-4 h-4 text-green-500" />
                                        <span className="text-sm font-medium text-gray-700">Performance</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-gray-200">
                                        <FaUsers className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm font-medium text-gray-700">User-Focused</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div
                    ref={statsRef}
                    className={`max-w-7xl mx-auto px-4 py-12 transition-all duration-1000 delay-300 ease-out transform ${
                        statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                    <HiOutlineCollection className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">{uniqueProjects.length}</p>
                                    <p className="text-gray-600 font-medium">Total Projects</p>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                    <FaCode className="w-8 h-8 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">
                                        {[...new Set(uniqueProjects.flatMap((p) => p.tags || []))].length}
                                    </p>
                                    <p className="text-gray-600 font-medium">Technologies</p>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                    <BiGridAlt className="w-8 h-8 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">Featured</p>
                                    <p className="text-gray-600 font-medium">Portfolio</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="max-w-7xl mx-auto px-4 pb-20">
                    <div className="mb-12">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">All Projects</h2>
                                    <p className="text-gray-600">Showcasing technical excellence</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                                <FaFilter className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">
                                    Showing {uniqueProjects.length} projects
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {uniqueProjects.map((project, index) => (
                            <div
                                key={project._id.toString()}
                                className="animate-fade-in-up"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animationFillMode: 'both'
                                }}
                            >
                                <ProjectCard
                                    id={project._id}
                                    title={project.title}
                                    slug={project.slug}
                                    bannerImage={project.bannerImage}
                                    tags={project.tags || []}
                                    github={project.projectLinks?.github || null}
                                    website={project.projectLinks?.website || null}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                        <div className="flex justify-center mt-20">
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
                                <button
                                    onClick={loadMore}
                                    disabled={isLoading}
                                    className={`group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative overflow-hidden ${
                                        isLoading ? "opacity-75 cursor-not-allowed" : "hover:from-blue-600 hover:to-purple-700"
                                    }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            Loading More...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <FaRocket className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                            Load More Projects
                                        </div>
                                    )}
                                </button>
                                <p className="text-center text-gray-600 mt-4 text-sm">
                                    Discover more amazing projects
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out;
                }
            `}</style>
        </>
    );
}