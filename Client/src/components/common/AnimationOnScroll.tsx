import React, { useEffect, useRef, useState } from 'react'

interface AnimateOnScrollProps {
    children: React.ReactNode
    animationClass?: string // CSS class for the animation
    className?: string
    threshold?: number // Intersection observer threshold
}

const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
    children,
    animationClass = 'fade-in', // Default animation
    className = '',
    threshold = 0.2 // Default threshold
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
            { threshold: threshold } // Trigger when 20% of the element is visible
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
        <div ref={elementRef} className={`${className} ${isVisible ? animationClass : ''}`}>
            {children}
        </div>
    )
}

export default AnimateOnScroll
