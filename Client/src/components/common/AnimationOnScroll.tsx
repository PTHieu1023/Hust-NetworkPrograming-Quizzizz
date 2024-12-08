import React, { useEffect, useRef, useState } from 'react'

interface AnimateOnScrollProps {
    children: React.ReactNode
    animationClass?: string // CSS class for the animation
    initialClass?: string // Initial hidden class
}

const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
    children,
    animationClass = 'fade-in', // Default animation
    initialClass = 'hidden-initial' // Initial hidden state
}) => {
    const [isVisible, setIsVisible] = useState(false)
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.2 } // Trigger when 20% of the element is visible
        )

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current)
            }
        }
    }, [])

    return (
        <div ref={elementRef} className={`${initialClass} ${isVisible ? animationClass : ''}`}>
            {children}
        </div>
    )
}

export default AnimateOnScroll
