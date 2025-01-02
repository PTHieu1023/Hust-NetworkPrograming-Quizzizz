import {
    faCalendarDays,
    faClock,
    faFaceGrinTears,
    faLock,
    faPlay,
    faShareNodes
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import roomService from '~/services/room'
import { quizRoom } from '~/types/services'
import { notify } from '~/utility/functions'

const SetupPage: React.FC = () => {
    const { mode } = useParams()
    const quiz = useLocation().state

    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<quizRoom>()

    const openedAt = watch('openedAt')

    const [loading, setLoading] = useState(false)

    const handleCreateRoom = async (data: quizRoom) => {
        data.quizId = quiz.quizId
        if (data.openedAt) {
            const openedDate = new Date(data.openedAt)
            data.openedAt = openedDate.toISOString().slice(0, 19) // Format to YYYY-MM-DDTHH:mm:ss
        }

        if (data.closedAt) {
            const closedDate = new Date(data.closedAt)
            data.closedAt = closedDate.toISOString().slice(0, 19) // Format to YYYY-MM-DDTHH:mm:ss
        }

        data.isPractice = mode === 'practice'
        console.log(data)

        setLoading(true)
        try {
            const response = await roomService.createRoom(data)
            if (response) {
                notify('Room created successfully', 'success')
                navigate(`${ROUTES.QUIZ_ROUTE}/game/${response.code}`, {
                    state: response
                })
            }
        } catch (error) {
            console.error(error)
            notify('Failed to create room', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleChangeTimer = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timerMinutes = Number(e.target.value)
        if (openedAt) {
            const openedDate = new Date(openedAt)
            const closedAt = new Date(
                openedDate.getTime() + timerMinutes * 60000
            )

            // Format to YYYY-MM-DDTHH:mm:ss
            const formattedClosedAt = closedAt.toISOString().slice(0, 19)

            register('closedAt', { value: formattedClosedAt })
        }
    }

    return (
        <div className="flex flex-wrap justify-center max-w-5xl w-full p-4">
            <div className="w-full md:w-2/5 p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col justify-around items-center min-h-64 py-4 px-8 rounded-lg bg-base-100">
                        <div className="flex gap-2 w-full">
                            <div className="bg-neutral rounded-md p-2 aspect-square max-w-32">
                                <span className="text-neutral-content">
                                    Quiz img
                                </span>
                            </div>
                            <div className="text-base-content">
                                <h1 className="text-xl md:text-3xl">
                                    {quiz.name}
                                </h1>
                                <span>
                                    {`${quiz.questions?.length ?? 10} questions`}
                                </span>
                            </div>
                        </div>
                        <span className="btn flex items-center justify-center w-full">
                            <FontAwesomeIcon icon={faShareNodes} />
                            Share
                        </span>
                    </div>
                    <div className="flex flex-col min-h-40 p-8 rounded-lg bg-base-100">
                        <span className="mb-4">Recent activity</span>
                        <span className="ml-4 opacity-50">
                            No activity found
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-3/5 p-4">
                <div className="flex justify-center min-h-64 p-8 rounded-lg bg-base-100">
                    <form
                        className="flex flex-col gap-4 justify-center items-center w-full max-w-96"
                        onSubmit={handleSubmit(handleCreateRoom)}
                    >
                        {mode === 'play' && (
                            <div className="flex flex-col gap-2 justify-center w-full">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Enter room name"
                                    className="input input-bordered w-full "
                                    {...register('name', {
                                        required: 'Room name is required'
                                    })}
                                />
                                {errors.name && (
                                    <span className="text-error text-xs">
                                        {errors.name.message}
                                    </span>
                                )}
                                <input
                                    type="text"
                                    placeholder="Enter room code"
                                    className="input input-bordered w-full "
                                    {...register('code', {
                                        required: 'Room code is required'
                                    })}
                                />
                                {errors.code && (
                                    <span className="text-error text-xs">
                                        {errors.code.message}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="flex flex-col justify-center items-center w-full">
                            <span className="text-left w-full mb-4">
                                Settings
                            </span>
                            <div className="form-control w-full sm:px-4">
                                <label className="label flex-col items-start gap-4 cursor-pointer">
                                    <span className="flex gap-2 items-center w-full">
                                        <FontAwesomeIcon
                                            className="w-6"
                                            icon={faCalendarDays}
                                        />
                                        Started at
                                    </span>
                                    <input
                                        type="datetime-local"
                                        className="input input-bordered w-fit"
                                        {...register('openedAt', {
                                            // valid date after current date
                                            min: {
                                                value: new Date().toISOString(),
                                                message:
                                                    'Start time must be after current time'
                                            }
                                        })}
                                    />
                                    {errors.openedAt && (
                                        <span className="text-error text-xs">
                                            {errors.openedAt.message}
                                        </span>
                                    )}
                                </label>
                            </div>
                            <div className="form-control w-full sm:px-4">
                                <label className="label flex-col gap-4 cursor-pointer">
                                    <span className="flex gap-2 items-center w-full">
                                        <FontAwesomeIcon
                                            className="w-6"
                                            icon={faClock}
                                        />
                                        Timer
                                    </span>
                                    <div className="w-full">
                                        <input
                                            type="range"
                                            min={0}
                                            defaultValue={15}
                                            max="60"
                                            className="range range-secondary"
                                            step="15"
                                            onChange={(e) =>
                                                handleChangeTimer(e)
                                            }
                                        />
                                        <div className="flex w-full justify-between px-4 text-xs">
                                            {['0', '15', '30', '45', '60'].map(
                                                (value) => (
                                                    <div
                                                        key={value}
                                                        className="flex flex-col justify-center items-center"
                                                    >
                                                        <span>|</span>
                                                        <span>{value}</span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </label>
                            </div>
                            <div className="form-control w-full sm:px-4">
                                <label className="label cursor-pointer">
                                    <span className="flex gap-2 items-center">
                                        <FontAwesomeIcon
                                            className="w-6"
                                            icon={faLock}
                                        />
                                        Private
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-accent"
                                        defaultChecked
                                        {...register('isPrivate')}
                                    />
                                </label>
                            </div>
                            <div className="form-control w-full sm:px-4">
                                <label className="label cursor-pointer">
                                    <span className="flex gap-2 items-center">
                                        <FontAwesomeIcon
                                            className="w-6"
                                            icon={faFaceGrinTears}
                                        />
                                        Memes
                                    </span>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-accent"
                                    />
                                </label>
                            </div>
                        </div>
                        <button
                            className="btn btn-accent flex items-center justify-center w-full"
                            type="submit"
                            disabled={loading}
                        >
                            <FontAwesomeIcon icon={faPlay} />
                            {loading ? 'Creating room...' : 'Create room'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SetupPage
