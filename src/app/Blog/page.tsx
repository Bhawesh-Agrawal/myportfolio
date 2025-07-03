"use client"
import Navbar from "@/Components/Navbar/page";
import {usePosts} from "@/Components/StoreContext/postContext";
import {useEffect, useState} from "react";
import {FaChevronDown, FaFilter, FaRocket, FaSearch, FaTimes, FaCalendarAlt, FaClock, FaArrowRight} from "react-icons/fa";
import {BiBook} from "react-icons/bi";
import Link from "next/link";

export default function Blog(){
    const {posts, isLoading, hasMore, loadMore} = usePosts();
    const blogs = posts.filter((post) => post.type === "blog");
    const uniqueBlogs = Array.from(new Map(blogs.map((p) => [p._id, p])).values());

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    const allTags = [...new Set(uniqueBlogs.flatMap((p) => p.tags || []))];

    const filteredBlogs = uniqueBlogs.filter((blog) => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (blog.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (blog.slug || blog.slug || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTags = selectedTags.length === 0 ||
            selectedTags.some(tag => (blog.tags || []).includes(tag));
        return matchesSearch && matchesTags;
    });

    // Sort blogs by date (newest first)
    const sortedBlogs = filteredBlogs.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
    });

    useEffect(() => {
        if (!isLoading && posts.length >= 0) {
            const timer = setTimeout(() => {
                setInitialLoadComplete(true);
            }, 100);
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

    const formatDate = (date: string | Date) => {
        if (!date) return "No date";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const calculateReadTime = (content: string) => {
        if (!content) return "5 min read";
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        const readTime = Math.ceil(words / wordsPerMinute);
        return `${readTime} min read`;
    };

    const truncateText = (text: string, maxLength: number = 200) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + "...";
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
                            <BiBook className="absolute inset-0 m-auto text-[#6096B4] w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Loading Blog Posts</h2>
                        <p className="text-gray-500">Please wait...</p>
                    </div>
                </div>
            </>
        );
    }

    // No blogs
    if (blogs.length === 0 && initialLoadComplete) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center p-8">
                        <div className="w-20 h-20 bg-[#EEE9DA] rounded-full flex justify-center items-center mx-auto mb-6">
                            <BiBook className="w-10 h-10 text-[#6096B4]" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">No Blog Posts Found</h2>
                        <p className="text-gray-500 mb-4">Check back later for new articles!</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#6096B4] text-white px-6 py-2 rounded-lg hover:bg-[#6096B4]/90 transition-colors"
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
            <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                {initialLoadComplete && (
                    <div className="animate-fade-in-up transition-all duration-700 ease-out transform">
                        <div className="bg-white border-b border-gray-200">
                            <div className="max-w-4xl mx-auto px-4 py-12">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#6096B4] to-[#6096B4]/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <BiBook className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className="text-5xl font-bold text-[#111827] mb-4">
                                        My Blog
                                    </h1>
                                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                        Thoughts, experiences, and insights from my journey in development, design, and beyond.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filter Section */}
                        <div className="bg-white border-b border-gray-200">
                            <div className="max-w-4xl mx-auto px-4 py-6">
                                <div className="flex gap-4 items-center">
                                    {/* Search */}
                                    <div className="flex-1 relative">
                                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search articles..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6096B4]/20 focus:border-[#6096B4] transition-colors bg-white"
                                        />
                                    </div>

                                    {/* Filter */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                                            className={`px-4 py-3 border rounded-lg font-medium flex items-center gap-2 transition-colors ${
                                                selectedTags.length > 0
                                                    ? 'bg-[#6096B4] text-white border-[#6096B4]'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#6096B4]'
                                            }`}
                                        >
                                            <FaFilter className="w-4 h-4" />
                                            <span>Topics</span>
                                            {selectedTags.length > 0 && (
                                                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                                                    {selectedTags.length}
                                                </span>
                                            )}
                                            <FaChevronDown className={`w-3 h-3 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isFilterOpen && (
                                            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="font-semibold text-gray-800">Filter by Topics</h3>
                                                    {selectedTags.length > 0 && (
                                                        <button
                                                            onClick={clearFilters}
                                                            className="text-sm text-[#6096B4] hover:text-[#6096B4]/80 font-medium"
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
                                                            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                                                                selectedTags.includes(tag)
                                                                    ? 'bg-[#6096B4] text-white'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

                                {/* Active Filters */}
                                {(searchTerm || selectedTags.length > 0) && (
                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                        <span className="text-sm text-gray-500">Active filters:</span>
                                        {searchTerm && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                Search: "{searchTerm}"
                                                <button onClick={() => setSearchTerm("")}>
                                                    <FaTimes className="w-3 h-3 hover:text-red-500" />
                                                </button>
                                            </span>
                                        )}
                                        {selectedTags.map((tag) => (
                                            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-[#6096B4] text-white rounded-full text-sm">
                                                {tag}
                                                <button onClick={() => toggleTag(tag)}>
                                                    <FaTimes className="w-3 h-3 hover:text-red-200" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Results count */}
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500">
                                        {sortedBlogs.length === uniqueBlogs.length
                                            ? `${uniqueBlogs.length} ${uniqueBlogs.length === 1 ? 'article' : 'articles'}`
                                            : `${sortedBlogs.length} of ${uniqueBlogs.length} articles`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Blog Posts List */}
                <div className="max-w-4xl mx-auto px-4 py-8">
                    {sortedBlogs.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaSearch className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No articles found</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your search terms or selected topics</p>
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 bg-[#6096B4] text-white rounded-lg hover:bg-[#6096B4]/90 transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {sortedBlogs.map((blog, index) => (
                                <article
                                    key={blog._id.toString()}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 animate-fade-in-up"
                                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                                >
                                    {/* Banner Image Background */}
                                    {blog.bannerImage && (
                                        <div
                                            className="h-48 bg-cover bg-center bg-no-repeat relative"
                                            style={{
                                                backgroundImage: `linear-gradient(135deg, rgba(96, 150, 180, 0.8) 0%, rgba(189, 205, 214, 0.6) 100%), url('${blog.bannerImage}')`
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                        </div>
                                    )}

                                    <div className="p-8">
                                        {/* Article Header */}
                                        <div className="mb-4">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-[#6096B4] transition-colors">
                                                <Link href={`/blog/${blog.slug}`}>
                                                    {blog.title}
                                                </Link>
                                            </h2>

                                            {/* Meta Information */}
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <FaCalendarAlt className="w-3 h-3" />
                                                    <span>{formatDate(blog.createdAt)}</span>
                                                </div>
                                                {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                                                    <div className="flex items-center gap-1">
                                                        <FaClock className="w-3 h-3" />
                                                        <span>Updated {formatDate(blog.updatedAt)}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <span>{calculateReadTime(blog.content || blog.slug || "")}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Article Excerpt */}
                                        <div className="mb-6">
                                            <p className="text-gray-600 leading-relaxed text-lg">
                                                {truncateText(blog.slug  || blog.content || "No preview available for this article.")}
                                            </p>
                                        </div>

                                        {/* Tags and Read More */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-wrap gap-2">
                                                {(blog.tags || []).slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                                                        onClick={() => toggleTag(tag)}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {(blog.tags || []).length > 3 && (
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                                                        +{(blog.tags || []).length - 3} more
                                                    </span>
                                                )}
                                            </div>

                                            <Link href={`/Blog/${blog.slug}`}>
                                                <button className="flex items-center gap-2 px-4 py-2 text-[#6096B4] hover:text-[#6096B4]/80 font-medium transition-colors">
                                                    Read more
                                                    <FaArrowRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Load More Button */}
                    {hasMore && sortedBlogs.length > 0 && (
                        <div className="flex justify-center mt-12">
                            <button
                                onClick={loadMore}
                                disabled={isLoading}
                                className={`px-8 py-3 bg-[#6096B4] text-white rounded-lg flex items-center gap-2 font-medium ${
                                    isLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-[#6096B4]/90 hover:shadow-lg"
                                } transition-all duration-200`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <FaRocket className="w-4 h-4" />
                                        Load More Articles
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Animations */}
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