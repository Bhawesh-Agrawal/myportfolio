"use client"

import { useEffect, useRef } from "react";
import { usePosts } from "@/Components/StoreContext/postContext";
import ProjectCard from "@/Components/ProjectCard/pageHome";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LandingProjectsSlider = () => {
    const { posts, isLoading } = usePosts();
    const sliderRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        if (!sliderRef.current || isLoading) return;

        // Use gsap context to scope animations
        const ctx = gsap.context(() => {
            itemsRef.current.forEach((el, i) => {
                if (!el) return;

                const fromX = i % 2 === 0 ? -200 : 200;

                gsap.fromTo(
                    el,
                    { opacity: 0, x: fromX },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play reverse play reverse",
                            // markers: true,
                        },
                    }
                );
            });
        }, sliderRef);

        // Cleanup only this component's animations on unmount
        return () => ctx.revert();
    }, [isLoading, posts]);

    const topProjects = posts.filter((p) => p.type === "project").slice(0, 4);

    return (
        <section ref={sliderRef} className="w-full flex flex-col py-12">
            <p className="mt-3 mb-10 font-bold text-6xl md:text-8xl md:text-left text-center md:ml-5 ml-0 px-4 md:px-0 text-[#6096B4]">Projects</p>
            {topProjects.map((post, index) => (
                <div
                    key={post._id}
                    ref={(el) => {
                        itemsRef.current[index] = el;
                    }}
                    className={`relative ${
                        index % 2 === 0
                            ? "md:self-start self-center md:w-[60vw] w-[90vw] md:ml-0 ml-0"
                            : "md:self-end self-center md:w-[60vw] w-[90vw] md:mr-0 mr-0"
                    } mb-12`}
                    style={{ willChange: "transform, opacity" }}
                >
                    <ProjectCard
                        id={post._id}
                        title={post.title}
                        slug={post.slug || ""}
                        bannerImage={post.bannerImage || null}
                        tags={post.tags || []}
                        github={post.projectLinks?.github || null}
                        website={post.projectLinks?.website || null}
                    />
                </div>
            ))}
        </section>
    );
};

export default LandingProjectsSlider;