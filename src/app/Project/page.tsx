"use client";

import { usePosts } from "@/Components/StoreContext/postContext";
import ProjectCard from "@/Components/ProjectCard/page";
import Navbar from "@/Components/Navbar/page";
import { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaRocket, FaTimes, FaChevronDown } from "react-icons/fa";
import { BiGridAlt } from "react-icons/bi";

export default function Home() {
    const { posts, isLoading, hasMore, loadMore } = usePosts();
    const projects = posts.filter((post) => post.type === "project");
    const uniqueProjects = Array.from(new Map(projects.map((p) => [p._id, p])).values());

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    // Get all unique tags
    const allTags = [...new Set(uniqueProjects.flatMap((p) => p.tags || []))];

    // Filter projects based on search and tags
    const filteredProjects = uniqueProjects.filter((project) => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesTags = selectedTags.length === 0 ||
            selectedTags.some(tag => (project.tags || []).includes(tag));
        return matchesSearch && matchesTags;
    });

    useEffect(() => {
        if (!isLoading && posts.length >= 0) {
            const timer = setTimeout(() => {
                setInitialLoadComplete(true);
            }, 100); // slight delay to ensure smooth entry
            return () => clearTimeout(timer);
        }
    }, [isLoading, posts.length]);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedTags([]);
        setIsFilterOpen(false);
    };

    // Loading
    if (isLoading && posts.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex justify-center items-center">
                    <div className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-4">
                            <div className="absolute inset-0 border-4 rounded-full border-[#BDCDD6]"></div>
                            <div className="absolute inset-0 border-4 rounded-full border-[#6096B4] border-t-transparent animate-spin"></div>
                            <FaRocket className="absolute inset-0 m-auto text-[#6096B4] w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Loading Projects</h2>
                        <p className="text-gray-500">Please wait...</p>
                    </div>
                </div>
            </>
        );
    }

    // No projects
    if (projects.length === 0 && initialLoadComplete) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center p-8">
                        <div className="w-20 h-20 bg-[#EEE9DA] rounded-full flex justify-center items-center mx-auto mb-6">
                            <BiGridAlt className="w-10 h-10 text-[#6096B4]" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">No Projects Found</h2>
                        <p className="text-gray-500 mb-4">Check back later for updates!</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#6096B4] text-white px-6 py-2 rounded-lg"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white">
                {/* Header Animation */}
                {initialLoadComplete && (
                    <div className="animate-fade-in-up transition-all duration-700 ease-out transform">
                        <div className="max-w-6xl mx-auto px-4 pt-6">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#6096B4] to-[#6096B4]/80 rounded-xl flex items-center justify-center shadow-lg">
                                        <BiGridAlt className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-[#111827] mb-1">
                                            My Projects
                                            <span className="block w-16 h-1 bg-gradient-to-r from-[#6096B4] to-[#BDCDD6] rounded-full mt-2"></span>
                                        </h1>
                                        <p className="text-lg text-[#1f2937]/70 font-medium">Showcase of my creative work</p>
                                    </div>
                                </div>
                            </div>

                            {/* Search + Filter */}
                            <div className="max-w-2xl mx-auto mb-8">
                                <div className="flex gap-3">
                                    {/* Search */}
                                    <div className="flex-1 relative">
                                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search projects..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border border-[#BDCDD6] rounded-lg focus:ring-2 focus:ring-[#6096B4]/20 focus:border-[#6096B4] transition-colors bg-white"
                                        />
                                    </div>

                                    {/* Filter */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                                            className={`px-4 py-3 border rounded-lg font-medium flex items-center gap-2 transition-colors ${
                                                selectedTags.length > 0
                                                    ? 'bg-[#6096B4] text-white border-[#6096B4]'
                                                    : 'bg-white text-gray-800 border-[#BDCDD6] hover:border-[#6096B4]'
                                            }`}
                                        >
                                            <FaFilter />
                                            <span>Filter</span>
                                            {selectedTags.length > 0 && (
                                                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                                                    {selectedTags.length}
                                                </span>
                                            )}
                                            <FaChevronDown className={`w-3 h-3 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isFilterOpen && (
                                            <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-[#BDCDD6] rounded-lg shadow-lg z-50 p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="font-semibold text-[#111827]">Filter by Tags</h3>
                                                    {selectedTags.length > 0 && (
                                                        <button
                                                            onClick={clearFilters}
                                                            className="text-sm text-[#6096B4] hover:text-[#6096B4]/80"
                                                        >
                                                            Clear all
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                                                    {allTags.map((tag) => (
                                                        <button
                                                            key={tag}
                                                            onClick={() => toggleTag(tag)}
                                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                                selectedTags.includes(tag)
                                                                    ? 'bg-[#6096B4] text-white'
                                                                    : 'bg-[#EEE9DA] text-gray-800 hover:bg-[#BDCDD6]'
                                                            }`}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {(searchTerm || selectedTags.length > 0) && (
                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <span className="text-sm text-gray-500">Active filters:</span>
                                        {searchTerm && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#EEE9DA] text-gray-800 rounded-full text-sm">
                                                Search: "{searchTerm}"
                                                <button onClick={() => setSearchTerm("")}>
                                                    <FaTimes className="w-3 h-3" />
                                                </button>
                                            </span>
                                        )}
                                        {selectedTags.map((tag) => (
                                            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-[#6096B4] text-white rounded-full text-sm">
                                                {tag}
                                                <button onClick={() => toggleTag(tag)}>
                                                    <FaTimes className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Result Info */}
                            <div className="mb-8">
                                <p className="text-sm text-gray-500">
                                    {filteredProjects.length === uniqueProjects.length
                                        ? `Showing all ${uniqueProjects.length} projects`
                                        : `Showing ${filteredProjects.length} of ${uniqueProjects.length} projects`}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Project Grid */}
                <div className="max-w-6xl mx-auto px-4 pb-16">
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-[#EEE9DA] rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaSearch className="w-8 h-8 text-[#6096B4]" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No projects found</h3>
                            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 bg-[#6096B4] text-white rounded-lg"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project, index) => (
                                <div
                                    key={project._id.toString()}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
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
                    )}
                    {hasMore && filteredProjects.length > 0 && (
                        <div className="flex justify-center mt-12">
                            <button
                                onClick={loadMore}
                                disabled={isLoading}
                                className={`px-6 py-3 bg-[#6096B4] text-white rounded-lg flex items-center gap-2 ${
                                    isLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-[#6096B4]/90 hover:shadow-lg"
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <FaRocket className="w-4 h-4" />
                                        Load More Projects
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Global fade-in animation */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out both;
                }
            `}</style>
        </>
    );
}
