"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaClock, FaArrowLeft, FaShare, FaTag, FaUser } from "react-icons/fa";


interface Post {
    _id: string;
    title: string;
    content?: string;
    excerpt?: string;
    slug: string;
    type: string;
    author?: string;
    bannerImage?: string | null;
    tags?: string[];
    createdAt?: string;
    publishedAt?: string;
    updatedAt?: string;
}

interface BlogPostClientProps {
    initialPost: Post;
}

export default function BlogPostClient({ initialPost }: BlogPostClientProps) {
    const router = useRouter();
    const [blog] = useState<Post>(initialPost);

    // Function to create short slug from title
    const createShortSlug = (title: string): string => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
            .substring(0, 50)
            .replace(/-$/, '');
    };

    const formatDate = (date: string | undefined): string => {
        if (!date) return "No date";
        try {
            return new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return "Invalid date";
        }
    };

    const calculateReadTime = (content: string | undefined): string => {
        if (!content) return "5 min read";
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        const readTime = Math.ceil(words / wordsPerMinute);
        return `${readTime} min read`;
    };

    const handleShare = async (): Promise<void> => {
        const shortSlug = createShortSlug(blog.title);
        const shareUrl = `${window.location.origin}/Blog/${shortSlug}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: blog.slug || blog.title,
                    url: shareUrl,
                });
            } catch (error) {
                console.log("Error sharing:", error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                alert("Link copied to clipboard!");
            } catch (error) {
                console.error("Failed to copy to clipboard:", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative">
        {blog.bannerImage && (
                <div
                    className="h-96 bg-cover bg-center bg-no-repeat relative"
            style={{
        backgroundImage: `linear-gradient(135deg, rgba(96, 150, 180, 0.7) 0%, rgba(189, 205, 214, 0.5) 100%), url('${blog.bannerImage}')`
    }}
>
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
)}

    {/* Back Button */}
    <div className="absolute top-6 left-6 z-10">
    <button
        onClick={() => router.back()}
    className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white transition-colors shadow-sm"
    >
    <FaArrowLeft className="w-4 h-4" />
        Back
        </button>
        </div>
        </div>

    {/* Main Content */}
    <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
    <div className="mb-6">
    <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {blog.title}
        </h1>

    {/* Meta Information */}
    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-4">
    <div className="flex items-center gap-2">
    <FaUser className="w-4 h-4" />
        <span>{"Admin"}</span>
        </div>
        <div className="flex items-center gap-2">
    <FaCalendarAlt className="w-4 h-4" />
        <span>{formatDate(blog.createdAt || blog.publishedAt)}</span>
    </div>
    {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
        <div className="flex items-center gap-2">
        <FaClock className="w-4 h-4" />
            <span>Updated {formatDate(blog.updatedAt)}</span>
    </div>
    )}
    <div className="flex items-center gap-2">
        <span>{calculateReadTime(blog.content)}</span>
    </div>
    </div>

    {/* Tags */}
    {blog.tags && blog.tags.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
        <FaTag className="w-4 h-4 text-gray-400" />
        <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag: string) => (
                    <span
                        key={tag}
                className="px-3 py-1 bg-[#EEE9DA] text-gray-700 rounded-full text-sm font-medium"
                    >
                    {tag}
                    </span>
    ))}
        </div>
        </div>
    )}

    {/* Share Button */}
    <div className="flex justify-end">
    <button
        onClick={handleShare}
    className="flex items-center gap-2 px-4 py-2 text-[#6096B4] hover:text-[#6096B4]/80 transition-colors"
    >
    <FaShare className="w-4 h-4" />
        Share Article
    </button>
    </div>
    </div>

    {/* Article Excerpt */}
    {blog.excerpt && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-[#6096B4]">
        <p className="text-lg text-gray-700 italic leading-relaxed">
            {blog.excerpt}
            </p>
            </div>
    )}
    </div>

    {/* Article Content */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
    <div className="prose prose-lg max-w-none">
        {blog.content ? (
                    <div
                        className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content }}
    />
) : (
        <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Article content is not available.</p>
    </div>
)}
    </div>
    </div>
    </div>
    </div>
);
}