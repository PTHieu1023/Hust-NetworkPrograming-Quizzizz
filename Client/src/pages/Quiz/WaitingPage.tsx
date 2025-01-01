import { useLocation, useParams } from 'react-router-dom'
import Countdown from '~/components/common/CountDown'

const WaitingPage: React.FC = () => {
    const { code } = useParams()
    const room = useLocation().state
    console.log(room)
    const countdown = Math.floor((room.startedAt - Date.now()) / 1000)

    return (
        <div className="max-w-5xl w-full p-4">
            <div className="flex flex-col gap-4 h-min p-4 bg-base-100 rounded-md shadow-lg">
                <div className="flex gap-4 justify-center items-center">
                    <h2 className="text-3xl text-primary">{room.name}</h2>
                </div>
                <h1 className="text-xl font-bold">
                    Remaining time to start the game:
                </h1>
                <div className="flex justify-center items-center w-full">
                    <Countdown initialTime={countdown} />
                </div>
                <p className="text-lg">
                    Share this code with your friends to join the game:
                </p>
                <div className="flex items-center justify-center mt-4">
                    <div className="text-6xl font-bold">{code}</div>
                </div>
            </div>
        </div>
    )
}

export default WaitingPage
