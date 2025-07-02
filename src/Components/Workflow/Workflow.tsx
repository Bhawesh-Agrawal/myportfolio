"use client"
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedLine = () => {
    const pathRef = useRef<SVGPathElement | null>(null);


    useEffect(() => {
        const path = pathRef.current;
        if (!path) return; // Error handling

        const length = path.getTotalLength();

        // Set initial stroke properties
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

        // Animate based on scroll
        gsap.to(path, {
            strokeDashoffset: 0,
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 2,
            },
        });

        // Cleanup ScrollTrigger on unmount
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <svg
            viewBox="0 0 1561 2339"
            className="hidden md:block w-full h-[200vh] absolute top-15 left-0"
            preserveAspectRatio="xMidYMin meet"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                ref={pathRef}
                d="M221.5 0.5C350.7 306.1 431 386.5 442 318C453 249.5 426.545 139.355 335.5 249.5C244.455 359.645 901.5 956 918.5 990C935.5 1024 1569.7 1322.94 1463.5 1512C1422.3 1721.6 1135 1852 1091 1852C1047 1852 1144.5 1635.5 1226 1713.5C1307.5 1791.5 962 2110.5 1560 1852C627.6 2032.8 677.5 2099 770.5 2154C863.5 2209 859.582 2071.14 694.5 2045.5C55.6391 1977.48 117.611 2147.4 1 2338"
                stroke="#64748B"
                strokeWidth="16"
                fill="none"
            />
        </svg>
    );
};

export default AnimatedLine;