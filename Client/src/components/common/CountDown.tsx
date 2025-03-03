import React, { useEffect, useState } from 'react'

const Countdown: React.FC<{ initialTime: number }> = ({ initialTime }) => {
    const [time, setTime] = useState(initialTime)

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prevTime) => Math.max(prevTime - 1, 0))
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        return { hours, minutes, seconds }
    }

    const { hours, minutes, seconds } = formatTime(time)

    return (
        <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-5xl">
                    <span
                        style={{ '--value': hours } as React.CSSProperties}
                    ></span>
                </span>
                hours
            </div>
            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-5xl">
                    <span
                        style={{ '--value': minutes } as React.CSSProperties}
                    ></span>
                </span>
                min
            </div>
            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-5xl">
                    <span
                        style={{ '--value': seconds } as React.CSSProperties}
                    ></span>
                </span>
                sec
            </div>
        </div>
    )
}

export default Countdown
