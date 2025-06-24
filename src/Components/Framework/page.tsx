'use client'

import { HTMLAttributes, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { cn } from '../lib/utils'

const LOGOS = [
    './framework/html.svg',
    './framework/css.svg',
    './framework/javascript.svg',
    './framework/nodejs.svg',
    './framework/nextjs.svg',
    './framework/vercel.svg',
    './framework/python.svg',
    './framework/pytorch.svg',
    './framework/tensorflow.svg',
    './framework/keras.svg',
    './framework/react.svg',
    './framework/sql.svg',
    './framework/scikit-learn.png',
];
function splitArray<T>(array: Array<T>, numParts: number) {
    const result: Array<Array<T>> = []

    for (let i = 0; i < array.length; i++) {
        const index = i % numParts
        if (!result[index]) {
            result[index] = []
        }
        result[index].push(array[i])
    }

    return result
}

function ReviewRow({
                       logos,
                       className,
                       logoClassName,
                       msPerPixel = 0,
                   }: {
    logos: string[]
    className?: string
    logoClassName?: (logoIndex: number) => string
    msPerPixel?: number
}) {
    const rowRef = useRef<HTMLDivElement | null>(null)
    const [rowWidth, setRowWidth] = useState(0)
    const duration = `${rowWidth * msPerPixel}ms`

    useEffect(() => {
        if (!rowRef.current) return

        const resizeObserver = new window.ResizeObserver(() => {
            setRowWidth(rowRef.current?.offsetWidth ?? 0)
        })

        resizeObserver.observe(rowRef.current)

        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    return (
        <div
            ref={rowRef}
            className={cn('flex animate-marquee-horizontal gap-8 py-4', className)}
            style={{ '--marquee-duration': duration } as React.CSSProperties}
        >
            {logos.concat(logos).map((imgSrc, index) => (
                <div
                    key={index}
                    className={cn(
                        'animate-fade-in opacity-0 w-24 h-24 flex-shrink-0',
                        logoClassName?.(index % logos.length)
                    )}
                    style={{
                        animationDelay: `${(index % 6) * 0.1}s`,
                    }}
                >
                    <img src={imgSrc} alt={`Logo ${index}`} className="w-full h-full object-contain" />
                </div>
            ))}
        </div>
    )
}

function ReviewGrid() {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const isInView = useInView(containerRef, { once: true, amount: 0.3 })
    const [row1, row2] = splitArray(LOGOS, 2)

    return (
        <div
            ref={containerRef}
            className="relative space-y-6 overflow-hidden h-[18rem] max-w-full mx-auto"
        >
            {isInView && (
                <>
                    <ReviewRow logos={row1} msPerPixel={10} />
                    <ReviewRow logos={row2} msPerPixel={15} className="animate-marquee-horizontal-reverse" />
                </>
            )}
        </div>
    )
}

const Framework = ()=>{
    return (
        <div className="relative max-w-6xl mx-auto px-4">
            <ReviewGrid />
        </div>
    )
}

export default Framework
