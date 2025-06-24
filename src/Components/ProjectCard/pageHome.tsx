"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { useEffect, useRef } from "react";
import gsap from "gsap";

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
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-red-100 text-red-800",
];

export default function ProjectHome({
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
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );
        }
    }, []);

    const handleClick = () => {
        router.push(`/Project/${id}`);
    };

    return (
        <div
            ref={cardRef}
            onClick={handleClick}
            className="cursor-pointer w-full md:w-full mx-auto shadow-lg hover:shadow-2xl bg-gradient-to-br from-white to-gray-50 transition-shadow duration-300 overflow-hidden"
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            {bannerImage && (
                <div className="relative w-full h-64 md:h-80">
                    <Image
                        src={bannerImage}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            <div className="p-6 space-y-4">
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                    {title}
                </h1>

                <p className="text-gray-600 text-sm italic">{slug}</p>

                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                        <span
                            key={`${tag}-${i}`}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${tagColors[i % tagColors.length]}`}
                        >
              #{tag}
            </span>
                    ))}
                </div>

                <div className="flex items-center gap-4 pt-2">
                    {github && (
                        <a
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 text-sm font-semibold hover:underline"
                        >
                            GitHub ↗
                        </a>
                    )}
                    {website && (
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-green-600 text-sm font-semibold hover:underline"
                        >
                            Visit Site ↗
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
