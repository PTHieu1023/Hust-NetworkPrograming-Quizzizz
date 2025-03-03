import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Countdown from '~/components/common/CountDown'
import { ROUTES } from '~/resources/routes-constants'
import { getQuizQuestions } from '~/store/actions/quiz'
import { clearError } from '~/store/reducers/auth'
import { useAppDispatch, useAppSelector } from '~/store/reducers/store'
import { notify } from '~/utility/functions'

const WaitingPage: React.FC = () => {
    const { code } = useParams()
    const { room, loading, error, questions } = useAppSelector(
        (state) => state.quiz
    )

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const startedAt = new Date(room?.openedAt as string).getTime()
    const [countdown, setCountdown] = useState<number>(
        Math.floor((startedAt - Date.now()) / 1000 + 25200)
    )

    useEffect(() => {
        if (countdown <= 0) return
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (error) {
            notify(error, 'error')
            dispatch(clearError())
        }
    }, [error, dispatch])

    const handleStart = async () => {
        await dispatch(
            getQuizQuestions({ roomId: room?.roomId as number, page: 1 })
        )
        if (questions?.length)
            navigate(`${ROUTES.QUIZ_ROUTE}/game/${code}/play`)
        else notify('Failed to start the game', 'error')
    }

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
                <p className="text-lg">
                    Share this code with your friends to join the game:
                </p>
                <div className="flex items-center justify-center mt-4">
                    <div className="text-6xl font-bold">{code}</div>
                </div>
                <button
                    disabled={countdown > 0 || loading}
                    onClick={handleStart}
                    className="btn btn-accent"
                >
                    Start
                </button>
            </div>
        </div>
    )
}

export default WaitingPage
