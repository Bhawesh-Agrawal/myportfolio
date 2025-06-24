"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const HeroText = () => {
    const leftTextRef = useRef<HTMLParagraphElement>(null);
    const rightTextRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        gsap.fromTo(
            leftTextRef.current,
            { x: -100, opacity: 0 },
            {
                x: -180, // Simulates Tailwind's -translate-x-[43%]
                opacity: 1,
                duration: 1.5,
                ease: "power3.out",
            }
        );

        gsap.fromTo(
            rightTextRef.current,
            { x: 100, y : -50, opacity: 0 },
            {
                x: 150, // Simulates Tailwind's translate-x-[30%]
                opacity: 1,
                duration: 1.5,
                ease: "power3.out",
            }
        );
    }, []);

    return (
        <div className="relative w-full min-h-[30vh] flex items-start justify-center overflow-hidden">
            {/* Beyond Vision - slides in from right */}
            <p
                ref={rightTextRef}
                className="absolute text-[clamp(3rem,8vw,9rem)] text-[#BDCDD6] font-normal top-[10%]"
            >
                Beyond Vision
            </p>

            {/* Within Reach - slides in from left */}
            <p
                ref={leftTextRef}
                className="absolute text-[clamp(2.8rem,7vw,8rem)] text-[#6096B4] font-normal top-[23%]"
            >
                Within Reach
            </p>
        </div>
    );
};

export default HeroText;
