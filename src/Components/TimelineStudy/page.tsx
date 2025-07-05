'use client';

import { useEffect, useRef } from 'react';
import { timeline } from './timeline';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type TimelineItem = {
    range: string;
    school: string;
    course: string;
    context: string;
    logo:string;
    link: string;
};

gsap.registerPlugin(ScrollTrigger);

const TimelineStudy = () => {
    const lineRef = useRef(null);
    const itemsRef = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        // Animate vertical line grow
        gsap.fromTo(
            lineRef.current,
            { height: 0 },
            {
                height: '70%',
                duration: 1.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: lineRef.current,
                    start: 'top 80%',
                },
            }
        );

        // Animate timeline boxes from sides
        itemsRef.current.forEach((el, i) => {
            if (!el) return;

            const fromX = i % 2 === 0 ? -100 : 100;

            gsap.fromTo(
                el,
                { opacity: 0, x: fromX },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                    },
                }
            );
        });
    }, []);

    return (
        <div className="relative w-full max-w-6xl mx-auto px-4 mt-5">
            {/* Header */}
            <h2 className="text-3xl font-bold text-center text-gray-800">My Road to Glory!</h2>
            <p className="text-center text-gray-500 text-sm mt-2 mb-16">
                Below is a timeline showcasing my journey to where I stand.
            </p>

            {/* Center vertical line */}
            <div
                className="absolute top-50 left-1/2 transform -translate-x-1/2 w-1 bg-gray-500 z-0"
                ref={lineRef}
                style={{ height: '0%' }}
            />

            {/* Timeline items */}
            <div className="relative z-10 flex flex-col gap-12">
                {timeline.map((item: TimelineItem, index: number) => (
                    <div
                        key={index}
                        className={`flex w-full ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                        ref={(el) => {
                            itemsRef.current[index] = el;
                        }}
                    >
                        <div
                            className={`relative w-full sm:w-[48%] p-6 bg-white rounded-xl shadow-md border border-gray-200 ${
                                index % 2 === 0 ? 'ml-0 mr-auto' : 'ml-auto mr-0'
                            }`}
                        >
                            {/* Date centered above */}
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium bg-white px-2 py-0.5 rounded">
                                {item.range}
                            </div>

                            <div className= "flex flex-row justify-between items-center">
                                <div className="flex flex-col justify-center items-start">
                                    <h3 className="font-semibold text-lg text-gray-800">{item.course}</h3>
                                    <p className="text-sm text-gray-500">{item.school}</p>
                                </div>
                                <div>
                                    <img className= "size-16" src={item.logo} alt="" />
                                </div>
                            </div>

                            <p className="text-gray-600">{item.context}</p>
                            {/* You might want to make the "Learn More" a proper link */}
                            {/* <Link href="/some-details-page"> */}
                            <a className="mt-4 inline-block text-blue-500 hover:underline" href={item.link}>
                                Learn More
                            </a>
                            {/* </Link> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineStudy;
