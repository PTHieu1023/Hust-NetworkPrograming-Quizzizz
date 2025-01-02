import { faSnowflake } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Snowfall: React.FC<{ numOfSnowBall?: number }> = ({
    numOfSnowBall = 50
}) => {
    const snowflakes = Array.from({ length: numOfSnowBall })

    return (
        <div className="fixed top-0 -z-10 h-screen w-screen overflow-hidden">
            {snowflakes.map((_, index) => {
                const horizontalDirection = Math.random() > 0.5 ? 1 : -1 // Random left or right drift
                const horizontalDistance = Math.random() * 10 // Random horizontal drift distance

                return (
                    <div
                        key={index}
                        className="snowflake absolute text-white text-2xl"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 5}s`,
                            transform: `translateX(${horizontalDirection * horizontalDistance}vw)`
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faSnowflake}
                            className={`text-white w-${[1, 2, 4, 6][Math.floor(Math.random() * 4)]} h-auto animate-pulse`}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export default Snowfall
