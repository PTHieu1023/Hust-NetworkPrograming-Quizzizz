import {
    faChevronLeft,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'

interface SliderProps {
    className?: string
    children: React.ReactNode[]
    autoSlide?: boolean
    interval?: number
    animationSpeed?: number
    eleEachSlide?: number
}
const Slider: React.FC<SliderProps> = ({
    className = '',
    children,
    autoSlide = true,
    interval = 3000,
    eleEachSlide = 1,
    ...props
}) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const nextSlide = () => {
        setCurrentSlide((currentSlide + 1) % children?.length)
    }
    const prevSlide = () => {
        setCurrentSlide(
            (currentSlide - 1 + children?.length) % children?.length
        )
    }

    useEffect(() => {
        if (autoSlide) {
            const intervalId = setInterval(nextSlide, interval)
            return () => clearInterval(intervalId)
        }
    }, [currentSlide])

    return (
        <div
            {...props}
            className={`relative overflow-hidden w-full max-w-xl ${className}`}
        >
            <div
                className="flex transition-transform ease-out duration-500"
                style={{
                    transform: `translateX(-${(currentSlide * 100) / eleEachSlide}%)`
                }}
            >
                {children}
            </div>
            <div className="absolute inset-0 flex items-center justify-between">
                <button
                    className="rounded-full bg-base-100 hover:bg-opacity-80"
                    onClick={prevSlide}
                >
                    <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="w-8 py-4"
                    />
                </button>
                <button
                    className="rounded-full bg-base-100 hover:bg-opacity-80"
                    onClick={nextSlide}
                >
                    <FontAwesomeIcon
                        icon={faChevronRight}
                        className="w-8 py-4"
                    />
                </button>
            </div>
            <div className="absolute bottom-16 inset-x-0 flex justify-center">
                {children.map((_, index) => (
                    <button
                        key={index}
                        className={`w-6 h-6 rounded-full bg-base-200 mx-1 hover:bg-opacity-80 ${currentSlide === index ? 'bg-base-100' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </div>
    )
}

export default Slider
