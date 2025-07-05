"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePosts } from "@/Components/StoreContext/postContext";
import { FaCalendarAlt, FaClock, FaArrowLeft, FaShare, FaTag, FaUser } from "react-icons/fa";
import { BiBook } from "react-icons/bi";
import Link from "next/link";
import Head from "next/head";

// Define proper TypeScript interfaces matching your actual data structure
interface BlogPost {
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

// This interface matches your actual Post type from context
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

interface BlogPostParams {
    slug: string;
    [key: string]: string | string[] | undefined;
}

export default function BlogPost() {
    const params = useParams();
    const router = useRouter();
    const { posts, isLoading } = usePosts();
    const [blog, setBlog] = useState<Post | null>(null);
    const [isFound, setIsFound] = useState<boolean>(true);
    const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

    // Function to create short slug from title
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

    // Function to find blog by both original slug and short slug
    const findBlogBySlug = (posts: Post[], searchSlug: string): Post | undefined => {
        // First try exact match with original slug
        let foundBlog = posts.find((post: Post) =>
            post.type === "blog" && post.slug === searchSlug
        );

        // If not found, try matching with generated short slug
        if (!foundBlog) {
            foundBlog = posts.find((post: Post) =>
                post.type === "blog" && createShortSlug(post.title) === searchSlug
            );
        }

        // If still not found, try case-insensitive match
        if (!foundBlog) {
            foundBlog = posts.find((post: Post) =>
                post.type === "blog" &&
                (post.slug?.toLowerCase() === searchSlug.toLowerCase() ||
                    createShortSlug(post.title).toLowerCase() === searchSlug.toLowerCase())
            );
        }

        return foundBlog;
    };

    // Ensure slug is a string and decode URL encoding
    const rawSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const slug = rawSlug ? decodeURIComponent(rawSlug) : '';

    console.log('Raw slug from URL:', rawSlug);
    console.log('Decoded slug:', slug);

    useEffect(() => {
        if (!isLoading && posts && posts.length > 0) {
            console.log('Posts count:', posts.length);
            console.log('All blog posts:', posts.filter((post: Post) => post.type === "blog"));
            console.log('Looking for slug:', slug);

            const foundBlog = findBlogBySlug(posts, slug);
            console.log('Found blog:', foundBlog);

            if (foundBlog) {
                setBlog(foundBlog);
                setIsFound(true);

                // Find related posts based on tags
                const related = posts
                    .filter((post: Post) =>
                        post.type === "blog" &&
                        post._id !== foundBlog._id &&
                        post.tags?.some(tag => foundBlog.tags?.includes(tag))
                    )
                    .slice(0, 3);
                setRelatedPosts(related);
            } else {
                setIsFound(false);
                console.log('Blog not found for slug:', slug);
                console.log('Available blog slugs:', posts
                    .filter((post: Post) => post.type === "blog")
                    .map((post: Post) => ({ original: post.slug, short: createShortSlug(post.title) }))
                );
            }
        }
    }, [posts, isLoading, slug]);

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
        if (!blog) return;

        // Create short, clean URL for sharing
        const shortSlug = createShortSlug(blog.title);
        const shareUrl = `${window.location.origin}/blog/${shortSlug}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: blog.excerpt || blog.title,
                    url: shareUrl,
                });
            } catch (error) {
                console.log("Error sharing:", error);
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl);
                alert("Link copied to clipboard!");
            } catch (error) {
                console.error("Failed to copy to clipboard:", error);
            }
        }
    };

    // Generate structured data for SEO
    const generateStructuredData = () => {
        if (!blog) return null;

        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": blog.title,
            "description": blog.excerpt || blog.title,
            "image": blog.bannerImage || "",
            "author": {
                "@type": "Person",
                "name": blog.author || "Admin"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Your Site Name" // Replace with your site name
            },
            "datePublished": blog.publishedAt || blog.createdAt,
            "dateModified": blog.updatedAt || blog.createdAt,
            "articleSection": blog.tags?.join(", ") || "",
            "keywords": blog.tags?.join(", ") || ""
        };

        return structuredData;
    };

    // Loading state
    if (isLoading) {
        return (
            <>
                <div className="min-h-screen flex justify-center items-center bg-gray-50">
                    <div className="text-center">
                        <div className="relative w-16 h-16 mx-auto mb-4">
                            <div className="absolute inset-0 border-4 rounded-full border-[#BDCDD6]"></div>
                            <div className="absolute inset-0 border-4 rounded-full border-[#6096B4] border-t-transparent animate-spin"></div>
                            <BiBook className="absolute inset-0 m-auto text-[#6096B4] w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Loading Article</h2>
                        <p className="text-gray-500">Please wait...</p>
                    </div>
                </div>
            </>
        );
    }

    // Blog not found
    if (!isFound || !blog) {
        return (
            <>
                <Head>
                    <title>Article Not Found</title>
                    <meta name="description" content="The article you're looking for doesn't exist." />
                    <meta name="robots" content="noindex, nofollow" />
                </Head>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center p-8">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex justify-center items-center mx-auto mb-6">
                            <BiBook className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Article Not Found</h2>
                        <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or has been moved.</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <FaArrowLeft className="w-4 h-4" />
                                Go Back
                            </button>
                            <Link href="/blog">
                                <button className="bg-[#6096B4] text-white px-6 py-2 rounded-lg hover:bg-[#6096B4]/90 transition-colors">
                                    All Articles
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{blog.title}</title>
                <meta name="description" content={blog.excerpt || blog.title} />
                <meta name="author" content={blog.author || "Admin"} />
                <meta name="keywords" content={blog.tags?.join(", ") || ""} />

                {/* Open Graph Meta Tags for Social Sharing */}
                <meta property="og:title" content={blog.title} />
                <meta property="og:description" content={blog.excerpt || blog.title} />
                <meta property="og:image" content={blog.bannerImage || ""} />
                <meta property="og:url" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${createShortSlug(blog.title)}`} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="Your Site Name" />

                {/* Twitter Card Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={blog.title} />
                <meta name="twitter:description" content={blog.excerpt || blog.title} />
                <meta name="twitter:image" content={blog.bannerImage || ""} />

                {/* Article Meta Tags */}
                <meta property="article:author" content={blog.author || "Admin"} />
                <meta property="article:published_time" content={blog.publishedAt || blog.createdAt} />
                <meta property="article:modified_time" content={blog.updatedAt || blog.createdAt} />
                <meta property="article:section" content={blog.tags?.join(", ") || ""} />
                {blog.tags?.map((tag, index) => (
                    <meta key={index} property="article:tag" content={tag} />
                ))}

                {/* Canonical URL */}
                <link rel="canonical" href={`${typeof window !== 'undefined' ? window.location.origin : ''}/Blog/${createShortSlug(blog.title)}`} />

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(generateStructuredData())
                    }}
                />
            </Head>

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
                                    <span>{blog.author || "Admin"}</span>
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

                    {/* Related Articles */}
                    {relatedPosts.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedPosts.map((post: Post) => (
                                    <Link key={post._id} href={`/blog/${createShortSlug(post.title)}`}>
                                        <div className="group cursor-pointer">
                                            {post.bannerImage && (
                                                <div
                                                    className="h-32 bg-cover bg-center bg-no-repeat rounded-lg mb-3"
                                                    style={{
                                                        backgroundImage: `linear-gradient(135deg, rgba(96, 150, 180, 0.6) 0%, rgba(189, 205, 214, 0.4) 100%), url('${post.bannerImage}')`
                                                    }}
                                                />
                                            )}
                                            <h4 className="font-semibold text-gray-900 group-hover:text-[#6096B4] transition-colors mb-2">
                                                {post.title}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(post.createdAt || post.publishedAt)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}