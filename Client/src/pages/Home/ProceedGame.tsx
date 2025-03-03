import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import { joinQuiz } from '~/store/actions/quiz'
import { clearError } from '~/store/reducers/quiz'
import { useAppDispatch, useAppSelector } from '~/store/reducers/store'
import { notify } from '~/utility/functions'

const ProceedGame: React.FC = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { loading, error } = useAppSelector((state) => state.quiz)

    const [code, setCode] = useState('')
    const handleJoinRoom = async () => {
        if (!code) {
            notify('Please enter a code', 'error')
            return
        }
        await dispatch(joinQuiz(code))
        if (!error) {
            navigate(`${ROUTES.QUIZ_ROUTE}/pre-game/${code}`)
        }
    }

    useEffect(() => {
        if (error) {
            notify(error, 'error')
            dispatch(clearError())
        }
    }, [error, dispatch])

    return (
        <div className="flex lg:flex-row flex-col gap-4 items-center justify-center w-full h-full p-2 bg-base-100 text-base-content bg-opacity-25 rounded-xl shadow-lg">
            <div className="relative h-12 w-full max-w-80 rounded-xl">
                <input
                    type="number"
                    placeholder="Enter a code to join"
                    className="input input-primary input-bordered w-full h-full max-w-md"
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value)
                    }}
                />
                <button
                    className="absolute inset-y-0 right-0 btn btn-primary w-20"
                    onClick={handleJoinRoom}
                    disabled={loading}
                >
                    JOIN
                </button>
            </div>
            <Link
                to={`${ROUTES.QUIZ_ROUTE}/create`}
                className="btn w-full max-w-80 lg:w-auto btn-accent"
            >
                Make your own quiz
            </Link>
            {/* <button className="btn" onClick={() => dispatch(clearError())}>
                Clear
            </button> */}
        </div>
    )
}

export default ProceedGame
