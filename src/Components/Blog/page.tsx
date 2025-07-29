"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { usePosts } from "@/Components/StoreContext/postContext";
import gsap from "gsap";

// Helper functions
const calculateReadTime = (content: string | undefined) => {
    if (!content) return "5 min read";
    const words = content.trim().split(/\s+/).length;
    return `${Math.ceil(words / 200)} min read`;
};

const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

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

export default function BlogComponent() {
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const [animationComplete, setAnimationComplete] = useState(false);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    const { posts, isLoading } = usePosts();
    const topProjects = posts.filter((p) => p.type === "blog").slice(0, 4);

    useEffect(() => {
        cardsRef.current = [];
        setAnimationComplete(false);
    }, [topProjects.length]);

    useEffect(() => {
        if (topProjects.length === 0 || isLoading) return;

        const animateCards = () => {
            if (timelineRef.current) timelineRef.current.kill();

            const validCards = cardsRef.current.filter(Boolean);
            if (validCards.length === 0) return;

            timelineRef.current = gsap.timeline({
                onComplete: () => setAnimationComplete(true)
            });

            gsap.set(validCards, {
                opacity: 0,
                y: 30,
                scale: 0.95
            });

            timelineRef.current.to(validCards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.1
            });
        };

        const rafId = requestAnimationFrame(animateCards);

        return () => {
            cancelAnimationFrame(rafId);
            if (timelineRef.current) timelineRef.current.kill();
        };
    }, [topProjects.length, isLoading]);

    const handleReadMore = (slug: string) => {
        window.location.href = `/Blog/${slug}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <span className="text-gray-500">Loading...</span>
            </div>
        );
    }

    return (
        <section className="bg-gray-50 py-16 px-6 md:px-20">
            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <div className="mb-16 w-full">
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4 tracking-tight">
                        My Blog
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Home to some of the most wonderful thoughts, insights, and stories
                        from my journey in tech and beyond.
                    </p>
                </div>

                {/* Blog Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {topProjects.map((post, idx) => {
                        const shortSlug = createShortSlug(post.title);
                        return (
                            <div
                                key={post._id}
                                ref={(el) => {
                                    if (el) cardsRef.current[idx] = el;
                                }}
                                onClick={() => handleReadMore(shortSlug)}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col cursor-pointer transform-gpu"
                                style={{
                                    transition: animationComplete
                                        ? 'box-shadow 0.3s ease, border-color 0.3s ease'
                                        : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (animationComplete) {
                                        gsap.to(e.currentTarget, {
                                            y: -4,
                                            scale: 1.02,
                                            duration: 0.3,
                                            ease: "power2.out"
                                        });
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (animationComplete) {
                                        gsap.to(e.currentTarget, {
                                            y: 0,
                                            scale: 1,
                                            duration: 0.3,
                                            ease: "power2.out"
                                        });
                                    }
                                }}
                            >
                                {/* Image */}
                                <div className="relative overflow-hidden h-[220px] bg-gray-200">
                                    <img
                                        src={post.bannerImage || "/blog banner.png"}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                        style={{
                                            transition: animationComplete
                                                ? 'transform 0.5s ease'
                                                : 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (animationComplete) {
                                                gsap.to(e.currentTarget, {
                                                    scale: 1.05,
                                                    duration: 0.5,
                                                    ease: "power2.out"
                                                });
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (animationComplete) {
                                                gsap.to(e.currentTarget, {
                                                    scale: 1,
                                                    duration: 0.5,
                                                    ease: "power2.out"
                                                });
                                            }
                                        }}
                                    />
                                </div>

                                {/* Text Content */}
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex items-center gap-3 mb-1 text-xs text-gray-500">
                                        <span className="flex items-center gap-[2px]">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(post.createdAt)}
                                        </span>
                                        <span className="flex items-center gap-[2px]">
                                            <Clock className="w-3 h-3" />
                                            {calculateReadTime(post.content)}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-800 mb-1 leading-snug line-clamp-2"
                                        style={{
                                            transition: animationComplete
                                                ? 'color 0.2s ease'
                                                : 'none'
                                        }}>
                                        {post.title}
                                    </h3>

                                    <p className="text-base text-gray-600 mb-2 line-clamp-2">
                                        {post.slug}
                                    </p>

                                    <div className="flex flex-wrap gap-[6px] mb-1 mt-2">
                                        {post.tags.slice(0, 2).map((tag, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-[3px] px-2 py-[3px] bg-gray-100 text-gray-700 text-md font-medium rounded-full leading-none h-6"
                                            >
                                                <Tag className="w-3 h-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 text-blue-600 font-medium text-md mt-3">
                                        <span>Read more</span>
                                        <ArrowRight
                                            className="w-3 h-3 transform-gpu"
                                            style={{
                                                transition: animationComplete
                                                    ? 'transform 0.2s ease'
                                                    : 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* View All Posts Button */}
                {topProjects.length > 0 && (
                    <div className="text-center mt-12">
                        <button
                            onClick={() => (window.location.href = "/Blog")}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                        >
                            View All Posts
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
