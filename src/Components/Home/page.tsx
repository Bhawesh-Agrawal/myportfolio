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
      <div className="w-full h-[80vh] flex justify-center items-start relative mr-4 md:mr-16">
        <div
            ref={groupRef}
            className="flex flex-col md:flex-row items-center relative transition-all duration-1000 ease-out will-change-transform will-change-opacity"
            style={{ transform: "translateX(-200px)", opacity: 0 }}
        >
          {/* Circle overlapping on the left (desktop) / on top (mobile) */}
          <div className="relative w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:w-[350px] lg:h-[350px] rounded-full mb-6 md:mb-0 md:-mr-16 z-10">
            <img
                className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:h-[350px] lg:w-[350px] rounded-full object-cover"
                src="./Assets/pp_image.png"
                alt="Profile Picture"
                loading="eager"
            />

            {/* Decorative balls */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse opacity-80"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce opacity-60"></div>
          </div>

          {/* Rectangle */}
          <div className="w-[350px] h-auto min-h-[300px] md:w-[60%] md:h-[400px] lg:w-[850px] lg:h-[500px] bg-[#EEE9DA] rounded-2xl shadow-md p-6 md:p-6 lg:p-10 flex flex-col">
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-light text-[#111827] mb-4 leading-snug max-w-[90%]">
              Hey! I'm <span className="font-semibold text-[#1f2937]">BHAWESH</span> - A
              <span className="font-semibold text-[#1f2937]"> PROGRAMMER</span> & LIFELONG{" "}
              <span className="font-semibold text-[#1f2937]">LEARNER</span>
            </h1>
            <p className="text-sm md:text-[14px] lg:text-[16px] text-gray-700 leading-relaxed max-w-[95%] mb-6 md:mb-0">
              I'm passionate about <span className="font-medium">technology</span>{" "}
              and always exploring new ways to build, solve, and create. Whether
              it's <span className="font-medium">writing clean code</span> or
              understanding how things work, I'm driven by curiosity and a love
              for continuous improvement.
            </p>

            <div className="flex flex-col md:flex-row mt-6 md:mt-10 gap-6 md:gap-32 items-start md:items-center justify-start">
              {/* Left Column */}
              <div className="flex flex-col gap-4 md:gap-5">
                {/* GitHub */}
                <div className="flex flex-row gap-3 items-center">
                  <img className="w-[25px] h-[25px]" src="./Assets/github.svg" alt="GitHub" />
                  <a className="text-base md:text-base lg:text-lg hover:underline" href="https://github.com/Bhawesh-Agrawal">Bhawesh-Agrawal</a>
                </div>
                {/* X/Twitter */}
                <div className="flex flex-row gap-3 items-center">
                  <img className="w-[25px] h-[25px]" src="./Assets/x.svg" alt="Twitter" />
                  <a className="text-base md:text-base lg:text-lg hover:underline" href="https://x.com/BhaweshAgr87299">BhaweshAgr87299</a>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-4 md:gap-5">
                <div className="flex flex-row items-center gap-3">
                  <div className="w-[40px] flex justify-center">
                    <img className="h-[25px] w-[25px]" src="./Assets/linkedin.svg" alt="LinkedIn" />
                  </div>
                  <a className="text-base md:text-base lg:text-lg hover:underline" href="https://www.linkedin.com/in/bhawesh-agrawal/">
                    bhawesh-agrawal
                  </a>
                </div>

                <div className="flex flex-row items-center gap-3">
                  <div className="w-[40px] flex justify-center">
                    <img className="h-[25px] object-contain" src="./Assets/kaggle.svg" alt="Kaggle" />
                  </div>
                  <a className="text-base md:text-base lg:text-lg hover:underline" href="https://www.kaggle.com/codexbhawesh">
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
