"use client";

import { useEffect, useRef } from "react";

const BoxAnimate = () => {
  const groupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const node = groupRef.current;
      if (!node) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            node.style.transform = "translateX(0)";
            node.style.opacity = "1";
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(node);

      return () => observer.disconnect();
    }, 100); // Slight delay to reduce layout jank

    return () => clearTimeout(timeout);
  }, []);

  return (
    // Use padding instead of margin to prevent overflow issues
    <div className="w-full min-h-[80vh] flex justify-center items-center relative p-4">
      <div
        ref={groupRef}
        className="flex flex-col md:flex-row items-center relative transition-all duration-1000 ease-out will-change-transform will-change-opacity max-w-6xl w-full"
        style={{ transform: "translateX(-200px)", opacity: 0 }}
      >
        {/* Circle overlapping on the left (desktop) / on top (mobile) */}
        <div className="relative w-[130px] h-[130px] md:w-[200px] md:h-[200px] lg:w-[350px] lg:h-[350px] rounded-full mb-6 md:mb-0 md:-mr-16 z-10 flex-shrink-0">
          <img
            className="w-full h-full rounded-full object-cover"
            src="./Personal_image.jpg"
            alt="Profile Picture"
            loading="eager"
          />

          {/* Decorative balls */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse opacity-80"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce opacity-60"></div>
        </div>

        {/* Rectangle */}
        <div className="w-full bg-[#EEE9DA] rounded-2xl shadow-lg p-8 md:pl-32 lg:p-12 lg:pl-18 flex flex-col justify-center min-h-[400px]">
          {/* --- FIX: Added new job titles --- */}
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-light text-[#111827] mb-4 leading-tight">
            Hey! I'm <span className="font-semibold text-[#1f2937]">BHAWESH</span> - A
            <span className="font-semibold text-[#1f2937]"> Software Developer</span>,
            <span className="font-semibold text-[#1f2937]"> AI/ML Engineer</span> & Lifelong{" "}
            <span className="font-semibold text-[#1f2937]">LEARNER</span>
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed max-w-prose">
            I'm passionate about <span className="font-medium">technology</span>{" "}
            and always exploring new ways to build, solve, and create. Whether
            it's <span className="font-medium">writing clean code</span> or
            understanding how things work, I'm driven by curiosity and a love
            for continuous improvement.
          </p>

          {/* --- FIX: Reduced gap and added flex-wrap to prevent overflow --- */}
          <div className="flex flex-row flex-wrap mt-8 md:mt-10 gap-x-12 gap-y-4 items-center justify-start">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-3 items-center">
                <img className="w-[25px] h-[25px]" src="./Assets/github.svg" alt="GitHub" />
                <a className="text-base lg:text-lg hover:underline" href="https://github.com/Bhawesh-Agrawal">Bhawesh-Agrawal</a>
              </div>
              <div className="flex flex-row gap-3 items-center">
                <img className="w-[25px] h-[25px]" src="./Assets/x.svg" alt="Twitter" />
                <a className="text-base lg:text-lg hover:underline" href="https://x.com/BhaweshAgr87299">BhaweshAgr87299</a>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-3">
                <img className="h-[25px] w-[25px]" src="./Assets/linkedin.svg" alt="LinkedIn" />
                <a className="text-base lg:text-lg hover:underline" href="https://www.linkedin.com/in/bhawesh-agrawal/">
                  bhawesh-agrawal
                </a>
              </div>
              <div className="flex flex-row items-center gap-3">
                <img className="h-[25px] object-contain" src="./Assets/kaggle.svg" alt="Kaggle" />
                <a className="text-base lg:text-lg hover:underline" href="https://www.kaggle.com/codexbhawesh">
                  codexbhawesh
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxAnimate;