"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sections = [
    { id: "about", label: "About" },
    { id: "framework", label: "Framework" },
    { id: "education", label: "Education" },
    { id: "project", label: "Project" },
    { id: "tweets", label: "Tweets" },
    { id: "blogs", label: "Blogs" },
    { id: "connect", label: "Connect" },
];

const NavigationLeft = () => {
    const [active, setActive] = useState("about");

    useEffect(() => {
        sections.forEach((section) => {
            ScrollTrigger.create({
                trigger: `#${section.id}`,
                start: "top center",
                end: "bottom center",
                onEnter: () => setActive(section.id),
                onEnterBack: () => setActive(section.id),
            });
        });

        setTimeout(()=>{
            ScrollTrigger.refresh();
        }, 100);

        return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }, []);

    return (
        <div className="fixed top-1/2 -translate-y-1/2 left-4 z-50 flex flex-col items-start gap-5">
            {sections.map((section) => (
                <p
                    key={section.id}
                    className={`transition-all duration-300 origin-left ${
                        active === section.id
                            ? "text-xl scale-125 font-bold text-black"
                            : "text-sm opacity-50"
                    }`}
                >
                    {section.label}
                </p>
            ))}
        </div>
    );
};

export default NavigationLeft;
