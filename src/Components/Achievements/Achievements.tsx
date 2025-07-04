"use client";

import { useEffect, useRef, useState } from "react";
import { Trophy, Medal, Users, Code, Award, Target, Star, Zap, Crown, Sparkles, ChevronRight } from "lucide-react";

interface Achievement {
    title: string;
    subtitle: string;
    description: string;
    size: string;
    icon: React.ReactNode;
    category: string;
    color: string;
    rank: string;
}

const achievements: Achievement[] = [
    {
        title: "Predicting Calorie Expenditure",
        subtitle: "Top 466 / 4316 | Kaggle Playground S5E5",
        description:
            "Built a machine learning model to predict daily calorie expenditure with strong performance in a global competition. Implemented advanced feature engineering and ensemble methods to achieve top 11% ranking.",
        size: "col-span-1",
        icon: <Medal className="w-7 h-7" />,
        category: "ML Competition",
        color: "#FF6B6B",
        rank: "TOP 11%"
    },
    {
        title: "Xto10x Masai Hackathon Winner",
        subtitle: "1st Place among 150+ Teams",
        description:
            "Created an interactive playground to tweak hyperparameters and predict airline profitability. Recognized for exceptional UI/UX design and outstanding ML performance. Developed full-stack solution with real-time parameter tuning.",
        size: "col-span-2",
        icon: <Trophy className="w-7 h-7" />,
        category: "Hackathon",
        color: "#4ECDC4",
        rank: "1st PLACE"
    },
    {
        title: "School Sports Captain",
        subtitle: "Led & Organized Inter-school Events",
        description:
            "Managed multiple sports events and represented the school in various athletic activities. Demonstrated strong leadership and coordination skills while organizing tournaments with 500+ participants.",
        size: "col-span-1",
        icon: <Users className="w-7 h-7" />,
        category: "Leadership",
        color: "#45B7D1",
        rank: "CAPTAIN"
    },
    {
        title: "Best Project in Computer Science",
        subtitle: "Cricket Scoring App using Python",
        description:
            "Developed a comprehensive cricket scoring system with CLI in Python. Awarded as best project for combining complex logic and intuitive user interactivity. Featured advanced statistics tracking and match analysis.",
        size: "col-span-2",
        icon: <Code className="w-7 h-7" />,
        category: "Development",
        color: "#96CEB4",
        rank: "BEST PROJECT"
    },
];

export default function AchievementsSection() {
    const containerRef = useRef<HTMLElement | null>(null);
    const [expanded, setExpanded] = useState<boolean[]>(
        Array(achievements.length).fill(false)
    );
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    useEffect(() => {
        const cards = document.querySelectorAll(".achievement-card");

        cards.forEach((card, index) => {
            const htmlCard = card as HTMLElement;
            htmlCard.style.opacity = '0';
            htmlCard.style.transform = 'translateY(30px)';

            setTimeout(() => {
                htmlCard.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                htmlCard.style.opacity = '1';
                htmlCard.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }, []);

    const toggleReadMore = (index: number) => {
        setExpanded((prev) => {
            const copy = [...prev];
            copy[index] = !copy[index];
            return copy;
        });
    };

    return (
        <section
            ref={containerRef}
            className="min-h-screen py-12 px-6 md:px-20 bg-white relative overflow-hidden"
        >
            {/* Subtle flowing background */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
                <div className="absolute top-10 left-1/4 w-1 h-96 bg-gradient-to-b from-blue-200 via-purple-200 to-transparent transform rotate-12"></div>
                <div className="absolute top-32 right-1/3 w-1 h-64 bg-gradient-to-b from-green-200 via-teal-200 to-transparent transform -rotate-12"></div>
                <div className="absolute bottom-20 left-1/2 w-1 h-72 bg-gradient-to-b from-orange-200 via-red-200 to-transparent transform rotate-6"></div>
            </div>

            <div className="max-w-8xl mx-auto relative z-10">
                {/* Header - Matching Projects Section Style */}
                <div className="text-left mb-12">
                    <p className="font-bold text-6xl md:text-8xl md:text-left text-center md:ml-5 ml-0 px-4 md:px-0 text-[#6096B4]">
                        Achievements
                    </p>
                </div>

                {/* Achievements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
                    {achievements.map((item, index) => (
                        <div
                            key={index}
                            className={`achievement-card ${item.size} group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] cursor-pointer transform-gpu bg-white border-2 border-slate-100 hover:border-slate-200`}
                            style={{
                                minHeight: '300px',
                                boxShadow: hoveredCard === index
                                    ? `0 20px 40px -12px ${item.color}20, 0 0 0 1px ${item.color}15`
                                    : '0 4px 20px -4px rgba(0,0,0,0.08)'
                            }}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {/* Subtle gradient overlay on hover */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl"
                                style={{ backgroundColor: item.color }}
                            ></div>

                            {/* Floating color accent */}
                            <div
                                className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform translate-x-8 -translate-y-8"
                                style={{ backgroundColor: item.color }}
                            ></div>

                            {/* Content */}
                            <div className="relative p-8 h-full flex flex-col">
                                {/* Badge */}
                                <div
                                    className="absolute -top-3 -right-3 px-4 py-2 rounded-full text-xs font-black shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300 text-white"
                                    style={{ backgroundColor: item.color }}
                                >
                                    {item.rank}
                                </div>

                                {/* Icon & Category */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div
                                        className="p-4 rounded-2xl transform group-hover:scale-110 transition-transform duration-300"
                                        style={{ backgroundColor: `${item.color}15` }}
                                    >
                                        <div style={{ color: item.color }}>
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div
                                        className="px-4 py-2 rounded-full text-white text-sm font-bold"
                                        style={{ backgroundColor: item.color }}
                                    >
                                        {item.category}
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-black mb-3 leading-tight text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                                    {item.title}
                                </h3>

                                {/* Subtitle */}
                                <p className="text-sm font-semibold mb-4 text-slate-600">
                                    {item.subtitle}
                                </p>

                                {/* Description */}
                                <div className="flex-grow">
                                    <p className="text-sm leading-relaxed text-slate-700">
                                        {expanded[index]
                                            ? item.description
                                            : item.description.slice(0, 100) +
                                            (item.description.length > 100 ? "..." : "")}
                                    </p>
                                </div>

                                {/* Action Button */}
                                {item.description.length > 100 && (
                                    <div className="mt-6">
                                        <button
                                            onClick={() => toggleReadMore(index)}
                                            className="flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:scale-105 transform group/btn"
                                            style={{ color: item.color }}
                                        >
                                            {expanded[index] ? "Show Less" : "Read More"}
                                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Subtle animated border on hover */}
                            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                <div
                                    className="absolute inset-0 rounded-3xl animate-pulse"
                                    style={{
                                        border: `1px solid ${item.color}30`,
                                        boxShadow: `inset 0 0 20px ${item.color}10`
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}