"use client"
import {usePosts} from "@/Components/StoreContext/postContext";
import {useEffect, useState} from "react";
import {FaChevronDown, FaFilter, FaRocket, FaSearch, FaTimes, FaCalendarAlt, FaClock, FaArrowRight, FaTag} from "react-icons/fa";
import {BiBook} from "react-icons/bi";
import Link from "next/link";

export default function Blog(){
    const {posts, isLoading, hasMore, loadMore} = usePosts();
    const blogs = posts.filter((post) => post.type === "blog");
    const uniqueBlogs = Array.from(new Map(blogs.map((p) => [p._id, p])).values());

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    const allTags = [...new Set(uniqueBlogs.flatMap((p) => p.tags || []))];

    // Function to create short slug from title (same as in your blog post component)
    const createShortSlug = (title: string): string => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim()
            .substring(0, 50) // Limit to 50 characters
            .replace(/-$/, ''); // Remove trailing hyphen
    };

    const filteredBlogs = uniqueBlogs.filter((blog) => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (blog.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (blog.slug || blog.slug || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTags = selectedTags.length === 0 ||
            selectedTags.some(tag => (blog.tags || []).includes(tag));

        return matchesSearch && matchesTags;
    });

    // Sort blogs
    const sortedBlogs = filteredBlogs.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);

        if (sortBy === "newest") return dateB.getTime() - dateA.getTime();
        if (sortBy === "oldest") return dateA.getTime() - dateB.getTime();
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return 0;
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
                <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                    <div className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-4">
                            <div className="absolute inset-0 border-4 rounded-full border-gray-200"></div>
                            <div className="absolute inset-0 border-4 rounded-full border-blue-500 border-t-transparent animate-spin"></div>
                            <BiBook className="absolute inset-0 m-auto text-blue-500 w-6 h-6" />
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
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center p-8">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex justify-center items-center mx-auto mb-6">
                            <BiBook className="w-10 h-10 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">No Blog Posts Found</h2>
                        <p className="text-gray-500 mb-4">Check back later for new articles!</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
            <div className="min-h-screen bg-gray-50">
                {/* Compact Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-6 py-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog</h1>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Thoughts, insights, and stories from my journey in development and design.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                    <div className="max-w-4xl mx-auto px-6 py-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                            </div>

                            {/* Filter and Sort */}
                            <div className="flex gap-3">
                                {/* Filter Button */}
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                                        isFilterOpen || selectedTags.length > 0
                                            ? "bg-blue-50 border-blue-200 text-blue-700"
                                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <FaFilter className="w-4 h-4" />
                                    Filter
                                    {selectedTags.length > 0 && (
                                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                                            {selectedTags.length}
                                        </span>
                                    )}
                                </button>

                                {/* Sort Dropdown */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="title">By Title</option>
                                </select>
                            </div>
                        </div>

                        {/* Filter Tags */}
                        {isFilterOpen && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaTag className="w-4 h-4 text-gray-500" />
                                    <span className="font-medium text-gray-700">Filter by topics:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {allTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                                selectedTags.includes(tag)
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Active Filters */}
                        {(searchTerm || selectedTags.length > 0) && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
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
                                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                        {tag}
                                        <button onClick={() => toggleTag(tag)}>
                                            <FaTimes className="w-3 h-3 hover:text-red-500" />
                                        </button>
                                    </span>
                                ))}
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-500 hover:text-blue-700 font-medium"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* Results Count */}
                        <div className="mt-3">
                            <p className="text-sm text-gray-600">
                                {sortedBlogs.length} {sortedBlogs.length === 1 ? 'article' : 'articles'} found
                            </p>
                        </div>
                    </div>
                </div>

                {/* Blog Posts */}
                <div className="max-w-4xl mx-auto px-6 py-8">
                    {sortedBlogs.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaSearch className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No articles found</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your search terms or filters</p>
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {sortedBlogs.map((blog, index) => (
                                <article
                                    key={blog._id.toString()}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group"
                                >
                                    <div className="md:flex">
                                        {/* Image */}
                                        <div className="md:w-80 md:flex-shrink-0">
                                            <div className="h-48 md:h-full relative overflow-hidden">
                                                {blog.bannerImage ? (
                                                    <img
                                                        src={blog.bannerImage}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 relative">
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <BiBook className="w-12 h-12 text-white/60" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-6">
                                            {/* Meta */}
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <FaCalendarAlt className="w-3 h-3" />
                                                    <span>{formatDate(blog.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaClock className="w-3 h-3" />
                                                    <span>{calculateReadTime(blog.content || blog.slug || "")}</span>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                <Link href={`/Blog/${createShortSlug(blog.title)}`}>
                                                    {blog.title}
                                                </Link>
                                            </h2>

                                            {/* Excerpt */}
                                            <p className="text-gray-600 mb-4 leading-relaxed">
                                                {truncateText(blog.slug || blog.content || "No preview available for this article.", 180)}
                                            </p>

                                            {/* Tags and Read More */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-wrap gap-2">
                                                    {(blog.tags || []).slice(0, 3).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer"
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

                                                <Link href={`/Blog/${createShortSlug(blog.title)}`}>
                                                    <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group">
                                                        Read more
                                                        <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </button>
                                                </Link>
                                            </div>
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
                                className={`px-8 py-3 bg-blue-500 text-white rounded-lg flex items-center gap-2 font-medium ${
                                    isLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-600 hover:shadow-lg"
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
        </>
    );
}