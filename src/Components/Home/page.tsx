"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import {Github, Linkedin, Twitter, MessageCircleCode} from "lucide-react"



gsap.registerPlugin(ScrollTrigger);

const BoxAnimate = () => {
  const groupRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        groupRef.current,
        { x: -200, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: groupRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full h-[80vh] flex justify-center items-start relative mr-16">
      <div ref={groupRef} className="flex items-center relative">
        {/* Circle overlapping on the left */}
        <div className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] lg:w-[350px] lg:h-[350px] rounded-full -mr-16 z-10">
          <img
            className="md:w-[200px] md:h-[200px] lg:h-[350px] lg:w-[350px]"
            src="./Assets/pp_image.png"
            alt="Profile Picture"
          />
        </div>

        {/* Rectangle */}
        <div className="w-[250px] h-[150px] md:w-[60%] md:h-[400px] lg:w-[850px] lg:h-[500px] bg-[#EEE9DA] rounded-2xl
        shadow-md p-6 md:p-10 flex flex-col ">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-light text-[#111827] mb-4 leading-snug max-w-[90%]">
            Hey! I'm <span className="font-semibold text-[#1f2937]">BHAWESH</span> - A
            <span className="font-semibold text-[#1f2937]"> PROGRAMMER</span> & LIFELONG{" "}
            <span className="font-semibold text-[#1f2937]">LEARNER</span>
          </h1>
          <p className="text-[10px] md:text-[14px] lg:text-[16px] text-gray-700 leading-relaxed mx-w-[90%]">
            I'm passionate about <span className="font-medium">technology</span>{" "}
            and always exploring new ways to build, solve, and create. Whether
            it's <span className="font-medium">writing clean code</span> or
            understanding how things work, I'm driven by curiosity and a love
            for continuous improvement.
          </p>
          <div className="flex flex-row mt-10 gap-32 items-center justify-start">
            {/* Left Column */}
            <div className="flex flex-col gap-5">
              {/* GitHub */}
              <div className="flex flex-row gap-3 items-center">
                <img className="w-[25px] h-[25px]" src="./Assets/github.svg" alt="GitHub" />
                <a className="text-sm md:text-base lg:text-lg" href="https://github.com/Bhawesh-Agrawal">Bhawesh-Agrawal</a>
              </div>
              {/* X/Twitter */}
              <div className="flex flex-row gap-3 items-center">
                <img className="w-[25px] h-[25px]" src="./Assets/x.svg" alt="Twitter" />
                <a className="text-sm md:text-base lg:text-lg" href="https://x.com/BhaweshAgr87299">BhaweshAgr87299</a>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-row items-center gap-3">
                <div className="w-[40px] flex justify-center">
                  <img className= "h-[25px] w-[25px]" src = "./Assets/Linkedin.svg"></img>
                </div>
                <a className="text-sm md:text-base lg:text-lg" href="https://www.linkedin.com/in/bhawesh-agrawal/">
                  bhawesh-agrawal
                </a>
              </div>

              <div className="flex flex-row items-center gap-3">
                <div className="w-[40px] flex justify-center">
                  <img className="h-[25px] object-contain" src="./Assets/kaggle.svg" alt="Kaggle" />
                </div>
                <a className="text-sm md:text-base lg:text-lg" href="https://www.kaggle.com/codexbhawesh">
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
