"use client";

import { useEffect, useRef, useState } from "react";
import { Trophy, Medal, Users, Code } from "lucide-react";

interface Achievement {
    title: string;
    subtitle: string;
    description: string;
    size: string;
    icon: React.ReactNode;
    category: string;
    color: string;
}

const achievements: Achievement[] = [
    {
        title: "Predicting Calorie Expenditure",
        subtitle: "Top 466 / 4316 | Kaggle Playground S5E5",
        description:
            "Built a machine learning model to predict daily calorie expenditure with strong performance in a global competition. Implemented advanced feature engineering and ensemble methods to achieve top 11% ranking.",
        size: "col-span-1",
        icon: <Medal className="w-6 h-6" />,
        category: "ML Competition",
        color: "#6366F1",
    },
    {
        title: "Xto10x Masai Hackathon Winner",
        subtitle: "1st Place among 150+ Teams",
        description:
            "Created an interactive playground to tweak hyperparameters and predict airline profitability. Recognized for exceptional UI/UX design and outstanding ML performance. Developed full-stack solution with real-time parameter tuning.",
        size: "col-span-2",
        icon: <Trophy className="w-6 h-6" />,
        category: "Hackathon",
        color: "#10B981",
    },
    {
        title: "School Sports Captain",
        subtitle: "Led & Organized Inter-school Events",
        description:
            "Managed multiple sports events and represented the school in various athletic activities. Demonstrated strong leadership and coordination skills while organizing tournaments with 500+ participants.",
        size: "col-span-1",
        icon: <Users className="w-6 h-6" />,
        category: "Leadership",
        color: "#3B82F6",
    },
    {
        title: "Best Project in Computer Science",
        subtitle: "Cricket Scoring App using Python",
        description:
            "Developed a comprehensive cricket scoring system with CLI in Python. Awarded as best project for combining complex logic and intuitive user interactivity. Featured advanced statistics tracking and match analysis.",
        size: "col-span-2",
        icon: <Code className="w-6 h-6" />,
        category: "Development",
        color: "#8B5CF6",
    },
];

export default function AchievementsSection() {
    const containerRef = useRef<HTMLElement | null>(null);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    useEffect(() => {
        const cards = document.querySelectorAll(".achievement-card");

        cards.forEach((card, index) => {
            const htmlCard = card as HTMLElement;
            htmlCard.style.opacity = "0";
            htmlCard.style.transform = "translateY(20px)";

            setTimeout(() => {
                htmlCard.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
                htmlCard.style.opacity = "1";
                htmlCard.style.transform = "translateY(0)";
            }, index * 100);
        });
    }, []);

    return (
        <section
            ref={containerRef}
            className="min-h-screen py-10 px-6 md:px-20 bg-gray-50 relative overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="absolute top-20 left-1/4 w-px h-64 bg-gradient-to-b from-blue-300 to-transparent"></div>
                <div className="absolute top-32 right-1/3 w-px h-48 bg-gradient-to-b from-purple-300 to-transparent"></div>
                <div className="absolute bottom-32 left-1/2 w-px h-56 bg-gradient-to-b from-green-300 to-transparent"></div>
            </div>

            <div className="max-w-8xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-left mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4 tracking-tight">
                        Achievements
                    </h1>
                </div>


                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {achievements.map((item, index) => (
                        <div
                            key={index}
                            className={`achievement-card ${item.size} group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl`}
                            style={{
                                minHeight: "300px",
                                boxShadow:
                                    hoveredCard === index
                                        ? `0 16px 32px -8px ${item.color}20`
                                        : "0 4px 16px -4px rgba(0,0,0,0.1)",
                            }}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {/* Top Accent */}
                            <div
                                className="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
                                style={{ backgroundColor: item.color }}
                            ></div>

                            {/* Card Content */}
                            <div className="relative p-6 h-full flex flex-col">
                                {/* Icon and Tag */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div
                                        className="p-3 rounded-xl"
                                        style={{ backgroundColor: `${item.color}15` }}
                                    >
                                        <div style={{ color: item.color }}>{item.icon}</div>
                                    </div>
                                    <span
                                        className="text-sm font-semibold uppercase tracking-wide"
                                        style={{ color: item.color }}
                                    >
                    {item.category}
                  </span>
                                </div>

                                <h3 className="text-2xl font-bold mb-2 leading-tight text-gray-800">
                                    {item.title}
                                </h3>

                                <p className="text-base font-medium mb-4 text-gray-600">
                                    {item.subtitle}
                                </p>

                                <div className="flex-grow">
                                    <p className="text-base leading-relaxed text-gray-700">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <div
                                    className="absolute inset-0 rounded-2xl"
                                    style={{
                                        background: `linear-gradient(135deg, ${item.color}05 0%, transparent 50%)`,
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
