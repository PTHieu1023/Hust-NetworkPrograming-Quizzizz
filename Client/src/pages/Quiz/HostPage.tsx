import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useLocation, useParams } from 'react-router-dom'
import Countdown from '~/components/common/CountDown'

const HostPage: React.FC = () => {
    const { code } = useParams()
    const room = useLocation().state
    const countdown = Math.floor((room.openedAt - Date.now()) / 1000)

    return (
        <div className="max-w-5xl w-full p-4">
            <div className="flex flex-col gap-4 h-min p-4 bg-base-100 rounded-md shadow-lg">
                <h1 className="text-3xl text-center my-4">
                    Waiting for players to join the game...
                </h1>
                <h1 className="text-xl font-bold">
                    Remaining time to start the game:
                </h1>
                <div className="flex justify-center items-center w-full">
                    <Countdown initialTime={countdown} />
                </div>
                <div className="flex flex-col justify-center items-center gap-4">
                    <p className="text-lg w-full">Number of players joined:</p>
                    <div className="flex justify-center items-center gap-4 p-2 bg-primary rounded-md text-primary-content">
                        <FontAwesomeIcon icon={faUsers} />
                        <span>{room?.players?.length ?? 0}</span>
                    </div>
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

export default HostPage
