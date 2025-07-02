"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {top} from "@popperjs/core";

const HeroText = () => {
    const leftTextRef = useRef<HTMLParagraphElement>(null);
    const rightTextRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        // Get viewport width for responsive calculations
        const vw = window.innerWidth;

        // Calculate dynamic positions based on screen size
        const leftEndX = vw < 768 ? -vw * 0.1 : -180; // 25% of viewport width on mobile, fixed on desktop
        const rightEndX = vw < 768 ? vw * 0.06 : 150;   // 20% of viewport width on mobile, fixed on desktop
        const topY = vw < 768 ? -20 : -50;

        gsap.fromTo(
            leftTextRef.current,
            { x: -100, opacity: 0 },
            {
                x: leftEndX,
                opacity: 1,
                duration: 1.5,
                ease: "power3.out",
            }
        );

        gsap.fromTo(
            rightTextRef.current,
            { x: 100, y: topY, opacity: 0 },
            {
                x: rightEndX,
                opacity: 1,
                duration: 1.5,
                ease: "power3.out",
            }
        );
    }, []);

    return (
        <div className="relative w-full min-h-[10vh] md:min-h-[30vh] flex items-start justify-center overflow-hidden">
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