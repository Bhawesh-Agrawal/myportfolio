"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { useEffect, useRef } from "react";
import { FaGithub, FaExternalLinkAlt, FaCode } from "react-icons/fa";

interface ProjectCardProps {
    id: Id<"blog">;
    title: string;
    slug: string;
    bannerImage: string | null;
    tags: string[];
    github: string | null;
    website?: string | null;
}

const tagColors = [
    "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    "bg-gradient-to-r from-green-500 to-green-600 text-white",
    "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
    "bg-gradient-to-r from-pink-500 to-pink-600 text-white",
    "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white",
    "bg-gradient-to-r from-red-500 to-red-600 text-white",
    "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
    "bg-gradient-to-r from-teal-500 to-teal-600 text-white",
];

export default function ProjectCard({
                                        id,
                                        title,
                                        slug,
                                        bannerImage,
                                        tags = [],
                                        github,
                                        website,
                                    }: ProjectCardProps) {
    const router = useRouter();
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in-up');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleClick = () => {
        router.push(`/Project/${id}`);
    };

    return (
        <div
            ref={cardRef}
            className="group cursor-pointer opacity-0 translate-y-8 hover:scale-[1.02] transition-all duration-500 ease-out h-full"
            onClick={handleClick}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 backdrop-blur-sm h-full flex flex-col">
                {/* Image Container - Fixed Height */}
                {bannerImage ? (
                    <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                        <Image
                            src={bannerImage}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                ) : (
                    <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                        <FaCode className="w-12 h-12 text-gray-400" />
                    </div>
                )}

                {/* Content - Flexible with fixed structure */}
                <div className="p-6 flex flex-col flex-grow">
                    {/* Title - Fixed Height */}
                    <div className="h-14 mb-3">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-7">
                            {title}
                        </h3>
                    </div>

                    {/* Slug - Fixed Height */}
                    <div className="h-10 mb-2 mt-6">
                        <p className="text-gray-500 text-sm line-clamp-2 leading-5">
                            {slug}
                        </p>
                    </div>

                    {/* Tags - Fixed Height */}
                    <div className="h-16 flex flex-wrap gap-2 content-start">
                        {tags.slice(0, 3).map((tag, i) => (
                            <span
                                key={`${tag}-${i}`}
                                className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm h-fit ${
                                    tagColors[i % tagColors.length]
                                }`}
                            >
                                {tag}
                            </span>
                        ))}
                        {tags.length > 3 && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 h-fit">
                                +{tags.length - 3}
                            </span>
                        )}
                    </div>

                    {/* Links - Push to bottom */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-auto">
                        {github && (
                            <a
                                href={github}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                            >
                                <FaGithub className="w-4 h-4" />
                                Code
                            </a>
                        )}
                        {website && (
                            <a
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                                <FaExternalLinkAlt className="w-3 h-3" />
                                Live
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(2rem);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
}